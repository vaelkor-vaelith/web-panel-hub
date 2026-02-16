import type { GameState, Side, CombatEvent, CardInstance } from './types';
import { deployCard, useActiveAbility, ACTIVE_ABILITY_CARDS } from './engine';
import { hasAdvantage, hasDisadvantage } from './engine';
import { buildFullDocumentContext, logThinkingToTerminal } from './gameDocuments';

// ============================================================================
// DeepSeek R1 AI Player - FULL UNIVERSE KNOWLEDGE, UNRESTRICTED, UNABRIDGED
// R1 gets ALL 3 documents in FULL, UNMODIFIED form every turn.
// No summaries, no compression, no simplification, no condensation.
// deepseek-reasoner doesn't support tools, so we give it everything directly.
// Max token budget - let this genius machine think as deep as it wants.
// ============================================================================

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

// Full document context - loaded once, reused every turn
const FULL_DOCUMENT_CONTEXT = buildFullDocumentContext();

interface AIThinkingCallback {
  (thinking: string): void;
}

interface DeployAction {
  handIndex: number;
  slotIndex: number;
}

// ============================================================================
// Board serializer - converts live game state into readable text for the AI
// ============================================================================
function serializeBoard(game: GameState, side: Side): string {
  const me = side === 'player' ? game.player : game.opponent;
  const opp = side === 'player' ? game.opponent : game.player;

  // Internal tracking tags that should NOT be shown to AIs
  const INTERNAL_TAGS = new Set([
    'synergy3_hp', 'dorian_aura', 'dorian_aura_paused',
    'thornwall_aura', 'thornwall_aura_paused',
    'aurelia_aura', 'aurelia_aura_paused',
  ]);

  const serializeCard = (c: CardInstance | null, idx: number): string => {
    if (!c) return `  Slot ${idx}: [EMPTY]`;
    const visibleStatuses = c.statusEffects.filter(e => !INTERNAL_TAGS.has(e.type));
    const statuses = visibleStatuses.map(e => `${e.type}(${e.duration})`).join(', ') || 'none';
    const tags: string[] = [];
    if (['RS-E-01', 'RS-C-06', 'IB-L-01', 'IB-E-01', 'IB-R-01', 'IB-C-01'].includes(c.id)) tags.push('TAUNT');
    if (['EP-L-01', 'EP-E-01', 'EP-C-07'].includes(c.id)) tags.push('LIFESTEAL');
    if (c.shield > 0) tags.push(`SHIELD:${c.shield}`);
    return `  Slot ${idx}: ${c.name} [${c.id}] | ${c.tribe} | ATK:${c.currentAtk} HP:${c.currentHp}/${c.maxHp} | Cost:${c.cost} | ${c.abilityName} | Status: ${statuses}${tags.length ? ' | ' + tags.join(', ') : ''}`;
  };

  const serializeHand = (cards: CardInstance[]): string => {
    return cards.map((c, i) =>
      `  [${i}] ${c.name} [${c.id}] | ${c.tribe} | Cost:${c.cost} | ATK:${c.baseAtk} HP:${c.baseHp} | ${c.abilityName}: ${c.abilityDesc}`
    ).join('\n');
  };

  // Per-player turn = how many turns THIS player has taken (energy matches this)
  const myTurn = Math.ceil(game.turn / 2);

  return `=== GAME STATE (Round ${myTurn}, Global Turn ${game.turn}) ===
MY STATUS: HP ${me.hp}/20 | Energy ${me.energy}/${me.maxEnergy} (= round number, max 10) | Deck: ${me.deck.length} cards | Graveyard: ${me.graveyard.length}
MY FIELD:
${[0, 1, 2].map(i => serializeCard(me.field[i], i)).join('\n')}

MY HAND (${me.hand.length} cards):
${serializeHand(me.hand)}

OPPONENT STATUS: HP ${opp.hp}/20 | Energy: unknown | Deck: ${opp.deck.length} cards
OPPONENT FIELD:
${[0, 1, 2].map(i => serializeCard(opp.field[i], i)).join('\n')}`;
}

