import type { CardInstance, PlayerState, GameState, Side, CombatEvent } from './types';
import type { CardData } from '@/data/gameData';
import { allCards } from '@/data/allCards';

let instanceCounter = 0;
function uid(): string { return `ci-${++instanceCounter}-${Math.random().toString(36).slice(2, 6)}`; }

// ============================================================================
// FIX 1.1 - Tribal advantage: Shadow > Fire > Earth > Light > Shadow (per GDD Section 11.1)
// ============================================================================
const advantageMap: Record<string, string> = {
  'Obsidian Veil': 'Emberheart Pact',      // Shadow beats Fire
  'Emberheart Pact': 'Ironroot Bastion',   // Fire beats Earth
  'Ironroot Bastion': 'Radiant Sanctum',   // Earth beats Light
  'Radiant Sanctum': 'Obsidian Veil',      // Light beats Shadow
};

// FIX 1.2 - Weakness map (reverse of advantage)
const weaknessMap: Record<string, string> = {
  'Emberheart Pact': 'Obsidian Veil',      // Fire weak vs Shadow
  'Ironroot Bastion': 'Emberheart Pact',   // Earth weak vs Fire
  'Radiant Sanctum': 'Ironroot Bastion',   // Light weak vs Earth
  'Obsidian Veil': 'Radiant Sanctum',      // Shadow weak vs Light
};

export function hasAdvantage(attackerTribe: string, defenderTribe: string): boolean {
  return advantageMap[attackerTribe] === defenderTribe;
}

export function hasDisadvantage(attackerTribe: string, defenderTribe: string): boolean {
  return weaknessMap[attackerTribe] === defenderTribe;
}

// ============================================================================
// FIX 3.1 - Wound-aware heal helper
// ============================================================================
function applyHeal(card: CardInstance, amount: number): number {
  if (card.statusEffects.some(e => e.type === 'wound')) {
    amount = Math.floor(amount / 2);
  }
  const healed = Math.min(card.maxHp - card.currentHp, amount);
  card.currentHp += healed;
  return healed;
}

function applyPlayerHeal(player: PlayerState, amount: number): number {
  const healed = Math.min(20 - player.hp, amount);
  player.hp += healed;
  return healed;
}

// ============================================================================
// Card Instance Creation
// ============================================================================
export function createCardInstance(card: CardData): CardInstance {
  return {
    instanceId: uid(),
    id: card.id,
    name: card.name,
    title: card.title,
    tribe: card.tribe,
    rarity: card.rarity,
    cost: card.cost,
    baseAtk: card.atk,
    baseHp: card.hp,
    currentAtk: card.atk,
    currentHp: card.hp,
    maxHp: card.hp,
    shield: 0,
    abilityName: card.abilityName,
    abilityType: card.abilityType,
    abilityDesc: card.abilityDesc,
    quote: card.quote,
    statusEffects: [],
    canAttack: true,
    hasAttacked: false,
    activeUsed: false,
    isToken: false,
    rageStacks: 0,
    dmgReductionUsed: false,  // FIX 4.2
  };
}

