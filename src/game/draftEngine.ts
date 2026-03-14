import type { CardData } from '@/data/gameData';
import { allCards } from '@/data/allCards';

// ============================================================================
// THE SHATTERED DOMINION — CAPTAIN MODE DRAFT ENGINE
// 36-step snake draft: 3 rounds × (2 bans + 10 picks)
// ============================================================================

export interface DraftStep {
  step: number;
  round: 1 | 2 | 3;
  phase: 'ban' | 'pick';
  player: 'p1' | 'p2';
}

export interface DraftState {
  stepIndex: number;
  p1Picks: CardData[];
  p2Picks: CardData[];
  banned: CardData[];
  pool: CardData[];
  complete: boolean;
  log: { step: number; action: 'ban' | 'pick'; player: 'p1' | 'p2'; card: CardData }[];
}

export const ROUND_NAMES = ['DECLARATION', 'CONFRONTATION', 'RESOLUTION'] as const;

// Complete 36-step draft sequence per the Captain Mode document
export const DRAFT_SEQUENCE: DraftStep[] = [
  // Round 1 — Declaration (P1 first picker)
  { step: 1, round: 1, phase: 'ban', player: 'p1' },
  { step: 2, round: 1, phase: 'ban', player: 'p2' },
  { step: 3, round: 1, phase: 'pick', player: 'p1' },
  { step: 4, round: 1, phase: 'pick', player: 'p2' },
  { step: 5, round: 1, phase: 'pick', player: 'p2' },
  { step: 6, round: 1, phase: 'pick', player: 'p1' },
  { step: 7, round: 1, phase: 'pick', player: 'p1' },
  { step: 8, round: 1, phase: 'pick', player: 'p2' },
  { step: 9, round: 1, phase: 'pick', player: 'p2' },
  { step: 10, round: 1, phase: 'pick', player: 'p1' },
  { step: 11, round: 1, phase: 'pick', player: 'p1' },
  { step: 12, round: 1, phase: 'pick', player: 'p2' },
  // Round 2 — Confrontation (P2 first picker)
  { step: 13, round: 2, phase: 'ban', player: 'p2' },
  { step: 14, round: 2, phase: 'ban', player: 'p1' },
  { step: 15, round: 2, phase: 'pick', player: 'p2' },
  { step: 16, round: 2, phase: 'pick', player: 'p1' },
  { step: 17, round: 2, phase: 'pick', player: 'p1' },
  { step: 18, round: 2, phase: 'pick', player: 'p2' },
  { step: 19, round: 2, phase: 'pick', player: 'p2' },
  { step: 20, round: 2, phase: 'pick', player: 'p1' },
  { step: 21, round: 2, phase: 'pick', player: 'p1' },
  { step: 22, round: 2, phase: 'pick', player: 'p2' },
  { step: 23, round: 2, phase: 'pick', player: 'p2' },
  { step: 24, round: 2, phase: 'pick', player: 'p1' },
  // Round 3 — Resolution (P1 first picker)
  { step: 25, round: 3, phase: 'ban', player: 'p1' },
  { step: 26, round: 3, phase: 'ban', player: 'p2' },
  { step: 27, round: 3, phase: 'pick', player: 'p1' },
  { step: 28, round: 3, phase: 'pick', player: 'p2' },
  { step: 29, round: 3, phase: 'pick', player: 'p2' },
  { step: 30, round: 3, phase: 'pick', player: 'p1' },
  { step: 31, round: 3, phase: 'pick', player: 'p1' },
  { step: 32, round: 3, phase: 'pick', player: 'p2' },
  { step: 33, round: 3, phase: 'pick', player: 'p2' },
  { step: 34, round: 3, phase: 'pick', player: 'p1' },
  { step: 35, round: 3, phase: 'pick', player: 'p1' },
  { step: 36, round: 3, phase: 'pick', player: 'p2' },
];

export function createInitialDraft(): DraftState {
  const pool = allCards.filter(c => c.rarity !== 'token');
  return {
    stepIndex: 0,
    p1Picks: [],
    p2Picks: [],
    banned: [],
    pool: [...pool],
    complete: false,
    log: [],
  };
}

export function getCurrentStep(state: DraftState): DraftStep | null {
  if (state.complete || state.stepIndex >= DRAFT_SEQUENCE.length) return null;
  return DRAFT_SEQUENCE[state.stepIndex];
}

export function executeDraftAction(state: DraftState, cardId: string): DraftState {
  const step = getCurrentStep(state);
  if (!step) return state;
  const cardIndex = state.pool.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return state;

  const card = state.pool[cardIndex];
  const newPool = state.pool.filter((_, i) => i !== cardIndex);
  const newState: DraftState = {
    ...state,
    pool: newPool,
    log: [...state.log, { step: step.step, action: step.phase, player: step.player, card }],
    stepIndex: state.stepIndex + 1,
  };

  if (step.phase === 'ban') {
    newState.banned = [...state.banned, card];
  } else if (step.player === 'p1') {
    newState.p1Picks = [...state.p1Picks, card];
  } else {
    newState.p2Picks = [...state.p2Picks, card];
  }

  newState.complete = newState.stepIndex >= DRAFT_SEQUENCE.length;
  return newState;
}

