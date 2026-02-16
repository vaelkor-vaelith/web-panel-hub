export interface StatusEffect {
  type: 'burn' | 'stun' | 'stealth' | 'slow' | 'wound'   // FIX 3.1: Added 'wound'
    | 'marked' | 'hushed' | 'sabotaged' | 'farsight'       // v1.2: Shadow Mark, Hush, Sabotage, Farsight
    | 'dorian_aura' | 'dorian_aura_paused'                  // Dorian HP aura tracking
    | 'thornwall_aura' | 'thornwall_aura_paused'            // Thornwall HP aura tracking (v1.2: dynamic)
    | 'aurelia_aura' | 'aurelia_aura_paused'                // Aurelia HP aura tracking (v1.2: dynamic)
    | 'synergy3_hp';                                         // 3-count tribal synergy HP tracking
  duration: number;
  value?: number;
}

export interface CardInstance {
  instanceId: string;
  id: string;
  name: string;
  title: string;
  tribe: string;
  rarity: string;
  cost: number;
  baseAtk: number;
  baseHp: number;
  currentAtk: number;
  currentHp: number;
  maxHp: number;
  shield: number;
  abilityName: string;
  abilityType: string;
  abilityDesc: string;
  quote: string;
  statusEffects: StatusEffect[];
  canAttack: boolean;
  hasAttacked: boolean;
  activeUsed: boolean;
  isToken: boolean;
  rageStacks: number;
  dmgReductionUsed: boolean;  // FIX 4.2: For Nyx/Tomas first-attack reduction
}

export interface PlayerState {
  hp: number;
  energy: number;
  maxEnergy: number;
  hand: CardInstance[];
  deck: CardInstance[];
  field: (CardInstance | null)[];  // 3 slots per GDD
  graveyard: CardInstance[];
  energyPenalty: number;  // FIX 4.4: For Vaelith's halve effect
}

export type Side = 'player' | 'opponent';
export type Phase = 'start' | 'playing' | 'combat' | 'enemyTurn' | 'gameOver';

export interface CombatEvent {
  type: 'attack' | 'damage' | 'heal' | 'death' | 'deploy' | 'ability' | 'burn' | 'direct' | 'buff' | 'summon' | 'wound' | 'mark' | 'hush' | 'sabotage' | 'farsight';
  message: string;
  attackerSlot?: number;
  defenderSlot?: number;
  attackerSide?: Side;
  defenderSide?: Side;
  value?: number;
  targetSide?: Side;
  targetSlot?: number;
  tribe?: string;
}

export interface GameState {
  turn: number;
  phase: Phase;
  activePlayer: Side;
  player: PlayerState;
  opponent: PlayerState;
  winner: Side | null;
  log: string[];
  selectedHandIndex: number | null;
  firstTurnSkipDraw: boolean;  // FIX 1.7: First-turn no-draw rule
}