function createToken(name: string, atk: number, hp: number, tribe: string): CardInstance {
  return {
    instanceId: uid(),
    id: `TOKEN-${name}`,
    name,
    title: 'Summoned Token',
    tribe,
    rarity: 'common',
    cost: 0,
    baseAtk: atk,
    baseHp: hp,
    currentAtk: atk,
    currentHp: hp,
    maxHp: hp,
    shield: 0,
    abilityName: '',
    abilityType: '',
    abilityDesc: '',
    quote: '',
    statusEffects: [],
    canAttack: true,
    hasAttacked: false,
    activeUsed: false,
    isToken: true,
    rageStacks: 0,
    dmgReductionUsed: false,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildRandomDeck(size = 20): CardData[] {
  const mythics = allCards.filter(c => c.rarity === 'mythic');
  const randomMythic = mythics[Math.floor(Math.random() * mythics.length)];
  const nonMythics = shuffle(allCards.filter(c => c.rarity !== 'mythic' && c.rarity !== 'token'));
  return shuffle([randomMythic, ...nonMythics.slice(0, size - 1)]);
}

export function buildTribalDeck(tribe: string, size = 20): CardData[] {
  const mythics = allCards.filter(c => c.rarity === 'mythic');
  const randomMythic = mythics[Math.floor(Math.random() * mythics.length)];
  const tribalCards = allCards.filter(c => c.tribe === tribe && c.rarity !== 'token');
  const others = shuffle(allCards.filter(c => c.tribe !== tribe && c.rarity !== 'mythic' && c.rarity !== 'token'));
  const deck = [randomMythic, ...tribalCards, ...others].slice(0, size);
  return shuffle(deck);
}

// ============================================================================
// FIX 1.4 - 3 field slots (not 5)
// FIX 1.5 - Opening hand size 5 (not 3)
// FIX 4.4 - energyPenalty initialized to 0
// ============================================================================
function createPlayer(deck: CardData[]): PlayerState {
  const instances = shuffle(deck.map(createCardInstance));
  const hand = instances.splice(0, 5);  // FIX 1.5: Opening hand = 5
  return {
    hp: 20,
    energy: 0,
    maxEnergy: 0,
    hand,
    deck: instances,
    field: [null, null, null],  // FIX 1.4: 3 slots
    graveyard: [],
    energyPenalty: 0,  // FIX 4.4
  };
}

// ============================================================================
// FIX 1.7 - firstTurnSkipDraw flag
// ============================================================================
export function createGame(playerDeck: CardData[], opponentDeck: CardData[]): GameState {
  instanceCounter = 0;
  return {
    turn: 0,
    phase: 'start',
    activePlayer: 'player',
    player: createPlayer(playerDeck),
    opponent: createPlayer(opponentDeck),
    winner: null,
    log: [],
    selectedHandIndex: null,
    firstTurnSkipDraw: true,  // FIX 1.7
  };
}

// ============================================================================
// Start Turn
// FIX 1.6 - Hand size limit 7 (not 8)
// FIX 1.7 - First-turn no-draw rule
// FIX 4.1 - Stun removed at END of turn, not start
// FIX 4.2 - Reset dmgReductionUsed
// FIX 4.4 - Apply Vaelith energy penalty
// ============================================================================
export function startTurn(inputState: GameState): GameState {
  const state = structuredClone(inputState);
  state.turn++;
  const p = state.activePlayer === 'player' ? state.player : state.opponent;

  // Increment max energy (cap 10)
  let baseMaxEnergy = Math.min(10, p.maxEnergy + 1);

  // FIX 4.4 - Vaelith energy penalty (halve energy for this turn only)
  if (p.energyPenalty > 0) {
    baseMaxEnergy = Math.max(1, Math.floor(baseMaxEnergy / 2));
    p.energyPenalty--;
  }
  p.maxEnergy = baseMaxEnergy;
  p.energy = p.maxEnergy;

  // FIX 1.7 - First-turn no-draw rule
  if (state.firstTurnSkipDraw) {
    state.log.push(`Turn ${state.turn} - First player skips draw`);
    state.firstTurnSkipDraw = false;
  } else {
    // FIX 1.6 - Hand size limit 7
    if (p.deck.length > 0) {
      if (p.hand.length < 7) {
    p.hand.push(p.deck.shift()!);
      } else {
        // Card burned (discarded) if hand is full
        const burned = p.deck.shift()!;
        p.graveyard.push(burned);
        state.log.push(`Card burned - hand full`);
      }
    }
  }

  // Reset attack flags, active used, dmgReductionUsed
  for (const card of p.field) {
    if (card) {
      card.hasAttacked = false;
      card.activeUsed = false;
      card.canAttack = true;
      card.dmgReductionUsed = false;  // FIX 4.2
      // FIX 4.1 - DO NOT remove stun here (moved to processEndOfTurn)
    }
  }

  // v1.2: Recalculate passives at start of turn for clean board state
  applyPassives(state);

  state.phase = state.activePlayer === 'player' ? 'playing' : 'enemyTurn';
  state.selectedHandIndex = null;
  const roundNum = Math.ceil(state.turn / 2);
  state.log.push(`Round ${roundNum} (Turn ${state.turn}) - ${state.activePlayer === 'player' ? 'Your' : "Opponent's"} turn`);
  return state;
}

// ============================================================================
// Deploy Card
// ============================================================================
export function deployCard(inputState: GameState, handIndex: number, slotIndex: number): { state: GameState; events: CombatEvent[] } {
  const state = structuredClone(inputState);
  const side = state.activePlayer;
  const p = side === 'player' ? state.player : state.opponent;
  const opp = side === 'player' ? state.opponent : state.player;

  if (slotIndex < 0 || slotIndex >= 3) return { state: inputState, events: [] };  // FIX 1.4
  if (p.field[slotIndex] !== null) return { state: inputState, events: [] };
  const card = p.hand[handIndex];
  if (!card || card.cost > p.energy) return { state: inputState, events: [] };

  p.hand.splice(handIndex, 1);
  p.energy -= card.cost;
  // Slow keyword (Vaelkor)
  if (card.id === 'MY-M-01') card.canAttack = false;
  p.field[slotIndex] = card;
  state.selectedHandIndex = null;

  const events: CombatEvent[] = [{ type: 'deploy', message: `${card.name} deployed`, targetSide: side, targetSlot: slotIndex }];

  // Resolve on-deploy abilities
  resolveOnDeploy(state, card, side, slotIndex, p, opp, events);

  // Recalculate passives
  applyPassives(state);
  checkDead(state, events);

  return { state, events };
}

// ============================================================================
// On-Deploy Ability Resolution
// v1.2: Mira Shadow Mark, Whisper Hush, Bram Farsight, Lenna Guiding Light
// v1.2: Thornwall/Aurelia HP auras moved to applyPassives (dynamic)
// ============================================================================
function resolveOnDeploy(state: GameState, card: CardInstance, side: Side, slotIndex: number, p: PlayerState, opp: PlayerState, events: CombatEvent[]) {
  const oppSide: Side = side === 'player' ? 'opponent' : 'player';

  switch (card.id) {
    // --- OBSIDIAN VEIL ---
    case 'OV-E-01': { // Lyra - Deal 3 damage to target enemy. Draw 1 if kill.
      const t = randomFieldTarget(opp);
      if (t !== null) {
        let dmg = 3;
        if (isMarked(opp.field[t]!)) dmg += 1;  // v1.2: Shadow Mark
        dealDamage(opp.field[t]!, dmg, events, `Lyra deals ${dmg} to ${opp.field[t]!.name}`, oppSide, t);
        // FIX 3.4 - Draw on kill
        if (opp.field[t]!.currentHp <= 0) {
          if (p.deck.length > 0 && p.hand.length < 7) {
            p.hand.push(p.deck.shift()!);
            events.push({ type: 'ability', message: 'Lyra draws a card for the kill' });
          }
        }
      }
      break;
    }
    case 'OV-R-01': { // FIX 2.3 - Thane: Crippling Toxin (1 damage + Wound)
      const t = randomFieldTarget(opp);
      if (t !== null) {
        let dmg = 1;
        if (isMarked(opp.field[t]!)) dmg += 1;  // v1.2: Shadow Mark
        dealDamage(opp.field[t]!, dmg, events, `Thane poisons ${opp.field[t]!.name}`, oppSide, t);
        // Apply Wound (doesn't stack, refreshes duration)
        const existing = opp.field[t]!.statusEffects.find(e => e.type === 'wound');
        if (existing) {
          existing.duration = 2;
        } else {
          opp.field[t]!.statusEffects.push({ type: 'wound', duration: 2 });
        }
        events.push({ type: 'wound', message: `${opp.field[t]!.name} is Wounded (healing halved for 2 turns)` });
      }
      break;
    }
    case 'OV-R-02': { // v1.2 - Mira: Shadow Mark (Mark 1 enemy, +1 dmg from all sources, 2 turns)
      const t = randomFieldTarget(opp);
      if (t !== null) {
        const target = opp.field[t]!;
        // Shadow Mark does NOT stack. Refresh duration if already marked.
        const existing = target.statusEffects.find(e => e.type === 'marked');
        if (existing) {
          existing.duration = 2;
        } else {
          target.statusEffects.push({ type: 'marked', duration: 2 });
        }
        events.push({ type: 'mark', message: `Mira marks ${target.name} - takes +1 damage from all sources` });
      }
      break;
    }
    case 'OV-R-03': { // Dusk - Gains Stealth
      card.statusEffects.push({ type: 'stealth', duration: 1 });
      events.push({ type: 'ability', message: 'Dusk cloaks in shadow' });
      break;
    }
    case 'OV-C-01': case 'OV-C-04': { // Kael / Shade - Deal 1 damage to target
      const t = randomFieldTarget(opp);
      if (t !== null) {
        let dmg = 1;
        if (isMarked(opp.field[t]!)) dmg += 1;  // v1.2: Shadow Mark
        dealDamage(opp.field[t]!, dmg, events, `${card.name} strikes ${opp.field[t]!.name} for ${dmg}`, oppSide, t);
      }
      break;
    }
    case 'OV-C-05': { // v1.2 - Whisper: Hush (silence 1 enemy's passives for ~1.5 turns)
      const t = randomFieldTarget(opp);
      if (t !== null) {
        const target = opp.field[t]!;
        // Apply Hush - duration 3 (decrements every end-of-turn = ~1.5 full turns)
        const existing = target.statusEffects.find(e => e.type === 'hushed');
        if (existing) {
          existing.duration = 3;  // Refresh
        } else {
          target.statusEffects.push({ type: 'hushed', duration: 3 });
        }
        events.push({ type: 'hush', message: `Whisper silences ${target.name} - passives disabled` });
      }
      break;
    }

    // --- RADIANT SANCTUM ---
    case 'RS-L-01': { // Aurelia - Shield 2 to ONE target friendly card (v1.2 nerf)
      // +1 HP to all Light is now a DYNAMIC PASSIVE handled in applyPassives
      // On Deploy: only Shield 2 to one target
      const friendlies = p.field.filter((c): c is CardInstance => c !== null && c.id !== card.id);
      if (friendlies.length > 0) {
        const best = friendlies.reduce((a, b) => {
          if (b.cost !== a.cost) return b.cost > a.cost ? b : a;
          return b.currentHp > a.currentHp ? b : a;
        });
        best.shield += 2;
        events.push({ type: 'ability', message: `Aurelia shields ${best.name}` });
      } else {
        // No other friendly cards - shield self
        card.shield += 2;
        events.push({ type: 'ability', message: 'Aurelia shields herself' });
      }
      // NOTE: +1 HP to Light cards is now handled dynamically in applyPassives
      break;
    }
    case 'RS-E-02': { // FIX 4.10 - Celestine: Return highest-cost from graveyard
      if (p.graveyard.length > 0) {
        const bestIdx = p.graveyard.reduce((best, c, i) =>
          c.cost > p.graveyard[best].cost ? i : best, 0);
        const returned = p.graveyard.splice(bestIdx, 1)[0];
        returned.currentHp = returned.maxHp;
        returned.statusEffects = [];
        returned.shield = 0;
        p.hand.push(returned);
        events.push({ type: 'ability', message: `${returned.name} returns from the grave` });
      }
      break;
    }
    case 'RS-R-01': { // Aldric - Shield 2 target friendly
      const t = randomFieldTarget(p);
      if (t !== null) {
        p.field[t]!.shield += 2;
        events.push({ type: 'ability', message: `${p.field[t]!.name} gains Shield 2` });
      }
      break;
    }
    case 'RS-C-01': { // Elara - Heal 1 to friendly/player (FIX 3.1: Wound-aware)
      const t = randomFieldTarget(p);
      if (t !== null && p.field[t]!.currentHp < p.field[t]!.maxHp) {
        const healed = applyHeal(p.field[t]!, 1);
        events.push({ type: 'heal', message: `${p.field[t]!.name} healed ${healed}` });
      } else {
        applyPlayerHeal(p, 1);
        events.push({ type: 'heal', message: 'Player healed 1 HP' });
      }
      break;
    }
    case 'RS-C-03': { // Miriel - Heal 2 to target (FIX 3.1: Wound-aware)
      const t = randomFieldTarget(p);
      if (t !== null) {
        const healed = applyHeal(p.field[t]!, 2);
        events.push({ type: 'heal', message: `${p.field[t]!.name} patched up (${healed} HP)` });
      }
      break;
    }
    case 'RS-C-04': { // v1.2 - Bram: Farsight (next attack from target enemy deals -1 dmg)
      const t = randomFieldTarget(opp);
      if (t !== null) {
        const target = opp.field[t]!;
        // Farsight: consumed on next attack. Duration 999 (infinite until consumed).
        target.statusEffects.push({ type: 'farsight', duration: 999 });
        events.push({ type: 'farsight', message: `Bram foresees ${target.name}'s attack - next hit weakened` });
      }
      break;
    }
    case 'RS-C-05': { // v1.2 - Lenna: Guiding Light (+1 HP permanent to target friendly)
      const t = randomFieldTarget(p);
      if (t !== null) {
        p.field[t]!.maxHp += 1;
        p.field[t]!.currentHp += 1;
        events.push({ type: 'buff', message: `${p.field[t]!.name} blessed by Guiding Light (+1 HP)` });
      }
      break;
    }

    // --- EMBERHEART PACT ---
    case 'EP-L-01': { // FIX 2.5 - Pyraxis: 3 damage to ALL enemies (was 2)
      for (let i = 0; i < 3; i++) {  // FIX 1.4: 3 slots
        if (opp.field[i]) {
          let dmg = 3;
          if (isMarked(opp.field[i]!)) dmg += 1;  // v1.2: Shadow Mark
          dealDamage(opp.field[i]!, dmg, events, `Pyraxis scorches ${opp.field[i]!.name} for ${dmg}`, oppSide, i);
        }
      }
      break;
    }
    case 'EP-R-01': { // Ember - Burn target
      const t = randomFieldTarget(opp);
      if (t !== null) {
        opp.field[t]!.statusEffects.push({ type: 'burn', duration: 2, value: 1 });
        events.push({ type: 'ability', message: `${opp.field[t]!.name} is scorched` });
      }
      break;
    }
    case 'EP-C-01': { // Cinder - Deal 1 damage
      const t = randomFieldTarget(opp);
      if (t !== null) {
        let dmg = 1;
        if (isMarked(opp.field[t]!)) dmg += 1;  // v1.2: Shadow Mark
        dealDamage(opp.field[t]!, dmg, events, `Cinder sparks ${opp.field[t]!.name} for ${dmg}`, oppSide, t);
      }
      break;
    }
    case 'EP-C-04': { // Sear - Burn 1 turn
      const t = randomFieldTarget(opp);
      if (t !== null) {
        opp.field[t]!.statusEffects.push({ type: 'burn', duration: 1, value: 1 });
        events.push({ type: 'ability', message: `${opp.field[t]!.name} touched by flame` });
      }
      break;
    }

    // --- IRONROOT BASTION ---
    case 'IB-L-01': { // Thornwall: Stun 1 enemy, Taunt. +1 HP to Earth is now DYNAMIC PASSIVE.
      const t = randomFieldTarget(opp);
      if (t !== null) {
        opp.field[t]!.statusEffects.push({ type: 'stun', duration: 1 });
        events.push({ type: 'ability', message: `${opp.field[t]!.name} is stunned` });
      }
      // NOTE: +1 HP to Earth cards is now handled dynamically in applyPassives
      break;
    }
    case 'IB-R-02': { // Moss - Summon 1/1 Beast
      const emptySlot = p.field.findIndex(s => s === null);
      if (emptySlot !== -1) {
        p.field[emptySlot] = createToken('Beast', 1, 1, 'Ironroot Bastion');
        events.push({ type: 'summon', message: 'A Beast emerges', targetSide: side, targetSlot: emptySlot });
      }
      break;
    }
    case 'IB-R-03': { // Petra - Stun target enemy
      const t = randomFieldTarget(opp);
      if (t !== null) {
        opp.field[t]!.statusEffects.push({ type: 'stun', duration: 1 });
        events.push({ type: 'ability', message: `${opp.field[t]!.name} petrified` });
      }
      break;
    }
    case 'IB-C-05': { // Pebble - +1 HP on deploy
      card.maxHp += 1;
      card.currentHp += 1;
      events.push({ type: 'buff', message: 'Pebble hardens' });
      break;
    }
    case 'IB-C-07': { // Sage - +1 HP target friendly
      const t = randomFieldTarget(p);
      if (t !== null) {
        p.field[t]!.maxHp += 1;
        p.field[t]!.currentHp += 1;
        events.push({ type: 'buff', message: `${p.field[t]!.name} nourished` });
      }
      break;
    }

    // --- MYTHIC ---
    case 'MY-M-01': { // FIX 4.8 - Vaelkor: Destroy ALL other cards, NO on-death triggers
      for (let i = 0; i < 3; i++) {  // FIX 1.4: 3 slots
        if (p.field[i] && p.field[i]!.instanceId !== card.instanceId) {
          if (!p.field[i]!.isToken) p.graveyard.push(p.field[i]!);
          p.field[i] = null;
        }
        if (opp.field[i]) {
          // FIX 4.8: NO triggerOnDeath - just move to graveyard
          if (!opp.field[i]!.isToken) opp.graveyard.push(opp.field[i]!);
          opp.field[i] = null;
        }
      }
      events.push({ type: 'ability', message: 'DOMINION\'S END - All cards destroyed' });
      break;
    }
    case 'MY-M-02': { // FIX 4.4 - Vaelith: Steal 1 card, halve energy NEXT TURN (not permanent)
      if (opp.hand.length > 0) {
        const idx = Math.floor(Math.random() * opp.hand.length);
        const stolen = opp.hand.splice(idx, 1)[0];
        p.hand.push(stolen);
        events.push({ type: 'ability', message: `${stolen.name} stolen from opponent` });
      }
      // FIX 4.4: Use energyPenalty instead of permanently halving maxEnergy
      opp.energyPenalty = (opp.energyPenalty || 0) + 1;
      events.push({ type: 'ability', message: 'Reality fractures - opponent\'s energy halved next turn' });
      break;
    }
  }
}

// ============================================================================
// Damage Helpers
// ============================================================================
function dealDamage(target: CardInstance, amount: number, events: CombatEvent[], msg: string, targetSide: Side, targetSlot: number) {
  // Step 7/8: Apply to shield first, overflow to HP
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, amount);
    target.shield -= absorbed;
    amount -= absorbed;
  }
  target.currentHp -= amount;
  events.push({ type: 'damage', message: msg, value: amount, targetSide, targetSlot });
}

