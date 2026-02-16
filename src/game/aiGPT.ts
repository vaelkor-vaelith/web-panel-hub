import type { GameState, Side, CombatEvent, CardInstance } from './types';
import { deployCard, useActiveAbility, ACTIVE_ABILITY_CARDS } from './engine';
import { hasAdvantage, hasDisadvantage } from './engine';
import {
  RULES_SUMMARY,
  DOCUMENT_CATALOG,
  LOOKUP_TOOL_RESPONSES,
  lookupDocument,
  logThinkingToTerminal,
} from './gameDocuments';

// ============================================================================
// OpenAI GPT-5.2 AI Player - Responses API with Reasoning + Tool Calling
// The AI gets a lean rules summary (~800 tokens) and can look up specific
// documents on demand via the lookup_game_document tool.
// No more dumping 300KB of docs every turn.
// ============================================================================

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

interface AIThinkingCallback {
  (thinking: string): void;
}

interface DeployAction {
  handIndex: number;
  slotIndex: number;
}

interface FunctionCall {
  callId: string;
  name: string;
  arguments: string;
}

interface StreamResult {
  reasoningText: string;
  contentText: string;
  functionCalls: FunctionCall[];
  responseId: string;
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
// Parse a streaming response from the Responses API
// Handles: reasoning deltas, content deltas, function call events, response ID
// ============================================================================
async function parseResponseStream(
  response: Response,
  onThinking: AIThinkingCallback | undefined,
  existingReasoning: string,
  playerName: string,
): Promise<StreamResult> {
  const reader = response.body?.getReader();
  if (!reader) {
    return { reasoningText: existingReasoning, contentText: '', functionCalls: [], responseId: '' };
  }

  const decoder = new TextDecoder();
  let reasoningText = existingReasoning;
  let contentText = '';
  const functionCalls: FunctionCall[] = [];
  let responseId = '';
  let buffer = '';
  let currentEventType = '';

  // Track function call being built from streaming deltas
  let pendingFnCall: { callId: string; name: string; arguments: string } | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        currentEventType = '';
        continue;
      }

      if (trimmed.startsWith('event: ')) {
        currentEventType = trimmed.slice(7).trim();
        continue;
      }

      if (!trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);

        // ── Response created: extract response ID ──
        if (currentEventType === 'response.created') {
          responseId = parsed.id || '';
          continue;
        }

        // ── Reasoning summary text delta ──
        if (currentEventType.includes('reasoning_summary_text') && currentEventType.includes('delta')) {
          const delta = parsed.delta || parsed.text || '';
          if (delta) {
            reasoningText += delta;
            onThinking?.(reasoningText);
            logThinkingToTerminal(playerName, reasoningText, 'player', 'thinking');
          }
          continue;
        }

        // ── Output text delta (final JSON answer) ──
        if (currentEventType.includes('output_text') && currentEventType.includes('delta')) {
          const delta = parsed.delta || parsed.text || '';
          if (delta) contentText += delta;
          continue;
        }

        // ── Function call: new output item added ──
        if (currentEventType === 'response.output_item.added') {
          const item = parsed.item || parsed;
          if (item.type === 'function_call') {
            pendingFnCall = {
              callId: item.call_id || item.id || '',
              name: item.name || '',
              arguments: '',
            };
          }
          continue;
        }

        // ── Function call: arguments streaming ──
        if (currentEventType === 'response.function_call_arguments.delta') {
          if (pendingFnCall) {
            pendingFnCall.arguments += parsed.delta || '';
          }
          continue;
        }

        // ── Function call: arguments complete ──
        if (currentEventType === 'response.function_call_arguments.done') {
          if (pendingFnCall) {
            pendingFnCall.arguments = parsed.arguments || pendingFnCall.arguments;
            functionCalls.push(pendingFnCall);
            // Show the tool call in the thinking panel
            const label = `\n[Tool Call: lookup_game_document(${pendingFnCall.arguments})]`;
            reasoningText += label;
            onThinking?.(reasoningText);
            logThinkingToTerminal(playerName, label, 'player', 'tool_call');
            pendingFnCall = null;
          }
          continue;
        }