// Serialize draft state for AI prompts
export function serializeDraftState(state: DraftState, side: 'p1' | 'p2'): string {
  const step = getCurrentStep(state);
  if (!step) return 'Draft complete.';

  const myPicks = side === 'p1' ? state.p1Picks : state.p2Picks;
  const oppPicks = side === 'p1' ? state.p2Picks : state.p1Picks;

  const formatCard = (c: CardData) =>
    `  [${c.id}] ${c.name} | ${c.tribe} | ${c.rarity} | Cost:${c.cost} | ATK:${c.atk} HP:${c.hp} | ${c.abilityName}: ${c.abilityDesc}`;
  const formatShort = (c: CardData) =>
    `  [${c.id}] ${c.name} | ${c.tribe} | Cost:${c.cost} | ATK:${c.atk} HP:${c.hp}`;

  let out = `=== CAPTAIN MODE DRAFT — Step ${step.step}/36 ===\n`;
  out += `Round ${step.round} — ${ROUND_NAMES[step.round - 1]}\n`;
  out += `Action: ${step.phase.toUpperCase()}\n\n`;

  if (myPicks.length > 0) {
    const tribeCounts: Record<string, number> = {};
    for (const c of myPicks) tribeCounts[c.tribe] = (tribeCounts[c.tribe] || 0) + 1;
    out += `MY PICKS (${myPicks.length}/15):\n`;
    out += `  Tribes: ${Object.entries(tribeCounts).map(([t, n]) => `${t}(${n})`).join(', ')}\n`;
    out += myPicks.map(formatShort).join('\n') + '\n';
  } else {
    out += `MY PICKS: none yet\n`;
  }
  out += '\n';

  if (oppPicks.length > 0) {
    const tribeCounts: Record<string, number> = {};
    for (const c of oppPicks) tribeCounts[c.tribe] = (tribeCounts[c.tribe] || 0) + 1;
    out += `OPPONENT'S PICKS (${oppPicks.length}/15):\n`;
    out += `  Tribes: ${Object.entries(tribeCounts).map(([t, n]) => `${t}(${n})`).join(', ')}\n`;
    out += oppPicks.map(formatShort).join('\n') + '\n';
  } else {
    out += `OPPONENT'S PICKS: none yet\n`;
  }
  out += '\n';

  if (state.banned.length > 0) {
    out += `BANNED (${state.banned.length}):\n`;
    out += state.banned.map(c => `  [${c.id}] ${c.name} | ${c.tribe}`).join('\n') + '\n\n';
  }

  out += `AVAILABLE CARDS (${state.pool.length} remaining):\n`;
  const byTribe: Record<string, CardData[]> = {};
  for (const c of state.pool) {
    if (!byTribe[c.tribe]) byTribe[c.tribe] = [];
    byTribe[c.tribe].push(c);
  }
  for (const [tribe, cards] of Object.entries(byTribe)) {
    out += `\n  --- ${tribe} ---\n`;
    out += cards.sort((a, b) => a.cost - b.cost).map(formatCard).join('\n') + '\n';
  }
  return out;
}

// Smart heuristic AI — no API needed
export function smartDraftPick(state: DraftState): string {
  const step = getCurrentStep(state);
  if (!step || state.pool.length === 0) return state.pool[0]?.id || '';

  const side = step.player;
  const myPicks = side === 'p1' ? state.p1Picks : state.p2Picks;
  const oppPicks = side === 'p1' ? state.p2Picks : state.p1Picks;

  const advantageMap: Record<string, string> = {
    'Obsidian Veil': 'Emberheart Pact',
    'Emberheart Pact': 'Ironroot Bastion',
    'Ironroot Bastion': 'Radiant Sanctum',
    'Radiant Sanctum': 'Obsidian Veil',
  };

  const scored = state.pool.map(card => {
    let score = (card.atk + card.hp) * 2;
    if (card.rarity === 'mythic') score += 25;
    if (card.rarity === 'legendary') score += 18;
    if (card.rarity === 'epic') score += 12;
    if (card.rarity === 'rare') score += 6;

    if (step.phase === 'ban') return { card, score };

    // Tribal synergy
    const myTribeCount = myPicks.filter(c => c.tribe === card.tribe).length;
    if (myTribeCount >= 1) score += 6;
    if (myTribeCount >= 2) score += 10;

    // Tribal advantage vs opponent
    const oppTribes = new Set(oppPicks.map(c => c.tribe));
    if (advantageMap[card.tribe] && oppTribes.has(advantageMap[card.tribe])) score += 5;

    // Energy curve balance
    const lowCount = myPicks.filter(c => c.cost <= 2).length;
    const highCount = myPicks.filter(c => c.cost >= 5).length;
    if (card.cost <= 2 && lowCount < 5) score += 4;
    if (card.cost >= 3 && card.cost <= 4) score += 3;
    if (card.cost >= 7 && highCount >= 2) score -= 8;

    return { card, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.card.id || state.pool[0]?.id || '';
}