function randomFieldTarget(player: PlayerState): number | null {
  const indices = player.field.map((c, i) => c ? i : -1).filter(i => i >= 0);
  return indices.length > 0 ? indices[Math.floor(Math.random() * indices.length)] : null;
}

// ============================================================================
// Card Property Helpers (v1.2: Hush gates added)
// ============================================================================
function hasTaunt(card: CardInstance): boolean {
  if (isHushed(card)) return false;  // v1.2: Hush disables Taunt
  return ['RS-E-01', 'RS-C-06', 'IB-L-01', 'IB-E-01', 'IB-R-01', 'IB-C-01'].includes(card.id);
}

function hasLifesteal(card: CardInstance): boolean {
  if (isHushed(card)) return false;  // v1.2: Hush disables Lifesteal
  return ['EP-L-01', 'EP-E-01'].includes(card.id);  // Full lifesteal (heal = damage dealt)
}

function hasMinorLifesteal(card: CardInstance): boolean {
  if (isHushed(card)) return false;  // v1.2: Hush disables Minor Lifesteal
  return card.id === 'EP-C-07';  // Blaze Hearthcoal: fixed 1 HP heal per attack
}

function hasThorns(card: CardInstance): boolean {
  if (isHushed(card)) return false;  // v1.2: Hush disables Thorns/Smolder
  return ['IB-C-02', 'EP-C-05'].includes(card.id);
}

