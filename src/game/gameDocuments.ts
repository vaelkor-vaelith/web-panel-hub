// ============================================================================
// THE SHATTERED DOMINION - DOCUMENT RAG SYSTEM
// R1: Gets ALL 3 full documents UNABRIDGED inline every turn. No summaries, no compression.
// GPT: Gets an accurate rules summary + tool-based lookup for full documents on demand.
// Only 3 authoritative docs: game_design (v1.2), card_roster (v1.2), lorebook.
// ============================================================================

// @ts-ignore - Vite ?raw imports
import gameDesignRaw from '../../docs/game_design.md?raw';
// @ts-ignore
import cardRosterRaw from '../../docs/card_roster.md?raw';
// @ts-ignore
import lorebookRaw from '../../docs/lorebook.md?raw';

// ============================================================================
// Raw document store - keyed by lookup name
// Only 3 docs: game_design already contains all v1.1 patch changes.
// ============================================================================
const DOCS: Record<string, string> = {
  game_design: gameDesignRaw as string,
  card_roster: cardRosterRaw as string,
  lorebook: lorebookRaw as string,
};

// ============================================================================
// Accurate rules summary - used by GPT only (R1 gets full docs instead)
// Every fact here matches the GDD exactly. No simplification, no shortcuts.
// ============================================================================
export const RULES_SUMMARY = `THE SHATTERED DOMINION - Rules Reference (Quick Summary - use lookup_game_document for full details)

TRIBAL ADVANTAGE CYCLE:
Light (Radiant Sanctum) > Shadow (Obsidian Veil) > Fire (Emberheart Pact) > Earth (Ironroot Bastion) > Light
Advantage = x1.5 damage (rounded UP). Disadvantage = x0.75 damage (rounded UP). Neutral = x1.0.
Mythic/Tribeless cards deal and receive neutral (x1.0) damage against all factions.

SYNERGY BONUSES (same-faction cards on YOUR field):
1 card: No bonus
2 cards of same faction: +1 ATK to each
3 cards of same faction: +2 ATK and +1 HP to each (replaces 2-count bonus)

DAMAGE FORMULA (8 steps - see game_design Section 19.3 for full details):
Step 1: Base ATK = Card ATK + Synergy ATK Bonus + Active Buffs - Sabotage
Step 2: Tribal Damage = ceil(Base ATK x Tribal Modifier)
Step 3: + Bonus Damage (Backstab +3, Shieldbreaker +1, etc.)
Step 4: - Damage Reduction (Entangle -1, Divine Guard -1, Fade -1, Stand Firm -1)
Step 5: + Shadow Mark (+1 if target is Marked)
Step 6: - Farsight (-1 if attacker has Farsight debuff, then consumed)
Step 7: Final Damage = max(1, result)
Step 8: Apply to Shield first; overflow to HP

TURN PHASES (strict order):
Phase 1 - Draw: Draw 1 card (skip on first player's Turn 1)
Phase 2 - Energy: Energy = your round number (how many turns YOU have taken), max 10. Fully refreshes - unspent energy is LOST. Both players ramp independently at the same rate.
Phase 3 - Deploy: Play cards from hand to empty field slots (pay energy cost). Multiple allowed.
Phase 4 - Battle: Each field card attacks once. YOU CHOOSE the target (enemy card OR enemy player). Taunt forces targeting. Cards can attack the turn they are deployed (unless Slow).
Phase 5 - End: End-of-turn effects (Burn ticks, status durations decrement). Turn passes.

WIN CONDITION: Reduce opponent Player HP from 20 to 0.
FIELD: 3 slots per player. You choose attack targets - cards do NOT auto-attack opposing slots.

KEY MECHANICS:
- Taunt: Enemy MUST attack this card before any other target
- Lifesteal: Heals Player HP by damage dealt during Battle Phase
- Shield(N): Absorbs N damage before HP is affected
- Stun(N): Card cannot attack for N turns
- Wound(N): Halves ALL healing received for N turns. Does not affect Shield or buffs.
- Burn(N): 1 damage at end of burned card's OWNER'S turn for N turns (Phase 5 only)
- Fade: Dodges the first ATTACK received (not ability damage), then expires
- Shadow Mark(N): Target takes +1 damage from ALL sources for N turns (Step 5)
- Hush(N): Disables ALL Passive abilities on target for ~1.5 turns
- Sabotage(N): On Death: reduce random enemy's base ATK by 1 for N turns (min 1 ATK, Step 1)
- Farsight: Target enemy's next Battle Phase attack deals -1 damage (Step 6, consumed after 1 attack)
- Guiding Light: Permanent +1 HP buff (max and current). NOT healing - unaffected by Wound.
- Crystal Record: On Death: grant Shield 1 to random friendly card (fizzles if no allies)
- On Deploy: Triggers when card is played from hand to field
- On Death: Triggers when card's HP reaches 0
- Active: Player-activated, may cost energy, once per turn

FACTIONS (4 factions + tribeless):
- Radiant Sanctum [L] = Light
- Obsidian Veil [S] = Shadow
- Emberheart Pact [F] = Fire
- Ironroot Bastion [E] = Earth
- Tribeless [M] = Mythic (no faction, no synergy)`;