// ============================================================================
// Call DeepSeek R1 with streaming - lean context, no tools
// ============================================================================
async function callDeepSeek(
  systemPrompt: string,
  userPrompt: string,
  playerName: string,
  onThinking?: AIThinkingCallback
): Promise<string> {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logThinkingToTerminal(playerName, attempt > 1 ? `(retry ${attempt}/${MAX_RETRIES})` : '', 'opponent', 'start');

      // Abort controller covers BOTH the fetch AND the stream reading
      const abortController = new AbortController();
      // Total timeout: 90s. If R1 can't finish a turn in 90s, retry.
      const totalTimeout = setTimeout(() => abortController.abort(), 90_000);

      const response = await fetch('/api/deepseek/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 16384,  // Reduced from 32768 — R1 was writing novels
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        clearTimeout(totalTimeout);
        const err = await response.text();
        console.error(`[DeepSeek Attempt ${attempt}] API Error`, response.status, err);
        const errMsg = `[API Error ${response.status}] ${err.slice(0, 300)}`;
        onThinking?.(errMsg);
        logThinkingToTerminal(playerName, errMsg, 'opponent', 'thinking');
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 3000 * attempt)); // backoff
          continue;
        }
        return '';
      }

      const reader = response.body?.getReader();
      if (!reader) {
        clearTimeout(totalTimeout);
        console.error('[DeepSeek] No response body reader');
        if (attempt < MAX_RETRIES) continue;
        return '';
      }

      const decoder = new TextDecoder();
      let reasoningContent = '';
      let content = '';
      let buffer = '';
      let lastChunkTime = Date.now();

      // Stream reading with per-chunk stall detection
      while (true) {
        // Race: read next chunk vs 30s stall timeout
        const chunkPromise = reader.read();
        const stallTimeout = new Promise<{done: true, value: undefined}>((resolve) =>
          setTimeout(() => resolve({done: true, value: undefined}), 30_000)
        );

        const { done, value } = await Promise.race([chunkPromise, stallTimeout]);
        if (done) {
          // Check if this was a stall timeout vs natural end
          if (Date.now() - lastChunkTime > 29_000 && !content) {
            console.warn(`[DeepSeek Attempt ${attempt}] Stream stalled — no data for 30s`);
            reader.cancel().catch(() => {});
            clearTimeout(totalTimeout);
            if (attempt < MAX_RETRIES) {
              const errMsg = `[Stream stalled, retrying ${attempt + 1}/${MAX_RETRIES}...]`;
              onThinking?.(errMsg);
              logThinkingToTerminal(playerName, errMsg, 'opponent', 'thinking');
              await new Promise(r => setTimeout(r, 2000));
              break; // break inner while, continue outer retry loop
            }
            return '';
          }
          break;
        }

        lastChunkTime = Date.now();
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta;
            if (!delta) continue;

            if (delta.reasoning_content) {
              reasoningContent += delta.reasoning_content;
              onThinking?.(reasoningContent);
              logThinkingToTerminal(playerName, reasoningContent, 'opponent', 'thinking');
            }

            if (delta.content) {
              content += delta.content;
            }
          } catch {
            // Malformed JSON chunk - skip
          }
        }
      }

      clearTimeout(totalTimeout);

      // If we broke out due to stall and need to retry, continue loop
      if (!content && attempt < MAX_RETRIES && Date.now() - lastChunkTime > 29_000) {
        continue;
      }

      // Fallback: check for <think> tags
      const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
      if (thinkMatch) {
        if (!reasoningContent && onThinking) {
          onThinking(thinkMatch[1]);
        }
        content = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
      }

      console.log('[DeepSeek] Reasoning:', reasoningContent.length, 'chars | Content:', content.length, 'chars');
      logThinkingToTerminal(playerName, String(reasoningContent.length), 'opponent', 'done');
      return content;
    } catch (error) {
      console.error(`[DeepSeek Attempt ${attempt}] Error:`, error);
      const errMsg = `[Connection Error, attempt ${attempt}/${MAX_RETRIES}] ${String(error).slice(0, 200)}`;
      onThinking?.(errMsg);
      logThinkingToTerminal(playerName, errMsg, 'opponent', 'thinking');
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 3000 * attempt));
        continue;
      }
      return '';
    }
  }
  return '';
}

function parseJSON(text: string): any {
  try { return JSON.parse(text); } catch {}
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) { try { return JSON.parse(fenceMatch[1].trim()); } catch {} }
  const jsonMatch = text.match(/[\[{][\s\S]*[\]}]/);
  if (jsonMatch) { try { return JSON.parse(jsonMatch[0]); } catch {} }
  return null;
}

// ============================================================================
// Smart Heuristic AI (instant, no API needed)
// ============================================================================
export function runSmartAI(inputState: GameState, side: Side): { state: GameState; events: CombatEvent[] } {
  let state = structuredClone(inputState);
  const allEvents: CombatEvent[] = [];
  const me = side === 'player' ? state.player : state.opponent;

  const scoredHand = me.hand
    .map((card, i) => {
      let score = 0;
      if (card.cost > me.energy) return { card, index: i, score: -999 };

      score += (card.baseAtk + card.baseHp) * 2;

      const opp = side === 'player' ? state.opponent : state.player;
      const oppCards = opp.field.filter(Boolean) as CardInstance[];
      for (const oc of oppCards) {
        if (hasAdvantage(card.tribe, oc.tribe)) score += 5;
        if (hasDisadvantage(card.tribe, oc.tribe)) score -= 3;
      }

      const myTribeCount = me.field.filter(c => c && c.tribe === card.tribe).length;
      if (myTribeCount >= 1) score += 4;
      if (myTribeCount >= 2) score += 6;

      if (card.rarity === 'mythic') score += 15;
      if (card.rarity === 'legendary') score += 10;
      if (card.rarity === 'epic') score += 6;

      const myFieldCount = me.field.filter(Boolean).length;
      if (myFieldCount === 0) score += 10;

      return { card, index: i, score };
    })
    .filter(x => x.score > -999)
    .sort((a, b) => b.score - a.score);

  for (const { card } of scoredHand) {
    if (card.cost > me.energy) continue;
    const handIdx = me.hand.findIndex(c => c.instanceId === card.instanceId);
    if (handIdx === -1) continue;
    const emptySlot = me.field.findIndex(s => s === null);
    if (emptySlot === -1) break;
    const result = deployCard(state, handIdx, emptySlot);
    state = result.state;
    allEvents.push(...result.events);
    const updatedMe = side === 'player' ? state.player : state.opponent;
    if (card.cost > updatedMe.energy) break;
  }

  const currentMe = side === 'player' ? state.player : state.opponent;
  for (const card of currentMe.field) {
    if (card && ACTIVE_ABILITY_CARDS.includes(card.id) && !card.activeUsed) {
      if ((card.id === 'EP-E-02' && currentMe.hp <= 5) || (card.id === 'EP-C-06' && currentMe.hp <= 3)) continue;
      const result = useActiveAbility(state, card.instanceId, side);
      state = result.state;
      allEvents.push(...result.events);
    }
  }

  return { state, events: allEvents };
}