function isStunned(card: CardInstance): boolean {
  return card.statusEffects.some(e => e.type === 'stun');
}

function isStealthed(card: CardInstance): boolean {
  return card.statusEffects.some(e => e.type === 'stealth');
}

// v1.2: New status helpers
function isHushed(card: CardInstance): boolean {
  return card.statusEffects.some(e => e.type === 'hushed');
}

function isMarked(card: CardInstance): boolean {
  return card.statusEffects.some(e => e.type === 'marked');
}

// ============================================================================
// Combat Resolution
// v1.2: Shadow Mark (Step 5), Farsight (Step 6), Hush gates on all passives
// ============================================================================
export function resolveCombat(inputState: GameState, attackerSide: Side): { state: GameState; events: CombatEvent[] } {
  const state = structuredClone(inputState);
  const events: CombatEvent[] = [];
  const attacker = attackerSide === 'player' ? state.player : state.opponent;
  const defender = attackerSide === 'player' ? state.opponent : state.player;
  const defSide: Side = attackerSide === 'player' ? 'opponent' : 'player';

  // Find taunters (v1.2: Hush disables Taunt - already gated in hasTaunt)
  const taunters = defender.field.map((c, i) => c && hasTaunt(c) ? i : -1).filter(i => i >= 0);

  for (let slot = 0; slot < 3; slot++) {  // FIX 1.4: 3 slots
    const atkCard = attacker.field[slot];
    if (!atkCard || atkCard.hasAttacked || isStunned(atkCard) || !atkCard.canAttack) continue;

    // Remove stealth on attack
    if (isStealthed(atkCard)) {
      atkCard.statusEffects = atkCard.statusEffects.filter(e => e.type !== 'stealth');
    }

    // Find target - taunt redirects, else same lane, else first available, else direct
    let targetSlot: number | null = null;
    if (taunters.length > 0 && defender.field[taunters[0]]) {
      targetSlot = taunters[0];
    } else if (defender.field[slot] && !isStealthed(defender.field[slot]!)) {
      targetSlot = slot;
    } else {
      for (let i = 0; i < 3; i++) {  // FIX 1.4: 3 slots
        if (defender.field[i] && !isStealthed(defender.field[i]!)) {
          targetSlot = i;
          break;
        }
      }
    }

    if (targetSlot !== null && defender.field[targetSlot]) {
      const defCard = defender.field[targetSlot]!;

      // ======= 8-STEP DAMAGE FORMULA (v1.2 Expanded) =======

      // Step 1: Base ATK (currentAtk already includes synergy + active buffs from applyPassives)
      let dmg = atkCard.currentAtk;

      // Step 2: Apply tribal modifier (FIX 1.2 - multiplier, not flat)
      if (hasAdvantage(atkCard.tribe, defCard.tribe)) {
        dmg = Math.ceil(dmg * 1.5);
      } else if (hasDisadvantage(atkCard.tribe, defCard.tribe)) {
        dmg = Math.ceil(dmg * 0.75);
      }

      // Step 3: Add bonus damage (AFTER tribal multiplier)
      // Riven Backstab: +3 (v1.2: only if not Hushed)
      if (atkCard.id === 'OV-E-02' && defCard.currentHp < defCard.maxHp && !isHushed(atkCard)) dmg += 3;
      // Shieldbreaker (Oakley): +1 to shielded (v1.2: only if not Hushed)
      if (atkCard.id === 'IB-C-06' && defCard.shield > 0 && !isHushed(atkCard)) dmg += 1;

      // Step 4: Subtract damage reductions (AFTER bonus damage)
      // Orin's Divine Guard: -1 to all allies (v1.2: only if Orin not Hushed)
      if (defender.field.some(c => c && c.id === 'RS-E-01' && !isHushed(c))) dmg -= 1;
      // Nyx/Tomas first-attack reduction (v1.2: only if not Hushed)
      if ((defCard.id === 'OV-C-02' || defCard.id === 'RS-C-02') && !defCard.dmgReductionUsed && !isHushed(defCard)) {
        dmg -= 1;
        defCard.dmgReductionUsed = true;
      }
      // Gorath Entangle (v1.2: only if not Hushed)
      if (defCard.id === 'IB-E-01' && !isHushed(defCard)) dmg -= 1;

      // Step 5: + Shadow Mark (+1 if target is Marked) - v1.2
      if (isMarked(defCard)) dmg += 1;

      // Step 6: - Farsight (-1 if attacker has Farsight debuff, consumed) - v1.2
      const farsightIdx = atkCard.statusEffects.findIndex(e => e.type === 'farsight');
      if (farsightIdx !== -1) {
        dmg -= 1;
        atkCard.statusEffects.splice(farsightIdx, 1);  // Consume farsight
      }

      // Step 7: Minimum 1 damage (FIX 4.9)
      dmg = Math.max(1, dmg);

      events.push({ type: 'attack', message: `${atkCard.name} attacks ${defCard.name}`, attackerSlot: slot, defenderSlot: targetSlot, attackerSide: attackerSide, defenderSide: defSide, tribe: atkCard.tribe });

      // Step 8: Apply damage (shield absorbs first via dealDamage)
      dealDamage(defCard, dmg, events, `${defCard.name} takes ${dmg} damage`, defSide, targetSlot);

      // Lifesteal (FIX 3.1: Wound-aware) - v1.2: gated by hasTaunt already checks Hush
      if (hasLifesteal(atkCard)) {
        let healAmount = dmg;
        if (atkCard.statusEffects.some(e => e.type === 'wound')) {
          healAmount = Math.floor(healAmount / 2);
        }
        attacker.hp = Math.min(20, attacker.hp + healAmount);
        events.push({ type: 'heal', message: `${atkCard.name} drains ${healAmount} HP` });
      }

      // Minor Lifesteal (Blaze Hearthcoal: fixed 1 HP, Wound-aware) - Hush gated in hasMinorLifesteal
      if (hasMinorLifesteal(atkCard) && dmg > 0) {
        let healAmount = 1;
        if (atkCard.statusEffects.some(e => e.type === 'wound')) {
          healAmount = 0;  // floor(1/2) = 0
        }
        if (healAmount > 0) {
          attacker.hp = Math.min(20, attacker.hp + healAmount);
          events.push({ type: 'heal', message: `${atkCard.name} siphons 1 HP` });
        }
      }

      // Thorns - Hush gated in hasThorns
      if (hasThorns(defCard) && defCard.currentHp > 0) {
        let thornDmg = 1;
        if (isMarked(atkCard)) thornDmg += 1;  // v1.2: Mark on attacker amplifies thorns
        atkCard.currentHp -= thornDmg;
        events.push({ type: 'damage', message: `${atkCard.name} takes ${thornDmg} thorn damage`, targetSide: attackerSide, targetSlot: slot, value: thornDmg });
        // Scald Rage from thorns (only if not Hushed)
        if (atkCard.id === 'EP-R-02' && !isHushed(atkCard)) {
          atkCard.currentAtk += 1;
          atkCard.rageStacks += 1;
        }
      }

      // Rage (Scald takes damage) - v1.2: only if not Hushed
      if (defCard.id === 'EP-R-02' && dmg > 0 && !isHushed(defCard)) {
        defCard.currentAtk += 1;
        defCard.rageStacks += 1;
      }

      // Sylas on kill - gain stealth (v1.2: only if not Hushed)
      if (defCard.currentHp <= 0 && atkCard.id === 'OV-L-01' && !isHushed(atkCard)) {
        atkCard.statusEffects.push({ type: 'stealth', duration: 1 });
        events.push({ type: 'ability', message: 'Sylas fades into shadow' });
      }
    } else {
      // Direct player damage (no tribal modifier on player)
      const directDmg = atkCard.currentAtk;
      defender.hp -= directDmg;
      events.push({ type: 'direct', message: `${atkCard.name} hits player for ${directDmg}`, value: directDmg, attackerSlot: slot, attackerSide: attackerSide });
    }

    atkCard.hasAttacked = true;

    // Swift (Sable) - if killed target, attack again (v1.2: only if not Hushed)
    if (atkCard.id === 'OV-C-07' && !isHushed(atkCard) && targetSlot !== null && defender.field[targetSlot]?.currentHp !== undefined && defender.field[targetSlot]!.currentHp <= 0) {
      atkCard.hasAttacked = false;
    }
  }

  checkDead(state, events);
  applyPassives(state);

  // Check winner
  if (state.player.hp <= 0) state.winner = 'opponent';
  if (state.opponent.hp <= 0) state.winner = 'player';

  return { state, events };
}

