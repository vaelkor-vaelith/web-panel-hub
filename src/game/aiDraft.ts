import type { DraftState } from './draftEngine';
import { getCurrentStep, serializeDraftState, smartDraftPick, ROUND_NAMES } from './draftEngine';
import { RULES_SUMMARY, logThinkingToTerminal } from './gameDocuments';

// ============================================================================
// AI DRAFT DECISION MAKERS — GPT-5.2 & DeepSeek R1
// Streaming reasoning displayed in thinking panels during draft
// ============================================================================

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

interface AIThinkingCallback {
  (thinking: string): void;
}

function buildDraftPrompt(state: DraftState, side: 'p1' | 'p2', playerName: string): { system: string; user: string } {
  const step = getCurrentStep(state)!;
  const actionVerb = step.phase === 'ban' ? 'BAN' : 'PICK';

  const system = `You are ${playerName}, a master strategist drafting cards in The Shattered Dominion - Captain Mode.

${RULES_SUMMARY}

CAPTAIN MODE DRAFT RULES:
- 54 cards total. Each player picks 15 cards → their battle deck. 3 bans each (6 total).
- 3 rounds: Declaration → Confrontation → Resolution. Snake draft pattern.
- Each card is EXCLUSIVE — once picked, the opponent cannot have it.
- Mythics are usually banned in Round 1 (Vaelkor + Vaelith). Deviating is a strategic signal.

TRIBAL ADVANTAGE: Shadow > Fire > Earth > Light > Shadow (×1.5 damage)
SYNERGY: 2+ same tribe on field = +1 ATK each. 3 same tribe = +2 ATK and +1 HP each.

ENERGY CURVE (critical at 15-card decks):
- Need 5-6 cards costing 1-2 for consistent openings
- 4-5 cards costing 3-4 as midgame backbone
- 2-3 cards costing 5-6 for power plays
- 1-2 cards costing 7+ maximum (more risks bricking)

${step.phase === 'ban'
  ? 'BAN STRATEGY: Remove the most dangerous card. Consider what counters your developing strategy.'
  : 'PICK STRATEGY: Strengthen your deck while denying your opponent. Balance synergy, curve, and power.'}

YOUR TASK: ${actionVerb} one card. Respond with ONLY the card ID (e.g., "OV-L-01"). No other text.`;

  const user = serializeDraftState(state, side);
  return { system, user };
}

function parseCardId(text: string, pool: { id: string }[]): string | null {
  const trimmed = text.trim().replace(/["`']/g, '');
  const direct = pool.find(c => c.id === trimmed);
  if (direct) return direct.id;
  const match = trimmed.match(/[A-Z]{2}-[A-Z]-\d{2}/);
  if (match) {
    const found = pool.find(c => c.id === match[0]);
    if (found) return found.id;
  }
  const mythicMatch = trimmed.match(/MY-M-\d{2}/);
  if (mythicMatch) {
    const found = pool.find(c => c.id === mythicMatch[0]);
    if (found) return found.id;
  }
  return null;
}

// ============================================================================
// GPT-5.2 Draft — Responses API with streaming reasoning
// ============================================================================
export async function draftWithGPT(
  state: DraftState,
  side: 'p1' | 'p2',
  playerName: string,
  onThinking?: AIThinkingCallback
): Promise<string> {
  const step = getCurrentStep(state);
  if (!step) return smartDraftPick(state);
  if (!OPENAI_API_KEY) return smartDraftPick(state);

  const { system, user } = buildDraftPrompt(state, side, playerName);

  try {
    logThinkingToTerminal(playerName, '', 'player', 'start');
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 60_000);

    const response = await fetch('/api/openai/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        model: 'gpt-5.2',
        reasoning: { effort: 'medium', summary: 'detailed' },
        max_output_tokens: 512,
        stream: true,
        input: [
          { role: 'developer', content: system },
          { role: 'user', content: user },
        ],
      }),
      signal: abortController.signal,
    });

    clearTimeout(timeout);
    if (!response.ok) {
      console.error('[GPT Draft] API Error', response.status);
      return smartDraftPick(state);
    }

    const reader = response.body?.getReader();
    if (!reader) return smartDraftPick(state);

    const decoder = new TextDecoder();
    let reasoningText = '';
    let contentText = '';
    let buffer = '';
    let currentEventType = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) { currentEventType = ''; continue; }
        if (trimmed.startsWith('event: ')) { currentEventType = trimmed.slice(7).trim(); continue; }
        if (!trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          if (currentEventType.includes('reasoning_summary_text') && currentEventType.includes('delta')) {
            const delta = parsed.delta || '';
            if (delta) { reasoningText += delta; onThinking?.(reasoningText); logThinkingToTerminal(playerName, reasoningText, 'player', 'thinking'); }
          }
          if (currentEventType.includes('output_text') && currentEventType.includes('delta')) {
            const delta = parsed.delta || '';
            if (delta) contentText += delta;
          }
          // Fallback: Chat Completions delta
          const delta = parsed.choices?.[0]?.delta;
          if (delta) {
            if (delta.reasoning_content) { reasoningText += delta.reasoning_content; onThinking?.(reasoningText); logThinkingToTerminal(playerName, reasoningText, 'player', 'thinking'); }
            if (delta.content) contentText += delta.content;
          }
        } catch {}
      }
    }

    logThinkingToTerminal(playerName, String(reasoningText.length), 'player', 'done');
    const cardId = parseCardId(contentText, state.pool);
    if (cardId) return cardId;
    console.warn('[GPT Draft] Parse failed:', contentText);
    return smartDraftPick(state);
  } catch (error) {
    console.error('[GPT Draft] Error:', error);
    return smartDraftPick(state);
  }
}

// ============================================================================
// DeepSeek R1 Draft — Chat Completions with streaming reasoning
// ============================================================================
export async function draftWithDeepSeek(
  state: DraftState,
  side: 'p1' | 'p2',
  playerName: string,
  onThinking?: AIThinkingCallback
): Promise<string> {
  const step = getCurrentStep(state);
  if (!step) return smartDraftPick(state);
  if (!DEEPSEEK_API_KEY) return smartDraftPick(state);

  const { system, user } = buildDraftPrompt(state, side, playerName);

  try {
    logThinkingToTerminal(playerName, '', 'opponent', 'start');
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 90_000);

    const response = await fetch('/api/deepseek/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        max_tokens: 512,
        stream: true,
      }),
      signal: abortController.signal,
    });

    clearTimeout(timeout);
    if (!response.ok) {
      console.error('[DeepSeek Draft] API Error', response.status);
      return smartDraftPick(state);
    }

    const reader = response.body?.getReader();
    if (!reader) return smartDraftPick(state);

    const decoder = new TextDecoder();
    let reasoningContent = '';
    let content = '';
    let buf = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          if (!delta) continue;
          if (delta.reasoning_content) { reasoningContent += delta.reasoning_content; onThinking?.(reasoningContent); logThinkingToTerminal(playerName, reasoningContent, 'opponent', 'thinking'); }
          if (delta.content) content += delta.content;
        } catch {}
      }
    }

    logThinkingToTerminal(playerName, String(reasoningContent.length), 'opponent', 'done');

    // Remove think tags
    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
    if (thinkMatch) content = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();

    const cardId = parseCardId(content, state.pool);
    if (cardId) return cardId;
    console.warn('[DeepSeek Draft] Parse failed:', content);
    return smartDraftPick(state);
  } catch (error) {
    console.error('[DeepSeek Draft] Error:', error);
    return smartDraftPick(state);
  }
}