        // ── Function call: output item done (backup capture) ──
        if (currentEventType === 'response.output_item.done') {
          const item = parsed.item || parsed;
          if (item.type === 'function_call') {
            const exists = functionCalls.some(fc => fc.callId === (item.call_id || item.id));
            if (!exists) {
              functionCalls.push({
                callId: item.call_id || item.id || '',
                name: item.name || '',
                arguments: item.arguments || '',
              });
            }
          }
          continue;
        }

        // ── Response completed: extract any missed data ──
        if (currentEventType === 'response.completed') {
          const resp = parsed.response || parsed;
          if (resp.id) responseId = resp.id;
          const output = resp.output || parsed.output;
          if (Array.isArray(output)) {
            for (const item of output) {
              if (item.type === 'reasoning' && Array.isArray(item.summary)) {
                for (const s of item.summary) {
                  if (s.text && !reasoningText) {
                    reasoningText = s.text;
                    onThinking?.(reasoningText);
                  }
                }
              }
              if (item.type === 'message' && Array.isArray(item.content)) {
                for (const c of item.content) {
                  if (c.text && !contentText) contentText = c.text;
                }
              }
              if (item.type === 'function_call') {
                const exists = functionCalls.some(fc => fc.callId === (item.call_id || item.id));
                if (!exists) {
                  functionCalls.push({
                    callId: item.call_id || item.id || '',
                    name: item.name || '',
                    arguments: item.arguments || '',
                  });
                }
              }
            }
          }
          continue;
        }

        // ── Fallback: Chat Completions style delta ──
        const delta = parsed.choices?.[0]?.delta;
        if (delta) {
          const reasoning = delta.reasoning_content || delta.reasoning;
          if (reasoning) {
            reasoningText += reasoning;
            onThinking?.(reasoningText);
            logThinkingToTerminal(playerName, reasoningText, 'player', 'thinking');
          }
          if (delta.content) contentText += delta.content;
        }

        // ── Fallback: content_part.delta ──
        if (parsed.type === 'content_part.delta' || parsed.type === 'response.content_part.delta') {
          const dt = parsed.delta;
          if (dt?.type === 'reasoning_summary_text_delta' && dt.text) {
            reasoningText += dt.text;
            onThinking?.(reasoningText);
            logThinkingToTerminal(playerName, reasoningText, 'player', 'thinking');
          }
          if (dt?.type === 'output_text_delta' && dt.text) contentText += dt.text;
        }
      } catch {
        // Malformed JSON chunk - skip
      }
    }
  }

  return { reasoningText, contentText, functionCalls, responseId };
}