// ============================================================================
// On-Death Triggers
// v1.2: Vex Sabotage, Ivy Crystal Record (split from shared Draw 1)
// ============================================================================
function triggerOnDeath(state: GameState, card: CardInstance, side: Side, slotIndex: number, owner: PlayerState, opp: PlayerState, events: CombatEvent[]) {
  const oppSide: Side = side === 'player' ? 'opponent' : 'player';

  switch (card.id) {
    case 'OV-C-03': { // v1.2 - Vex: Sabotage (reduce random enemy's base ATK by 1 for 2 turns)
      const t = randomFieldTarget(opp);
      if (t !== null) {
        const target = opp.field[t]!;
        // Sabotage: refresh duration if already sabotaged (no additional stacking)
        const existing = target.statusEffects.find(e => e.type === 'sabotaged');
        if (existing) {
          existing.duration = 2;
        } else {
          target.statusEffects.push({ type: 'sabotaged', duration: 2 });
        }
        events.push({ type: 'sabotage', message: `Vex's sabotage weakens ${target.name} (-1 ATK for 2 turns)` });
      }
      break;
    }
    case 'RS-C-07': { // v1.2 - Ivy: Crystal Record (grant Shield 1 to random friendly card)
      // Exclude Ivy's own dying slot - spec: "Ivy is last card → fizzles"
      const allySlots = owner.field.map((c, idx) => c && idx !== slotIndex ? idx : -1).filter(idx => idx >= 0);
      const t = allySlots.length > 0 ? allySlots[Math.floor(Math.random() * allySlots.length)] : null;
      if (t !== null) {
        owner.field[t]!.shield += 1;
        events.push({ type: 'ability', message: `Ivy's crystal record shields ${owner.field[t]!.name} (Shield 1)` });
      }
      break;
    }
    case 'EP-C-02': { // Brand - Deal 1 random enemy
      const t = randomFieldTarget(opp);
      if (t !== null) {
        let dmg = 1;
        if (isMarked(opp.field[t]!)) dmg += 1;  // v1.2: Shadow Mark
        dealDamage(opp.field[t]!, dmg, events, `Brand's flames hit ${opp.field[t]!.name} for ${dmg}`, oppSide, t);
      }
      break;
    }
    case 'EP-C-03': { // Flint - +2 ATK to random friendly (exclude self dying slot)
      const flintAllySlots = owner.field.map((c, idx) => c && idx !== slotIndex ? idx : -1).filter(idx => idx >= 0);
      const t = flintAllySlots.length > 0 ? flintAllySlots[Math.floor(Math.random() * flintAllySlots.length)] : null;
      if (t !== null) {
        owner.field[t]!.currentAtk += 2;
        events.push({ type: 'buff', message: `${owner.field[t]!.name} fueled by Flint's flame` });
      }
      break;
    }
    case 'EP-R-03': { // Ashara - Heal 4 player HP
      owner.hp = Math.min(20, owner.hp + 4);
      events.push({ type: 'heal', message: 'Ashara\'s ashes restore 4 HP' });
      break;
    }
    case 'IB-C-03': { // Clay - Heal 2 player HP
      owner.hp = Math.min(20, owner.hp + 2);
      events.push({ type: 'heal', message: 'Clay returns to the earth, healing 2 HP' });
      break;
    }
    case 'IB-E-02': { // Willow - Summon 2/2 Seedling
      const emptySlot = owner.field.findIndex(s => s === null);
      if (emptySlot !== -1) {
        owner.field[emptySlot] = createToken('Seedling', 2, 2, 'Ironroot Bastion');
        events.push({ type: 'summon', message: 'A Seedling sprouts from Willow', targetSide: side, targetSlot: emptySlot });
      }
      break;
    }
  }
}