// ============================================================================
// DeepSeek R1 AI - Full unabridged documents + board state
// ============================================================================
export async function runDeepSeekAI(
  inputState: GameState,
  side: Side,
  playerName: string,
  onThinking?: AIThinkingCallback
): Promise<{ state: GameState; events: CombatEvent[] }> {
  let state = structuredClone(inputState);
  const allEvents: CombatEvent[] = [];
  const me = side === 'player' ? state.player : state.opponent;

  const playableCards = me.hand.filter(c => c.cost <= me.energy);
  const emptySlots = me.field.filter(s => s === null).length;

  if (playableCards.length === 0 || emptySlots === 0) {
    for (const card of me.field) {
      if (card && ACTIVE_ABILITY_CARDS.includes(card.id) && !card.activeUsed) {
        const result = useActiveAbility(state, card.instanceId, side);
        state = result.state;
        allEvents.push(...result.events);
      }
    }
    return { state, events: allEvents };
  }

  const boardState = serializeBoard(state, side);

  const systemPrompt = `You are ${playerName}, a master strategist in The Shattered Dominion.

${FULL_DOCUMENT_CONTEXT}

The documents above are the COMPLETE, UNABRIDGED, AUTHORITATIVE source of truth for every rule, every card stat, every ability, every keyword, every damage formula step, every tribal interaction, every balance change (v1.1 and v1.2), and all world lore. There is NO other source. Trust these documents absolutely. If anything seems unclear, re-read the relevant section - the answer is in these documents.

YOUR TASK:
Deploy cards from your hand. Respond with ONLY a JSON array of deploy actions.
Each action: { "handIndex": <number>, "slotIndex": <number> }
- handIndex = index in your hand (0-based)
- slotIndex = field slot (0, 1, or 2) - must be EMPTY
- Total cost must not exceed your energy
- Return [] to deploy nothing

IMPORTANT: Respond with ONLY the JSON array, no other text.`;

  const userPrompt = `${boardState}

What cards should I deploy? Consider:
1. Tribal advantages against opponent's field
2. Tribal synergy (2+ same tribe on field)
3. Best use of my ${me.energy} energy
4. Board presence urgency
5. Damage formula breakpoints (ceil(ATK * tribal_multiplier))
6. Card ability interactions`;

  const response = await callDeepSeek(systemPrompt, userPrompt, playerName, onThinking);
  const actions = parseJSON(response) as DeployAction[] | null;

  if (actions && Array.isArray(actions)) {
    for (const action of actions) {
      const { handIndex, slotIndex } = action;
      if (typeof handIndex !== 'number' || typeof slotIndex !== 'number') continue;
      if (slotIndex < 0 || slotIndex > 2) continue;
      const currentMe = side === 'player' ? state.player : state.opponent;
      if (handIndex < 0 || handIndex >= currentMe.hand.length) continue;
      if (currentMe.field[slotIndex] !== null) continue;

      const card = currentMe.hand[handIndex];
      if (!card || card.cost > currentMe.energy) continue;

      const result = deployCard(state, handIndex, slotIndex);
      state = result.state;
      allEvents.push(...result.events);
    }
  } else {
    console.warn('[DeepSeek] Failed to parse deploy actions, using heuristic');
    return runSmartAI(inputState, side);
  }

  const currentMe = side === 'player' ? state.player : state.opponent;
  for (const card of currentMe.field) {
    if (card && ACTIVE_ABILITY_CARDS.includes(card.id) && !card.activeUsed) {
      if ((card.id === 'EP-E-02' && currentMe.hp <= 5) || (card.id === 'EP-C-06' && currentMe.hp <= 3)) continue;
      const result = useActiveAbility(state, card.instanceId, side);
      state = result.state;
      allEvents.push(...result.events);
    }
  }

  return { state, events: allEvents };
}

// ============================================================================
// Backward-compatible runAI
// ============================================================================
export function runAI(inputState: GameState): { state: GameState; events: CombatEvent[] } {
  return runSmartAI(inputState, 'opponent');
}
