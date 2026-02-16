import type { GameState, CombatEvent } from './types';
import { runSmartAI } from './aiDeepSeek';

// Re-export the smart AI as the default opponent AI
export function runAI(inputState: GameState): { state: GameState; events: CombatEvent[] } {
  return runSmartAI(inputState, 'opponent');
}