// ============================================================================
// Death Check - FIX 1.4: 3 slots
// ============================================================================
function checkDead(state: GameState, events: CombatEvent[]) {
  for (const side of ['player', 'opponent'] as Side[]) {
    const p = side === 'player' ? state.player : state.opponent;
    const opp = side === 'player' ? state.opponent : state.player;
    for (let i = 0; i < 3; i++) {  // FIX 1.4: 3 slots
      if (p.field[i] && p.field[i]!.currentHp <= 0) {
        const dead = p.field[i]!;
        events.push({ type: 'death', message: `${dead.name} is destroyed`, targetSide: side, targetSlot: i });
        triggerOnDeath(state, dead, side, i, p, opp, events);
        if (!dead.isToken) p.graveyard.push(dead);
        p.field[i] = null;
      }
    }
  }
}

// ============================================================================
// Passive Recalculation
// v1.2: Hush gates on all passives, Sabotage ATK reduction,
//        dynamic HP auras for Thornwall + Aurelia (with Hush pause/resume)
// ============================================================================
export function applyPassives(state: GameState) {
  for (const side of ['player', 'opponent'] as Side[]) {
    const p = side === 'player' ? state.player : state.opponent;

    // ── ATK Reset ──────────────────────────────────────────────────────
    for (const card of p.field) {
      if (!card) continue;

      // Base ATK
      let effectiveBase = card.baseAtk;

      // v1.2: Sabotage reduces base ATK (min 1)
      if (card.statusEffects.some(e => e.type === 'sabotaged')) {
        effectiveBase = Math.max(1, effectiveBase - 1);
      }

      // v1.2: Rage stacks are PAUSED while Hushed (not lost)
      if (isHushed(card)) {
        card.currentAtk = effectiveBase;  // No rage stacks
      } else {
        card.currentAtk = effectiveBase + card.rageStacks;
      }
    }

    // ── Graves Passive: +1 ATK while at 1 HP (v1.2: Hush gate) ────────────
    // Card text: "+1 ATK while HP is at 1" - literal 1 HP, not "at max HP"
    // If Graves is buffed (Dorian aura, Guiding Light), bonus triggers when damaged to 1 HP
    for (const card of p.field) {
      if (card && card.id === 'OV-C-06' && card.currentHp === 1 && !isHushed(card)) {
        card.currentAtk += 1;
      }
    }

    // ── Sylas Passive: all Shadow +1 ATK (v1.2: Hush gate on Sylas) ──
    const sylasCard = p.field.find(c => c && c.id === 'OV-L-01') ?? null;
    if (sylasCard && !isHushed(sylasCard)) {
      for (const c of p.field) {
        if (c && c.tribe === 'Obsidian Veil') c.currentAtk += 1;
      }
    }

    // ── Dorian Passive: all OTHER allies +1 HP aura (v1.2: Hush gate) ──
    const dorianCard = p.field.find(c => c && c.id === 'RS-R-03') ?? null;
    const dorianActive = dorianCard && !isHushed(dorianCard);
    for (const c of p.field) {
      if (!c || c.id === 'RS-R-03') continue;  // Dorian says "other"
      const hasAura = c.statusEffects.some(e => e.type === 'dorian_aura');
      const hasPaused = c.statusEffects.some(e => e.type === 'dorian_aura_paused');

      if (dorianActive && !hasAura) {
        // Apply aura
        c.maxHp += 1;
        if (!hasPaused) c.currentHp += 1;  // First time: also heal; reactivation: maxHp only
        c.statusEffects.push({ type: 'dorian_aura', duration: 999 });
        c.statusEffects = c.statusEffects.filter(e => e.type !== 'dorian_aura_paused');
      } else if (!dorianActive && hasAura) {
        // Remove aura (Dorian died or Hushed)
        c.maxHp = Math.max(1, c.maxHp - 1);
        c.currentHp = Math.min(c.currentHp, c.maxHp);
        c.statusEffects = c.statusEffects.filter(e => e.type !== 'dorian_aura');
        // If Dorian is hushed (not dead), mark as paused for HP-restore tracking
        if (dorianCard) {
          c.statusEffects.push({ type: 'dorian_aura_paused', duration: 999 });
        }
      }
    }

    // ── Thornwall Passive: all Earth +1 HP aura (v1.2: dynamic, Hush gate) ──
    const thornwallCard = p.field.find(c => c && c.id === 'IB-L-01') ?? null;
    const thornwallActive = thornwallCard && !isHushed(thornwallCard);
    for (const c of p.field) {
      if (!c) continue;
      if (c.tribe !== 'Ironroot Bastion') continue;  // Earth cards only (includes Thornwall self)
      const hasAura = c.statusEffects.some(e => e.type === 'thornwall_aura');
      const hasPaused = c.statusEffects.some(e => e.type === 'thornwall_aura_paused');

      if (thornwallActive && !hasAura) {
        c.maxHp += 1;
        if (!hasPaused) c.currentHp += 1;
        c.statusEffects.push({ type: 'thornwall_aura', duration: 999 });
        c.statusEffects = c.statusEffects.filter(e => e.type !== 'thornwall_aura_paused');
      } else if (!thornwallActive && hasAura) {
        c.maxHp = Math.max(1, c.maxHp - 1);
        c.currentHp = Math.min(c.currentHp, c.maxHp);
        c.statusEffects = c.statusEffects.filter(e => e.type !== 'thornwall_aura');
        if (thornwallCard) {
          c.statusEffects.push({ type: 'thornwall_aura_paused', duration: 999 });
        }
      }
    }

    // ── Aurelia Passive: all Light +1 HP aura (v1.2: dynamic, Hush gate) ──
    const aureliaCard = p.field.find(c => c && c.id === 'RS-L-01') ?? null;
    const aureliaActive = aureliaCard && !isHushed(aureliaCard);
    for (const c of p.field) {
      if (!c) continue;
      if (c.tribe !== 'Radiant Sanctum') continue;  // Light cards only (includes Aurelia self)
      const hasAura = c.statusEffects.some(e => e.type === 'aurelia_aura');
      const hasPaused = c.statusEffects.some(e => e.type === 'aurelia_aura_paused');

      if (aureliaActive && !hasAura) {
        c.maxHp += 1;
        if (!hasPaused) c.currentHp += 1;
        c.statusEffects.push({ type: 'aurelia_aura', duration: 999 });
        c.statusEffects = c.statusEffects.filter(e => e.type !== 'aurelia_aura_paused');
      } else if (!aureliaActive && hasAura) {
        c.maxHp = Math.max(1, c.maxHp - 1);
        c.currentHp = Math.min(c.currentHp, c.maxHp);
        c.statusEffects = c.statusEffects.filter(e => e.type !== 'aurelia_aura');
        if (aureliaCard) {
          c.statusEffects.push({ type: 'aurelia_aura_paused', duration: 999 });
        }
      }
    }

    // ── Tribal Synergy Bonuses (system-level, NOT affected by Hush) ──
    const tribeCounts: Record<string, number> = {};
    for (const c of p.field) {
      if (c && c.tribe !== 'Tribeless') {
        tribeCounts[c.tribe] = (tribeCounts[c.tribe] || 0) + 1;
      }
    }
    for (const [tribe, count] of Object.entries(tribeCounts)) {
        for (const c of p.field) {
          if (c && c.tribe === tribe) {
          if (count >= 3) {
            c.currentAtk += 2;  // +2 ATK for 3 same-tribe
            // +1 HP for 3-count synergy (tracked as aura tag to prevent stacking)
            const hasSynergyBuff = c.statusEffects.some(e => e.type === 'synergy3_hp');
            if (!hasSynergyBuff) {
              c.maxHp += 1;
              c.currentHp += 1;
              c.statusEffects.push({ type: 'synergy3_hp', duration: 999 });
            }
          } else if (count >= 2) {
            c.currentAtk += 1;  // +1 ATK for 2 same-tribe
            // Remove 3-count HP buff if we dropped from 3 to 2
            const hasSynergyBuff = c.statusEffects.some(e => e.type === 'synergy3_hp');
            if (hasSynergyBuff) {
              c.maxHp = Math.max(1, c.maxHp - 1);
              c.currentHp = Math.min(c.currentHp, c.maxHp);
              c.statusEffects = c.statusEffects.filter(e => e.type !== 'synergy3_hp');
            }
          } else {
            // Count dropped below 2: remove synergy HP buff if present
            const hasSynergyBuff = c.statusEffects.some(e => e.type === 'synergy3_hp');
            if (hasSynergyBuff) {
              c.maxHp = Math.max(1, c.maxHp - 1);
              c.currentHp = Math.min(c.currentHp, c.maxHp);
              c.statusEffects = c.statusEffects.filter(e => e.type !== 'synergy3_hp');
            }
          }
        }
      }
    }
  }
}