// ============================================================================
// Call GPT-5.2 via the Responses API with multi-round tool calling
//
// Flow:
// 1. Send lean prompt (rules summary + game state + tool definition)
// 2. If GPT calls lookup_game_document → resolve it, send doc content back
// 3. GPT continues reasoning with the document → returns final JSON answer
// 4. Max 4 rounds to prevent infinite loops
// ============================================================================
async function callGPT(
  systemPrompt: string,
  userPrompt: string,
  playerName: string,
  onThinking?: AIThinkingCallback
): Promise<string> {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logThinkingToTerminal(playerName, attempt > 1 ? `(retry ${attempt}/${MAX_RETRIES})` : '', 'player', 'start');

      let input: any[] = [
        { role: 'developer', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      let previousResponseId: string | null = null;
      let reasoningText = '';
      let contentText = '';
      const MAX_ROUNDS = 4;

      for (let round = 0; round < MAX_ROUNDS; round++) {
        const requestBody: any = {
          model: 'gpt-5.2',
          reasoning: { effort: 'high', summary: 'detailed' },
          tools: [LOOKUP_TOOL_RESPONSES],
          max_output_tokens: 16384,  // Reduced from 32768 for faster turns
          stream: true,
        };

        if (previousResponseId) {
          requestBody.previous_response_id = previousResponseId;
          requestBody.input = input;
        } else {
          requestBody.input = input;
        }

        // Total timeout: 90s per round (covers fetch + stream)
        const abortController = new AbortController();
        const timeout = setTimeout(() => abortController.abort(), 90_000);

        const response = await fetch('/api/openai/v1/responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify(requestBody),
          signal: abortController.signal,
        });

        if (!response.ok) {
          clearTimeout(timeout);
          const err = await response.text();
          console.error(`[GPT-5.2 Round ${round}, Attempt ${attempt}] API Error`, response.status, err);
          const errMsg = `[API Error ${response.status}]\n${err.slice(0, 500)}`;
          onThinking?.(errMsg);
          logThinkingToTerminal(playerName, errMsg, 'player', 'thinking');
          // Break inner loop to trigger retry
          contentText = '';
          break;
        }

        // Parse streaming response with timeout protection
        const streamTimeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Stream timeout after 90s')), 90_000)
        );
        const result = await Promise.race([
          parseResponseStream(response, onThinking, reasoningText, playerName),
          streamTimeout,
        ]);

        clearTimeout(timeout);
        reasoningText = result.reasoningText;
        contentText = result.contentText;

        if (result.functionCalls.length === 0) {
          console.log(`[GPT-5.2] Done in ${round + 1} round(s)`);
          break;
        }

        // Resolve tool calls
        previousResponseId = result.responseId;
        input = [];

        for (const fc of result.functionCalls) {
          try {
            const args = JSON.parse(fc.arguments);
            const docContent = lookupDocument(args.document);
            const sizeKB = Math.round(docContent.length / 1024);

            const label = `[Retrieved: ${args.document} (${sizeKB}KB)]`;
            reasoningText += `\n${label}\n`;
            onThinking?.(reasoningText);
            logThinkingToTerminal(playerName, label, 'player', 'tool_call');

            input.push({
              type: 'function_call_output',
              call_id: fc.callId,
              output: docContent,
            });
          } catch {
            input.push({
              type: 'function_call_output',
              call_id: fc.callId,
              output: 'Error: could not parse tool arguments',
            });
          }
        }
      }

      // If we got content, we're done
      if (contentText) {
        const thinkMatch = contentText.match(/<think>([\s\S]*?)<\/think>/);
        if (thinkMatch) {
          if (!reasoningText && onThinking) {
            reasoningText = thinkMatch[1];
            onThinking(reasoningText);
          }
          contentText = contentText.replace(/<think>[\s\S]*?<\/think>/, '').trim();
        }

        console.log('[GPT-5.2] Reasoning:', reasoningText.length, 'chars | Content:', contentText.length, 'chars');
        logThinkingToTerminal(playerName, String(reasoningText.length), 'player', 'done');
        return contentText;
      }

      // No content — retry
      if (attempt < MAX_RETRIES) {
        const errMsg = `[No response, retrying ${attempt + 1}/${MAX_RETRIES}...]`;
        onThinking?.(errMsg);
        logThinkingToTerminal(playerName, errMsg, 'player', 'thinking');
        await new Promise(r => setTimeout(r, 3000 * attempt));
        continue;
      }
      return '';
    } catch (error) {
      console.error(`[GPT-5.2 Attempt ${attempt}] Error:`, error);
      const errMsg = `[Connection Error, attempt ${attempt}/${MAX_RETRIES}] ${String(error).slice(0, 300)}`;
      onThinking?.(errMsg);
      logThinkingToTerminal(playerName, errMsg, 'player', 'thinking');
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
// GPT-5.2 AI - Lean prompt + tool-based document lookup
// ============================================================================
export async function runOpenAIGPT(
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

${RULES_SUMMARY}

${DOCUMENT_CATALOG}

You have a lookup_game_document tool available. Use it to check card stats, rules, or balance changes when you need to - but you don't have to read everything every turn. The board state below already shows your hand cards with full stats.

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
5. Damage formula breakpoints
6. Card ability interactions and v1.2 keywords (Shadow Mark, Hush, Sabotage, Farsight, etc.)`;

  const response = await callGPT(systemPrompt, userPrompt, playerName, onThinking);
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
    console.warn('[GPT-5.2] Failed to parse deploy actions, using heuristic');
    const { runSmartAI } = await import('./aiDeepSeek');
    return runSmartAI(inputState, side);
  }

  // Use active abilities
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