// ============================================================================
// Document catalog - tells the AI what's available for lookup
// ============================================================================
export const DOCUMENT_CATALOG = `REFERENCE LIBRARY (use lookup_game_document tool to read any of these):
- "game_design": Complete rules, all interactions, 8-step damage formula, tribal system, ALL balance changes (v1.1 + v1.2), 16 rulings, glossary
- "card_roster": All 54 cards with complete stats, abilities, costs, tribes, backstories (v1.2 updated)
- "lorebook": World lore - Aethara, The Shattering, four realms, character stories

These are the AUTHORITATIVE documents. Look them up when you need exact details.`;

// ============================================================================
// Document lookup - returns full document content by name
// ============================================================================
export function lookupDocument(name: string): string {
  const doc = DOCS[name];
  if (doc) return doc;
  return `Unknown document "${name}". Available: ${Object.keys(DOCS).join(', ')}`;
}

// ============================================================================
// Tool definition for OpenAI Responses API (flat format)
// ============================================================================
export const LOOKUP_TOOL_RESPONSES = {
  type: 'function' as const,
  name: 'lookup_game_document',
  description: 'Read a game reference document. Use when you need exact card stats, detailed rules, or lore. Only look up what you need for the current decision.',
  parameters: {
    type: 'object',
    properties: {
      document: {
        type: 'string',
        enum: ['game_design', 'card_roster', 'lorebook'],
        description: 'Which document to retrieve',
      },
    },
    required: ['document'],
  },
};

// ============================================================================
// Tool definition for Chat Completions API (nested function format)
// ============================================================================
export const LOOKUP_TOOL_CHAT = {
  type: 'function' as const,
  function: {
    name: 'lookup_game_document',
    description: 'Read a game reference document. Use when you need exact card stats, detailed rules, or lore.',
    parameters: {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          enum: ['game_design', 'card_roster', 'lorebook'],
          description: 'Which document to retrieve',
        },
      },
      required: ['document'],
    },
  },
};

// ============================================================================
// Full document context - all 3 essential documents inline for models without tool support
// Used by DeepSeek R1 which cannot do function calling
// ============================================================================
export function buildFullDocumentContext(): string {
  return `
=== THE SHATTERED DOMINION - COMPLETE DOCUMENT LIBRARY ===
You have access to ALL authoritative game documents below - UNABRIDGED and UNMODIFIED.
The Game Design Document includes ALL balance changes (v1.1 and v1.2), the complete 8-step damage formula, 16 interaction rulings, and a full glossary.
The Card Roster includes ALL 54 cards with their updated v1.2 abilities.
These documents are the SOLE source of truth. Trust them absolutely.

=== DOCUMENT 1/3: GAME DESIGN DOCUMENT (Rules, Mechanics, 8-Step Damage Formula, All v1.1 + v1.2 Changes, 16 Rulings) ===

${DOCS.game_design}

=== DOCUMENT 2/3: COMPLETE CARD ROSTER (All 54 Cards + 2 Tokens, v1.2 Updated Abilities) ===

${DOCS.card_roster}

=== DOCUMENT 3/3: THE LOREBOOK OF AETHARA (World Lore & Characters) ===

${DOCS.lorebook}

=== END OF DOCUMENT LIBRARY ===
`;
}

// ============================================================================
// Terminal logging helper - sends thinking data to the Vite server for display
// ============================================================================
let lastLogTime = 0;
const LOG_THROTTLE_MS = 500; // Log every 0.5s for detailed overnight data collection

export function logThinkingToTerminal(
  player: string,
  text: string,
  side: 'player' | 'opponent',
  type: 'start' | 'thinking' | 'done' | 'tool_call'
): void {
  const now = Date.now();
  // Throttle "thinking" updates to avoid flooding
  if (type === 'thinking' && now - lastLogTime < LOG_THROTTLE_MS) return;
  lastLogTime = now;

  // Fire-and-forget POST to the Vite logging middleware
  fetch('/api/log-thinking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player, text, side, type }),
  }).catch(() => { /* ignore logging failures */ });
}