// ============================================================================
// End of Turn Processing
// v1.2: Mark, Sabotage, Hush duration decrements + applyPassives call
// ============================================================================
export function processEndOfTurn(inputState: GameState): GameState {
  const state = structuredClone(inputState);
  const events: CombatEvent[] = [];
  const p = state.activePlayer === 'player' ? state.player : state.opponent;

  // Process active player's field: burn ticks, status durations
  for (let i = 0; i < 3; i++) {  // FIX 1.4: 3 slots
    const card = p.field[i];
    if (!card) continue;

    // Burn ticks (v1.2: Shadow Mark amplifies burns)
    const burns = card.statusEffects.filter(e => e.type === 'burn');
    for (const burn of burns) {
      let burnDmg = burn.value || 1;
      if (isMarked(card)) burnDmg += 1;  // v1.2: Mark bonus
      card.currentHp -= burnDmg;
      burn.duration -= 1;
    }

    // FIX 3.1 - Wound duration countdown
    const wounds = card.statusEffects.filter(e => e.type === 'wound');
    for (const wound of wounds) {
      wound.duration -= 1;
    }

    // v1.2 - Shadow Mark duration countdown (decrements on marked card's owner's turn)
    const marks = card.statusEffects.filter(e => e.type === 'marked');
    for (const mark of marks) {
      mark.duration -= 1;
    }

    // v1.2 - Sabotage duration countdown (decrements on sabotaged card's owner's turn)
    const sabotages = card.statusEffects.filter(e => e.type === 'sabotaged');
    for (const sab of sabotages) {
      sab.duration -= 1;
    }

    // v1.2 - Hush duration countdown (decrements every end-of-turn for ~1.5 turn window)
    const hushes = card.statusEffects.filter(e => e.type === 'hushed');
    for (const h of hushes) {
      h.duration -= 1;
    }

    // Stealth duration
    card.statusEffects = card.statusEffects.map(e =>
      e.type === 'stealth' ? { ...e, duration: e.duration - 1 } : e
    );

    // Remove expired effects (duration reached 0)
    card.statusEffects = card.statusEffects.filter(e => e.duration > 0);

    // FIX 4.1 - Remove stun at END of turn (card already skipped combat this turn)
    card.statusEffects = card.statusEffects.filter(e => e.type !== 'stun');
  }

  // Process opponent's field - ONLY Hush cross-turn countdown (not burns!)
  // Burns follow the same convention as Wound/Mark/Sabotage: tick once per owner's turn only.
  // Hush intentionally decrements in both loops for ~1.5 turn timing (duration 3 ÷ 2 ticks/round).
  const opp = state.activePlayer === 'player' ? state.opponent : state.player;
  for (let i = 0; i < 3; i++) {  // FIX 1.4: 3 slots
    const card = opp.field[i];
    if (!card) continue;

    // v1.2 - Hush cross-turn countdown (decrements in opponent loop too for ~1.5 turn timing)
    const hushes = card.statusEffects.filter(e => e.type === 'hushed');
    for (const h of hushes) {
      h.duration -= 1;
    }

    // Remove expired effects
    card.statusEffects = card.statusEffects.filter(e => e.duration > 0);
  }

  checkDead(state, events);

  // v1.2: Recalculate passives after status changes (Hush expiry reactivates auras)
  applyPassives(state);

  // Switch active player
  state.activePlayer = state.activePlayer === 'player' ? 'opponent' : 'player';

  if (state.player.hp <= 0) state.winner = 'opponent';
  if (state.opponent.hp <= 0) state.winner = 'player';

  return state;
}

// ============================================================================
// Active Abilities
// FIX 2.4 - Sera heal: 3 → 2
// FIX 2.6 - Volkar Blood Price: -3/+3 → -2/+2
// FIX 4.6 - Blood Price HP safety check
// FIX 3.1 - All healing is Wound-aware
// ============================================================================
export function useActiveAbility(inputState: GameState, cardInstanceId: string, side: Side): { state: GameState; events: CombatEvent[] } {
  const state = structuredClone(inputState);
  const p = side === 'player' ? state.player : state.opponent;
  const opp = side === 'player' ? state.opponent : state.player;
  const events: CombatEvent[] = [];

  let card: CardInstance | null = null;
  for (const c of p.field) {
    if (c && c.instanceId === cardInstanceId && !c.activeUsed) { card = c; break; }
  }
  if (!card) return { state: inputState, events: [] };

  switch (card.id) {
    case 'RS-R-02': { // FIX 2.4 - Sera: Heal 2 (was 3), costs 1 energy, Wound-aware
      if (p.energy < 1) return { state: inputState, events: [] };
      p.energy -= 1;
      const t = randomFieldTarget(p);
      if (t !== null) {
        const healed = applyHeal(p.field[t]!, 2);
        events.push({ type: 'heal', message: `Sera heals ${p.field[t]!.name} for ${healed}` });
      } else {
        const healed = applyPlayerHeal(p, 2);
        events.push({ type: 'heal', message: `Sera heals player for ${healed}` });
      }
      break;
    }
    case 'EP-E-02': { // FIX 2.6 + 4.6 - Volkar: -2 HP/+2 ATK (was -3/+3), with HP safety check
      if (p.hp <= 2) return { state: inputState, events: [] };
      p.hp -= 2;
      card.currentAtk += 2;
      events.push({ type: 'ability', message: 'Volkar pays in blood - +2 ATK' });
      break;
    }
    case 'EP-C-06': { // Kindle: -1 HP/+1 ATK, with HP safety check
      if (p.hp <= 1) return { state: inputState, events: [] };
      p.hp -= 1;
      card.currentAtk += 1;
      events.push({ type: 'ability', message: 'Kindle bleeds for power' });
      break;
    }
    case 'IB-R-01': { // Barric - +1 HP to ally, 1 energy
      if (p.energy < 1) return { state: inputState, events: [] };
      p.energy -= 1;
      const t = randomFieldTarget(p);
      if (t !== null) {
        p.field[t]!.maxHp += 1;
        p.field[t]!.currentHp += 1;
        events.push({ type: 'buff', message: `Barric fortifies ${p.field[t]!.name}` });
      }
      break;
    }
    case 'IB-C-04': { // Fern - Heal 1 to friendly, 0 energy (FIX 3.1: Wound-aware)
      const t = randomFieldTarget(p);
      if (t !== null) {
        const healed = applyHeal(p.field[t]!, 1);
        events.push({ type: 'heal', message: `Fern mends ${p.field[t]!.name} (${healed} HP)` });
      }
      break;
    }
    case 'IB-E-02': { // Willow - +2 HP to ally, 1 energy
      if (p.energy < 1) return { state: inputState, events: [] };
      p.energy -= 1;
      const t = randomFieldTarget(p);
      if (t !== null) {
        p.field[t]!.maxHp += 2;
        p.field[t]!.currentHp += 2;
        events.push({ type: 'buff', message: `Willow strengthens ${p.field[t]!.name}` });
      }
      break;
    }
  }

  card.activeUsed = true;
  return { state, events };
}

export const ACTIVE_ABILITY_CARDS = ['RS-R-02', 'EP-E-02', 'EP-C-06', 'IB-R-01', 'IB-C-04', 'IB-E-02'];
