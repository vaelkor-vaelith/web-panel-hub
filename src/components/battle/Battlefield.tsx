import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import battlefieldVideo from "@/assets/battlefield-bg.mp4";
import battlefieldBg from "@/assets/battlefield-bg.jpg";
import castleObsidianVeil from "@/assets/castle-obsidian-veil.jpg";
import castleRadiantSanctum from "@/assets/castle-radiant-sanctum.jpg";
import castleEmberheartPact from "@/assets/castle-emberheart-pact.jpg";
import castleIronrootBastion from "@/assets/castle-ironroot-bastion.jpg";
import vaelkorThrone from "@/assets/vaelkor-hollow-crown.jpg";
import MusicPlayer from "./MusicPlayer";
import type { GameState, Side, CombatEvent } from "@/game/types";
import {
  createGame, startTurn, deployCard, resolveCombat,
  processEndOfTurn, buildRandomDeck, buildTribalDeck, useActiveAbility, ACTIVE_ABILITY_CARDS,
} from "@/game/engine";
import { runAI } from "@/game/ai";
import { runSmartAI, runDeepSeekAI } from "@/game/aiDeepSeek";
import { runOpenAIGPT } from "@/game/aiGPT";
import {
  sfxCardSelect, sfxCardDeploy, sfxAttack, sfxDamage, sfxDeath, sfxTurnStart,
  sfxEndTurn, sfxVictory, sfxDefeat, sfxAbility, stopMusic, speakQuote,
} from "@/game/soundEngine";
import { allCards } from "@/data/allCards";
import BattleCard from "./BattleCard";
import HandCard from "./HandCard";
import PlayerHUD from "./PlayerHUD";
import AmbientParticles from "./AmbientParticles";
import BattleLog from "./BattleLog";
import CardInfoPanel from "./CardInfoPanel";
import AttackProjectiles from "./AttackProjectiles";
import MythicEffects from "./MythicEffects";
import ThinkingPanel from "./ThinkingPanel";
import type { MythicEffectType } from "./MythicEffects";
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ============================================================================
// Precise Animation Timing Constants
// Derived from actual framer-motion values in each component file.
//
// Spring settling: t_s = -ln(0.02) / (ζ × ωn)
//   where ζ = damping / (2 × √stiffness), ωn = √stiffness
// ============================================================================
const TIMING = {
  // ── BattleCard.tsx ──
  // spring({ stiffness: 200, damping: 16 }) → ζ=0.566, ωn=14.14, t_s=489ms
  // filter transition: { duration: 0.6 } = 600ms
  // Enter/exit dominated by the slower filter: max(489, 600) = 600ms
  CARD_ENTER:        600,
  CARD_EXIT:         600,
  // y-shift ±36px uses same spring, settling ≈ 489ms
  CARD_ATTACK_Y:     489,
  // x shake keyframes: { duration: 0.4 } = 400ms
  CARD_DAMAGE_SHAKE: 400,
  // Damage popup: { duration: 1 } = 1000ms (scale 0.5→2.5, opacity 1→0)
  DAMAGE_POPUP:      1000,
  // Hit flash: { duration: 0.35 } = 350ms
  HIT_FLASH:         350,
  // HP bar: { duration: 0.4, ease: "easeOut" } = 400ms
  HP_BAR:            400,

  // ── AttackProjectiles.tsx ──
  // DURATION = 0.5s; completion timer = (0.5+0.15)*1000 = 650ms
  PROJECTILE:        650,
  // Impact flash: duration = 0.5 + 0.2 = 700ms
  PROJECTILE_IMPACT: 700,

  // ── HandCard.tsx ──
  // spring({ stiffness: 280, damping: 20 }) → ζ=0.598, ωn=16.73, t_s=391ms
  // Per-card delay: index × 50ms. Max 7 cards → last at 6×50=300ms
  HAND_CARD:         391,
  HAND_FULL_DEAL:    691,   // 300 + 391

  // ── MythicEffects.tsx ──
  // VaelkorEffect: setTimeout(onComplete, 5600)
  MYTHIC_VAELKOR:    5600,
  // VaelithEffect: setTimeout(onComplete, 5400)
  MYTHIC_VAELITH:    5400,

  // ── Battlefield.tsx screen effects ──
  // Screen flash: { duration: 0.2 } = 200ms
  SCREEN_FLASH:      200,
  // Screen shake: animate-[shake_0.35s] = 350ms
  SCREEN_SHAKE:      350,

  // ── Pacing pauses (human read-time, not animation) ──
  READ_PHASE:        500,   // Time to read a phase announcement
  READ_RESULT:       400,   // Time to absorb a combat result
  PHASE_TRANSITION:  600,   // Gap between phases
  TURN_TRANSITION:   800,   // Gap between turns

  // ── Fast mode (overnight data collection — no human watching) ──
  FAST_READ_PHASE:       50,
  FAST_READ_RESULT:      50,
  FAST_PHASE_TRANSITION: 50,
  FAST_TURN_TRANSITION:  50,
  FAST_CARD_ENTER:       50,
  FAST_HP_BAR:           50,
  FAST_HAND_CARD:        50,
} as const;

type GameMode = 'menu' | 'pvai' | 'gpt-vs-r1';

const ARENA_BACKGROUNDS = [
  { image: castleObsidianVeil, name: 'Obsidian Veil Citadel' },
  { image: castleRadiantSanctum, name: 'Radiant Sanctum' },
  { image: castleEmberheartPact, name: 'Emberheart Pact Fortress' },
  { image: castleIronrootBastion, name: 'Ironroot Bastion' },
  { image: vaelkorThrone, name: "Vaelkor's Throne" },
];

function pickRandomArena() {
  return ARENA_BACKGROUNDS[Math.floor(Math.random() * ARENA_BACKGROUNDS.length)];
}

const Battlefield = () => {
  const isMobile = useIsMobile();
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [game, setGame] = useState<GameState | null>(null);
  const [arena, setArena] = useState(pickRandomArena);
  const [animating, setAnimating] = useState(false);
  const [attackingSlots, setAttackingSlots] = useState<Set<string>>(new Set());
  const [damagedSlots, setDamagedSlots] = useState<Map<string, number>>(new Map());
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [screenFlash, setScreenFlash] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  // musicOn state removed - MusicPlayer handles its own state
  const [hoveredCard, setHoveredCard] = useState<import("@/game/types").CardInstance | null>(null);
  const [showEndLog, setShowEndLog] = useState(false);
  const [mythicEffect, setMythicEffect] = useState<MythicEffectType>(null);
  const [mythicShaking, setMythicShaking] = useState(false);
  const [aiThinking, setAiThinking] = useState<string>('');
  const [aiThinkingPlayer, setAiThinkingPlayer] = useState<string>('');
  const [aiThinking2, setAiThinking2] = useState<string>('');     // Second AI (GPT vs R1 mode)
  const [aiThinkingPlayer2, setAiThinkingPlayer2] = useState<string>('');
  const [p1Name, setP1Name] = useState('Player');
  const [p2Name, setP2Name] = useState('AI');
  const aiAutoPlayRef = useRef(false);
  const autoRestartRef = useRef(false);  // For overnight continuous battles
  const gameCountRef = useRef(0);        // Track total games played
  const gameStartTimeRef = useRef(0);    // Track game duration
  const lastTurnActivityRef = useRef(0); // Watchdog: last time a turn completed
  // Music player is now handled by MusicPlayer component
  const [activeProjectiles, setActiveProjectiles] = useState<{
    fromRect: DOMRect;
    toRect: DOMRect;
    tribe: string;
    id: string;
  }[]>([]);

  // Stable ref for the projectile-volley resolver.
  const projectileResolveRef = useRef<(() => void) | null>(null);

  const addLog = useCallback((msgs: string[]) => {
    setEventLog(prev => [...prev, ...msgs].slice(-80));
  }, []);

  // toggleMusic removed - MusicPlayer handles its own controls

  // Start a new game with the given mode
  const startGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setArena(pickRandomArena());
    const deck1 = buildRandomDeck();
    const deck2 = buildRandomDeck();
    const g = createGame(deck1, deck2);
    const started = startTurn(g);
    setGame(started);
    setAnimating(false);
    setShowEndLog(false);
    setAiThinking('');
    setAiThinking2('');

    // Set player names based on mode
    if (mode === 'gpt-vs-r1') {
      setP1Name('General Aurelia');
      setP2Name('General Sylas');
      gameCountRef.current += 1;
      gameStartTimeRef.current = Date.now();
      lastTurnActivityRef.current = Date.now();
      setEventLog([`War of Minds begins. Game #${gameCountRef.current}. Two generals clash for dominion.`]);
      aiAutoPlayRef.current = true;
      autoRestartRef.current = true;  // Enable auto-restart for continuous data collection
    } else {
      setEventLog([`Game begins. Your turn.`]);
      autoRestartRef.current = false;
    }
  }, []);

  // Music is now handled by the <MusicPlayer /> component below

  // ============================================================================
  // Battle result logger — sends game outcome to server for overnight collection
  // ============================================================================
  const logBattleResult = useCallback(async (finalState: GameState, log: string[]) => {
    const winnerName = finalState.winner === 'player' ? p1Name : p2Name;
    const durationSeconds = Math.round((Date.now() - gameStartTimeRef.current) / 1000);
    fetch('/api/log-battle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameNumber: gameCountRef.current,
        winner: winnerName,
        p1Name,
        p2Name,
        p1Hp: finalState.player.hp,
        p2Hp: finalState.opponent.hp,
        turns: finalState.turn,
        durationSeconds,
        eventLog: log,
        p1Deck: finalState.player.hand.map(c => c.name).join(', '),
        p2Deck: finalState.opponent.hand.map(c => c.name).join(', '),
        p1Graveyard: finalState.player.graveyard.map(c => c.name).join(', '),
        p2Graveyard: finalState.opponent.graveyard.map(c => c.name).join(', '),
      }),
    }).catch(() => {});
  }, [p1Name, p2Name]);

  // ============================================================================
  // AI vs AI Auto-Play Loop
  // ============================================================================
  const turnRunningRef = useRef(false); // Prevents concurrent runTurn executions

  useEffect(() => {
    if (gameMode !== 'gpt-vs-r1' || !game || game.winner) {
      aiAutoPlayRef.current = false;
      return;
    }
    if (!aiAutoPlayRef.current) return;
    // CRITICAL: Don't schedule a new turn while one is already executing.
    // setGame() calls inside runTurn trigger this effect to re-fire,
    // but we must not start a second concurrent runTurn.
    if (turnRunningRef.current) return;

    const runTurn = async () => {
      if (!aiAutoPlayRef.current || !game || game.winner) {
        turnRunningRef.current = false;
        return;
      }
      turnRunningRef.current = true;
      let currentState = game;

      // Use fast timings for overnight auto-restart mode
      const fast = autoRestartRef.current;
      const t = {
        readPhase:       fast ? TIMING.FAST_READ_PHASE       : TIMING.READ_PHASE,
        readResult:      fast ? TIMING.FAST_READ_RESULT      : TIMING.READ_RESULT,
        phaseTransition: fast ? TIMING.FAST_PHASE_TRANSITION : TIMING.PHASE_TRANSITION,
        cardEnter:       fast ? TIMING.FAST_CARD_ENTER       : TIMING.CARD_ENTER,
        hpBar:           fast ? TIMING.FAST_HP_BAR           : TIMING.HP_BAR,
        handCard:        fast ? TIMING.FAST_HAND_CARD        : TIMING.HAND_CARD,
      };

      setAnimating(true);
      const isPlayer = currentState.activePlayer === 'player';
      const side: Side = currentState.activePlayer;
      const playerName = isPlayer ? p1Name : p2Name;

      // ══════════════════════════════════════════
      // DEPLOY PHASE
      // ══════════════════════════════════════════
      addLog([`[${playerName}'s Deploy Phase]`]);
      await sleep(t.readPhase);

      let deployResult: { state: GameState; events: CombatEvent[] };
      if (gameMode === 'gpt-vs-r1') {
        // War of Minds: Player 1 = General Aurelia, Player 2 = General Sylas
        if (isPlayer) {
          setAiThinkingPlayer(playerName);
          setAiThinking('Strategizing...\n');
          deployResult = await runOpenAIGPT(currentState, side, playerName, (thinking) => {
            setAiThinking(thinking);
          });
        } else {
          setAiThinkingPlayer2(playerName);
          setAiThinking2('Strategizing...\n');
          deployResult = await runDeepSeekAI(currentState, side, playerName, (thinking) => {
            setAiThinking2(thinking);
          });
        }
      } else {
        deployResult = runSmartAI(currentState, side);
      }

      currentState = deployResult.state;
      setGame(currentState);

      if (deployResult.events.length) {
        if (!fast) sfxCardDeploy(); // Skip sounds in fast mode
        addLog(deployResult.events.map(e => e.message));
        const mythicEvt = deployResult.events.find(e =>
          e.message.includes('Vaelkor') || e.message.includes('Vaelith')
        );
        if (mythicEvt && !fast) {
          const isVaelkor = mythicEvt.message.includes('Vaelkor');
          setMythicShaking(true);
          setMythicEffect(isVaelkor ? 'vaelkor' : 'vaelith');
          await sleep(isVaelkor ? TIMING.MYTHIC_VAELKOR : TIMING.MYTHIC_VAELITH);
          setMythicShaking(false);
          setMythicEffect(null);
        } else {
          await sleep(t.cardEnter);
        }
      } else {
        addLog([`${playerName} has nothing to deploy.`]);
      }

      await sleep(t.phaseTransition);

      // ══════════════════════════════════════════
      // COMBAT PHASE
      // ══════════════════════════════════════════
      addLog([`[${playerName}'s Combat]`]);
      await sleep(t.readPhase);

      const combatResult = resolveCombat(currentState, side);
      if (!fast) {
        await animateCombatEventsRef.current(combatResult.events);
      }

      if (combatResult.events.length) {
        addLog(combatResult.events.map(e => e.message));
      } else {
        addLog([`No combat this phase.`]);
      }

      currentState = combatResult.state;
      setGame(currentState);

      if (currentState.winner) {
        await sleep(t.phaseTransition);
        const winnerName = currentState.winner === 'player' ? p1Name : p2Name;
        addLog([`${winnerName} wins!`]);
        await logBattleResult(currentState, [...eventLog, `${winnerName} wins!`]);
        setGame({ ...currentState, phase: 'gameOver' });
        setAnimating(false);
        aiAutoPlayRef.current = false;
        turnRunningRef.current = false;
        if (autoRestartRef.current) {
          await sleep(2000); // Reduced from 5s for faster turnover
          startGame('gpt-vs-r1');
        }
        return;
      }

      await sleep(t.phaseTransition);

      // ══════════════════════════════════════════
      // END OF TURN
      // ══════════════════════════════════════════
      addLog([`[End of Turn]`]);
      currentState = processEndOfTurn(currentState);
      setGame(currentState);
      await sleep(t.hpBar);

      if (currentState.winner) {
        await sleep(t.phaseTransition);
        const winnerName = currentState.winner === 'player' ? p1Name : p2Name;
        addLog([`${winnerName} wins!`]);
        await logBattleResult(currentState, [...eventLog, `${winnerName} wins!`]);
        setGame({ ...currentState, phase: 'gameOver' });
        setAnimating(false);
        aiAutoPlayRef.current = false;
        turnRunningRef.current = false;
        if (autoRestartRef.current) {
          await sleep(2000);
          startGame('gpt-vs-r1');
        }
        return;
      }

      await sleep(t.readResult);

      // ══════════════════════════════════════════
      // START NEXT TURN
      // ══════════════════════════════════════════
      currentState = startTurn(currentState);
      setGame(currentState);
      if (!fast) sfxTurnStart();
      await sleep(t.handCard);

      const nextPlayer = currentState.activePlayer === 'player' ? p1Name : p2Name;
      addLog([`━━━━━━━━━━━━━━━━━━━━━━━━━━`]);
      addLog([`[${nextPlayer}'s Turn (Turn ${currentState.turn})]`]);
      await sleep(t.readPhase);

      setAnimating(false);
      turnRunningRef.current = false; // Allow next turn to be scheduled
      lastTurnActivityRef.current = Date.now(); // Watchdog heartbeat
    };

    // Wait between turns — fast mode uses minimal delay
    const turnDelay = autoRestartRef.current ? 100 : (TIMING.CARD_ENTER + TIMING.TURN_TRANSITION);
    const timer = setTimeout(runTurn, turnDelay);
    return () => clearTimeout(timer);
  }, [game, gameMode, animating, addLog, p1Name, p2Name, eventLog, logBattleResult, startGame]);

  // ============================================================================
  // Watchdog: detect stuck games and force-restart (checks every 3 minutes)
  // If no turn activity for 3 minutes during an auto-restart session, restart.
  // ============================================================================
  useEffect(() => {
    if (!autoRestartRef.current) return;

    const watchdog = setInterval(() => {
      const elapsed = Date.now() - lastTurnActivityRef.current;
      // 3 minutes with no turn completion = stuck
      if (lastTurnActivityRef.current > 0 && elapsed > 180_000) {
        console.warn(`[Watchdog] Game stuck for ${Math.round(elapsed / 1000)}s. Force-restarting...`);
        fetch('/api/log-thinking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player: 'WATCHDOG',
            text: `Game #${gameCountRef.current} stuck for ${Math.round(elapsed / 1000)}s. Force-restarting.`,
            side: 'player',
            type: 'start',
          }),
        }).catch(() => {});

        // Force reset and start fresh
        aiAutoPlayRef.current = false;
        turnRunningRef.current = false;
        setAnimating(false);
        startGame('gpt-vs-r1');
      }
    }, 30_000); // Check every 30 seconds

    return () => clearInterval(watchdog);
  }, [startGame]);

  // ============================================================================
  // Keep-alive: prevent browser tab throttling during overnight runs
  // Uses a Web Lock to signal the browser this tab is active.
  // Also pings the server every 30s to keep connections warm.
  // ============================================================================
  useEffect(() => {
    if (!autoRestartRef.current) return;

    // Web Lock keep-alive (prevents Chrome from throttling timers)
    let lockHeld = false;
    if (navigator.locks) {
      navigator.locks.request('overnight-battle-keepalive', { mode: 'exclusive' }, () => {
        lockHeld = true;
        // Hold the lock forever (until tab closes)
        return new Promise(() => {});
      }).catch(() => {});
    }

    // Periodic server ping to keep proxy connections alive
    const keepAlive = setInterval(() => {
      fetch('/api/log-thinking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: 'KEEPALIVE', text: `Game #${gameCountRef.current}`, side: 'player', type: 'done' }),
      }).catch(() => {});
    }, 30_000);

    return () => {
      clearInterval(keepAlive);
      // Lock is released automatically when the promise never resolves
    };
  }, []);

  // ============================================================================
  // Player vs AI Handlers
  // ============================================================================
  const handleSelectHand = useCallback((index: number) => {
    if (!game || animating || game.phase !== 'playing' || gameMode !== 'pvai') return;
    sfxCardSelect();
    setGame(prev => prev ? { ...prev, selectedHandIndex: prev.selectedHandIndex === index ? null : index } : prev);
  }, [game, animating, gameMode]);

  const handleSlotClick = useCallback(async (slotIndex: number) => {
    if (!game || animating || game.phase !== 'playing' || gameMode !== 'pvai' || game.selectedHandIndex === null) return;
    if (game.player.field[slotIndex] !== null) return;
    const card = game.player.hand[game.selectedHandIndex];
    sfxCardDeploy();
    if (card) {
      const cardData = allCards.find(c => c.id === card.id);
      if (cardData?.quote) {
        setTimeout(() => speakQuote(cardData.quote, cardData.tribe, cardData.name), 350);
      }
      if (card.id === 'MY-M-01') {
        setAnimating(true);
        setMythicShaking(true);
        setMythicEffect('vaelkor');
        await sleep(TIMING.MYTHIC_VAELKOR);
        setMythicShaking(false);
        setMythicEffect(null);
      } else if (card.id === 'MY-M-02') {
        setAnimating(true);
        setMythicShaking(true);
        setMythicEffect('vaelith');
        await sleep(TIMING.MYTHIC_VAELITH);
        setMythicShaking(false);
        setMythicEffect(null);
      }
    }
    const result = deployCard(game, game.selectedHandIndex, slotIndex);
    setGame(result.state);
    if (result.events.length) addLog(result.events.map(e => e.message));
    setAnimating(false);
  }, [game, animating, addLog, gameMode]);

  const handleUseActive = useCallback((instanceId: string) => {
    if (!game || animating || game.phase !== 'playing' || gameMode !== 'pvai') return;
    sfxAbility();
    const result = useActiveAbility(game, instanceId, 'player');
    setGame(result.state);
    if (result.events.length) addLog(result.events.map(e => e.message));
  }, [game, animating, addLog, gameMode]);

  const triggerScreenFlash = useCallback(() => {
    setScreenFlash(true);
    setScreenShake(true);
    setTimeout(() => setScreenFlash(false), TIMING.SCREEN_FLASH);   // 200ms - matches { duration: 0.2 }
    setTimeout(() => setScreenShake(false), TIMING.SCREEN_SHAKE);   // 350ms - matches animate-[shake_0.35s]
  }, []);

  // Memoized callback for when AttackProjectiles finishes its volley.
  const handleProjectilesComplete = useCallback(() => {
    setActiveProjectiles([]);
    const resolve = projectileResolveRef.current;
    if (resolve) {
      projectileResolveRef.current = null;
      resolve();
    }
  }, []);

  // Fire ALL projectiles simultaneously. Returns a promise that resolves when they all land (650ms).
  const fireVolley = useCallback((
    attacks: { attackerSide: Side; attackerSlot: number; defenderSide: Side; defenderSlot: number; tribe: string }[],
  ): Promise<void> => {
    if (attacks.length === 0) return Promise.resolve();
    return new Promise((resolve) => {
      const configs: { fromRect: DOMRect; toRect: DOMRect; tribe: string; id: string }[] = [];
      const ts = Date.now();
      for (const atk of attacks) {
        const fromEl = document.querySelector(`[data-slot="${atk.attackerSide}-${atk.attackerSlot}"]`);
        const toEl = document.querySelector(`[data-slot="${atk.defenderSide}-${atk.defenderSlot}"]`);
        if (fromEl && toEl) {
          configs.push({
            fromRect: fromEl.getBoundingClientRect(),
            toRect: toEl.getBoundingClientRect(),
            tribe: atk.tribe,
            id: `${ts}-${atk.attackerSlot}-${atk.defenderSlot}`,
      });
        }
      }
      if (configs.length === 0) { resolve(); return; }
      projectileResolveRef.current = resolve;
      setActiveProjectiles(configs);
    });
  }, []);

  const animateCombatEvents = useCallback(async (events: CombatEvent[]) => {
    // ── Collect all attacks, damages, and deaths from the event list ──
    const attacks: CombatEvent[] = [];
    const damages: CombatEvent[] = [];
    const deaths: CombatEvent[] = [];
    for (const evt of events) {
      if (evt.type === 'attack') attacks.push(evt);
      else if (evt.type === 'direct') attacks.push(evt);
      else if (evt.type === 'damage') damages.push(evt);
      else if (evt.type === 'death') deaths.push(evt);
    }

    // ── 1) ALL projectiles fire simultaneously ──
    if (attacks.length > 0) {
      // SFX: one attack sound per projectile (slightly staggered for punch)
      attacks.forEach((a, i) => setTimeout(() => sfxAttack(a.tribe), i * 50));

      // Light up all attacker cards
      const atkKeys = new Set<string>();
      attacks.forEach(a => {
        if (a.attackerSlot !== undefined && a.attackerSide) atkKeys.add(`${a.attackerSide}-${a.attackerSlot}`);
      });
      setAttackingSlots(atkKeys);

      // Build volley targets (only attacks that have a defender)
      const volleyTargets = attacks
        .filter(a => a.defenderSlot !== undefined && a.defenderSide && a.tribe && a.attackerSlot !== undefined && a.attackerSide)
        .map(a => ({
          attackerSide: a.attackerSide!, attackerSlot: a.attackerSlot!,
          defenderSide: a.defenderSide!, defenderSlot: a.defenderSlot!,
          tribe: a.tribe!,
        }));

      // Fire all projectiles at once - resolves after 650ms when ALL land
      await fireVolley(volleyTargets);

      // Clear all attacker glows
      setAttackingSlots(new Set());
      }

    // ── 2) ALL damage shows simultaneously on impact ──
    if (damages.length > 0) {
        sfxDamage();
        triggerScreenFlash();

      // Accumulate damage per slot (same card may be hit by multiple attackers)
      const dmgMap = new Map<string, number>();
      for (const d of damages) {
        if (d.targetSlot !== undefined && d.targetSide) {
          const key = `${d.targetSide}-${d.targetSlot}`;
          dmgMap.set(key, (dmgMap.get(key) || 0) + (d.value || 0));
        }
      }
      setDamagedSlots(dmgMap);

      // Schedule popup cleanup in background (full 1000ms fade)
      setTimeout(() => setDamagedSlots(new Map()), TIMING.DAMAGE_POPUP);

      // Wait for shake + HP bar to settle before deaths
      await sleep(TIMING.HP_BAR); // 400ms
    }

    // ── 3) ALL deaths at once ──
    if (deaths.length > 0) {
      deaths.forEach(() => sfxDeath());
      await sleep(TIMING.CARD_EXIT); // 600ms
    }
  }, [triggerScreenFlash, fireVolley]);

  // Store ref for use in auto-play
  const animateCombatEventsRef = useRef(animateCombatEvents);
  animateCombatEventsRef.current = animateCombatEvents;

  // Player vs AI: End Turn handler
  const handleEndTurn = useCallback(async () => {
    if (!game || animating || game.phase !== 'playing' || gameMode !== 'pvai') return;
    setAnimating(true);
    sfxEndTurn();

    // ══ YOUR COMBAT ══
    addLog(["[Battle Phase]"]);
    await sleep(TIMING.READ_PHASE); // 500ms - read announcement
    const combatResult = resolveCombat(game, 'player');
    await animateCombatEvents(combatResult.events); // precise per-event waits
    addLog(combatResult.events.map(e => e.message));
    let currentState = combatResult.state;
    setGame(currentState);

    if (currentState.winner) {
      await sleep(TIMING.PHASE_TRANSITION); // 600ms
      currentState.winner === 'player' ? sfxVictory() : sfxDefeat();
      setGame({ ...currentState, phase: 'gameOver' }); setAnimating(false); return;
    }

    // ══ YOUR END OF TURN ══
    await sleep(TIMING.PHASE_TRANSITION); // 600ms
    currentState = processEndOfTurn(currentState);
    setGame(currentState);
    await sleep(TIMING.HP_BAR); // 400ms - burn damage HP bar animation
    if (currentState.winner) {
      currentState.winner === 'player' ? sfxVictory() : sfxDefeat();
      setGame({ ...currentState, phase: 'gameOver' }); setAnimating(false); return;
    }

    // ══ OPPONENT'S TURN - START ══
    currentState = startTurn(currentState);
    setGame(currentState);
    addLog(["[Opponent's Turn]"]);
    await sleep(TIMING.HAND_CARD + TIMING.READ_PHASE); // 391+500=891ms - drawn card settles + read

    // ══ OPPONENT DEPLOYS ══
    const aiResult = runAI(currentState);
    currentState = aiResult.state;
    setGame(currentState);
    if (aiResult.events.length) {
      sfxCardDeploy();
      addLog(aiResult.events.map(e => e.message));

      // Check for mythic cinematic
      const mythicEvt = aiResult.events.find(e =>
        e.message.includes('Vaelkor') || e.message.includes('Vaelith')
      );
      if (mythicEvt) {
        const isVaelkor = mythicEvt.message.includes('Vaelkor');
        setMythicShaking(true);
        setMythicEffect(isVaelkor ? 'vaelkor' : 'vaelith');
        await sleep(isVaelkor ? TIMING.MYTHIC_VAELKOR : TIMING.MYTHIC_VAELITH);
        setMythicShaking(false);
        setMythicEffect(null);
      } else {
        await sleep(TIMING.CARD_ENTER);
      }
    }

    await sleep(TIMING.PHASE_TRANSITION);

    // ══ OPPONENT COMBAT ══
    addLog(["[Opponent attacks]"]);
    await sleep(TIMING.READ_PHASE); // 500ms - read announcement
    const oppCombat = resolveCombat(currentState, 'opponent');
    await animateCombatEvents(oppCombat.events); // precise per-event waits
    addLog(oppCombat.events.map(e => e.message));
    currentState = oppCombat.state;
    setGame(currentState);

    if (currentState.winner) {
      await sleep(TIMING.PHASE_TRANSITION); // 600ms
      currentState.winner === 'player' ? sfxVictory() : sfxDefeat();
      setGame({ ...currentState, phase: 'gameOver' }); setAnimating(false); return;
    }

    // ══ OPPONENT END OF TURN ══
    await sleep(TIMING.PHASE_TRANSITION); // 600ms
    currentState = processEndOfTurn(currentState);
    setGame(currentState);
    await sleep(TIMING.HP_BAR); // 400ms - burn damage HP bar
    if (currentState.winner) {
      currentState.winner === 'player' ? sfxVictory() : sfxDefeat();
      setGame({ ...currentState, phase: 'gameOver' }); setAnimating(false); return;
    }

    // ══ YOUR TURN - START ══
    currentState = startTurn(currentState);
    setGame(currentState);
    sfxTurnStart();
    await sleep(TIMING.HAND_CARD); // 391ms - drawn card enters hand
    addLog(["[Your Turn]"]);
    setAnimating(false);
  }, [game, animating, addLog, animateCombatEvents, gameMode]);

  const handleNewGame = useCallback(() => {
    aiAutoPlayRef.current = false;
    setGameMode('menu');
    setGame(null);
    setEventLog([]);
    setAiThinking('');
    setAiThinking2('');
  }, []);

  // ============================================================================
  // Menu Screen
  // ============================================================================
  if (gameMode === 'menu') {
    return (
      <div className="w-full h-screen bg-background overflow-hidden relative flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={castleObsidianVeil} alt="bg" className="w-full h-full object-cover" style={{ opacity: 0.15 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>
        <AmbientParticles />

        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1
            className="font-display text-5xl md:text-7xl mb-2"
            style={{
              color: 'hsl(0 0% 80%)',
              textShadow: '0 0 40px hsl(0 0% 40% / 0.3)',
            }}
            animate={{ textShadow: ['0 0 40px hsl(0 0% 40% / 0.3)', '0 0 60px hsl(0 0% 50% / 0.4)', '0 0 40px hsl(0 0% 40% / 0.3)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            THE SHATTERED DOMINION
          </motion.h1>
          <p className="font-body text-sm text-muted-foreground mb-12 tracking-widest">
            CHOOSE YOUR BATTLE MODE
          </p>

          <div className="flex flex-col gap-4 items-center">
            {/* Player vs AI */}
            <motion.button
              className="font-display text-sm px-10 py-4 rounded-lg w-72"
              style={{
                background: 'linear-gradient(135deg, hsl(0 0% 12%), hsl(0 0% 6%))',
                border: '1px solid hsl(0 0% 20%)',
                color: 'hsl(0 0% 70%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
              onClick={() => startGame('pvai')}
              whileHover={{
                scale: 1.05,
                borderColor: 'hsl(0 0% 35%)',
                boxShadow: '0 0 30px hsl(0 0% 30% / 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              CONQUEST
              <p className="font-body text-[10px] text-muted-foreground mt-1 tracking-normal">Challenge the realm</p>
            </motion.button>

            {/* War of Minds */}
            <motion.button
              className="font-display text-sm px-10 py-4 rounded-lg w-72"
              style={{
                background: 'linear-gradient(135deg, hsl(160 40% 12%), hsl(160 30% 5%))',
                border: '1px solid hsl(160 40% 22%)',
                color: 'hsl(160 50% 70%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
              onClick={() => startGame('gpt-vs-r1')}
              whileHover={{
                scale: 1.05,
                borderColor: 'hsl(160 50% 38%)',
                boxShadow: '0 0 30px hsl(160 50% 30% / 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              WAR OF MINDS
              <p className="font-body text-[10px] text-muted-foreground mt-1 tracking-normal">Two generals clash. Spectate the carnage.</p>
            </motion.button>

            {/* Back to Home */}
            <motion.button
              className="font-display text-[11px] px-5 py-2 mt-4 rounded-lg"
              style={{
                border: '1px solid hsl(0 0% 15%)',
                color: 'hsl(0 0% 40%)',
                background: 'transparent',
              }}
              onClick={() => { stopMusic(); window.location.href = '/'; }}
              whileHover={{ scale: 1.05, color: 'hsl(0 0% 60%)' }}
            >
              ← BACK TO HOME
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!game) return null;

  const isAIMode = gameMode === 'gpt-vs-r1';

  const slotW = isMobile ? 66 : 170;
  const slotH = isMobile ? 92 : 236;

  const renderField = (side: Side) => {
    const p = side === 'player' ? game.player : game.opponent;
    const isOpp = side === 'opponent';

    return (
      <div className={`flex items-center justify-center ${isMobile ? 'gap-0.5' : 'gap-2'}`}>
        {p.field.map((card, i) => {
          const slotKey = `${side}-${i}`;
          const isAttacking = attackingSlots.has(slotKey);
          const dmg = damagedSlots.get(slotKey);

          return (
            <div
              key={i}
              className="relative"
              style={{ width: slotW, height: slotH }}
              data-slot={`${side}-${i}`}
              onClick={() => !isOpp && !isAIMode && handleSlotClick(i)}
            >
              <AnimatePresence mode="popLayout">
                {card ? (
                  <BattleCard
                    key={card.instanceId}
                    card={card}
                    isAttacking={isAttacking}
                    isTakingDamage={dmg !== undefined}
                    damageValue={dmg}
                    isOpponent={isOpp}
                    showActive={!isAIMode && !isOpp && !animating && game.phase === 'playing' && ACTIVE_ABILITY_CARDS.includes(card.id) && !card.activeUsed}
                    onActivate={() => handleUseActive(card.instanceId)}
                    onHoverStart={isMobile ? undefined : () => setHoveredCard(card)}
                    onHoverEnd={isMobile ? undefined : () => setHoveredCard(null)}
                  />
                ) : (
                  <motion.div
                    key={`empty-${i}`}
                    className="w-full h-full rounded-xl flex items-center justify-center"
                    style={{
                      border: !isAIMode && !isOpp && game.selectedHandIndex !== null
                        ? '1.5px dashed hsl(0 0% 28%)'
                        : '1px dashed hsl(0 0% 12%)',
                      background: !isAIMode && !isOpp && game.selectedHandIndex !== null
                        ? 'hsl(0 0% 6% / 0.4)'
                        : 'transparent',
                      boxShadow: !isAIMode && !isOpp && game.selectedHandIndex !== null
                        ? '0 0 24px hsl(0 0% 20% / 0.1), inset 0 0 20px hsl(0 0% 20% / 0.05)'
                        : 'none',
                    }}
                    animate={!isAIMode && !isOpp && game.selectedHandIndex !== null ? {
                      borderColor: ['hsl(0 0% 16%)', 'hsl(0 0% 28%)', 'hsl(0 0% 16%)'],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {!isAIMode && !isOpp && game.selectedHandIndex !== null && (
                      <motion.span
                        className="text-foreground/12 text-xs font-display tracking-[0.25em]"
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        DEPLOY
                      </motion.span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };

  const currentPlayerName = game.activePlayer === 'player' ? p1Name : p2Name;

  return (
    <div className={`w-full h-screen bg-background overflow-hidden relative transition-transform duration-75 ${screenShake ? 'animate-[shake_0.35s_ease-in-out]' : ''} ${mythicShaking ? 'animate-[mythicShake_0.4s_ease-in-out_infinite]' : ''}`}>
      {/* Mythic god cinematic effects */}
      <MythicEffects effect={mythicEffect} onComplete={() => setMythicEffect(null)} />
      {/* Screen flash on damage */}
      <AnimatePresence>
        {screenFlash && (
          <motion.div
            className="absolute inset-0 z-[60] pointer-events-none"
            style={{ background: 'hsl(var(--fire-glow) / 0.12)' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Main layout: [Left Thinking] [Battlefield] [Right Thinking] */}
      <div className="w-full h-full flex relative">
        {/* BG - single image, spans full width */}
        <div className="absolute inset-0 z-0">
          <img src={battlefieldBg} alt="battlefield" className="w-full h-full object-cover" style={{ opacity: 0.45 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,hsl(var(--background))_85%)]" />
        </div>

        {/* ── Left Thinking Panel (GPT) ── */}
        {gameMode === 'gpt-vs-r1' && (
          <ThinkingPanel
            thinking={aiThinking}
            playerName={aiThinkingPlayer}
            isActive={true}
            side="left"
            model="strategic-mind"
            accentHue={160}
          />
        )}

        {/* ── Center Battlefield ── */}
        <div className="flex-1 h-full flex flex-col relative z-[1]">
        <AmbientParticles />
        <CardInfoPanel card={hoveredCard} />
        <AttackProjectiles
          projectiles={activeProjectiles}
          onComplete={handleProjectilesComplete}
        />

        {/* Opponent area */}
        <div className={`relative z-10 flex-1 flex flex-col justify-start ${isMobile ? 'pt-1 px-1' : 'pt-2 px-3'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlayerHUD player={game.opponent} isOpponent label={isAIMode ? p2Name.toUpperCase() : "ENEMY"} />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {isAIMode && (
                <span className="font-display text-[9px] tracking-[0.2em] px-2 py-1 rounded"
                  style={{
                    color: 'hsl(160 50% 55%)',
                    background: 'hsl(160 30% 8%)',
                    border: '1px solid hsl(160 30% 20%)',
                  }}>
                  WAR OF MINDS
                </span>
              )}
              <button
                onClick={handleNewGame}
                className="w-7 h-7 rounded-lg flex items-center justify-center font-display text-[10px]"
                style={{
                  background: 'hsl(0 0% 8% / 0.8)',
                  border: '1px solid hsl(0 0% 18%)',
                  color: 'hsl(0 0% 50%)',
                }}
                title="Back to Menu"
              >
                ✕
              </button>
              {/* Music controls are in the MusicPlayer widget */}
            </div>
          </div>

          {/* Opponent hand (face-down) */}
          <div className="flex justify-center gap-1 mt-1.5 mb-1.5">
            {game.opponent.hand.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-lg relative overflow-hidden"
                style={{
                  width: 32,
                  height: 44,
                  background: 'linear-gradient(180deg, hsl(0 0% 10%), hsl(0 0% 4%))',
                  border: '1px solid hsl(0 0% 14%)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                }}
                initial={{ y: -25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
              >
                <div className="absolute inset-0.5 rounded-sm" style={{ border: '1px solid hsl(0 0% 12%)', background: 'hsl(0 0% 6%)' }}>
                  <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, hsl(0 0% 14%) 2px, hsl(0 0% 14%) 3px)' }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Opponent field */}
          <div className="flex justify-center">
            {renderField('opponent')}
          </div>
        </div>

        {/* Center zone - turn indicator + battle log side by side */}
        <div className="relative z-10 flex items-center py-1" style={{ overflow: 'visible' }}>
          {/* Battle log - left side, inline in the flow */}
          <div className="flex-1 flex items-center">
            <BattleLog eventLog={eventLog} />
          </div>

          {/* Turn indicator - centered */}
          <motion.div
            className="shrink-0 mx-3 font-display text-[11px] tracking-[0.4em] text-muted-foreground px-3 py-0.5 rounded"
            style={{ background: 'hsl(0 0% 5% / 0.8)', border: '1px solid hsl(0 0% 12%)' }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            TURN {game.turn}{isAIMode ? ` - ${currentPlayerName}` : ''}
          </motion.div>

          {/* Right side - music player */}
          <div className="flex-1 flex justify-end items-center" style={{ overflow: 'visible' }}>
            <MusicPlayer active={!!game && !game.winner} />
          </div>
        </div>

        {/* Player area */}
        <div className={`relative z-10 flex-1 flex flex-col justify-end ${isMobile ? 'pb-1 px-1' : 'pb-2 px-3'}`}>
          {/* Player field */}
          <div className="flex justify-center">
            {renderField('player')}
          </div>

          {/* Player HUD + End Turn */}
          <div className={`flex items-center justify-between ${isMobile ? 'mt-1' : 'mt-2'}`}>
            <PlayerHUD player={game.player} label={isAIMode ? p1Name.toUpperCase() : "YOU"} />
            {!isAIMode && (
            <motion.button
              className={`font-display ${isMobile ? 'text-xs px-4 py-2' : 'text-sm px-6 py-2.5'} rounded-lg disabled:opacity-30`}
              style={{
                background: animating
                  ? 'linear-gradient(135deg, hsl(0 0% 12%), hsl(0 0% 8%))'
                  : 'linear-gradient(135deg, hsl(var(--fire) / 0.9), hsl(var(--fire-glow) / 0.7))',
                color: 'hsl(var(--foreground))',
                boxShadow: animating ? 'none' : '0 0 25px hsl(var(--fire-glow) / 0.25), 0 4px 12px rgba(0,0,0,0.4)',
                border: '1px solid hsl(var(--fire-glow) / 0.3)',
              }}
              onClick={handleEndTurn}
              disabled={animating || game.phase !== 'playing'}
              whileHover={{ scale: 1.06, boxShadow: '0 0 35px hsl(var(--fire-glow) / 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              {animating ? 'BATTLE...' : 'END TURN'}
            </motion.button>
            )}
            {isAIMode && (
              <motion.div
                className="font-display text-[11px] tracking-[0.2em] px-4 py-2 rounded-lg"
                style={{
                  background: 'hsl(0 0% 6% / 0.8)',
                  border: '1px solid hsl(0 0% 15%)',
                  color: animating ? 'hsl(270 40% 60%)' : 'hsl(0 0% 40%)',
                }}
                animate={animating ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {animating ? 'BATTLING...' : 'WATCHING'}
              </motion.div>
            )}
          </div>

          {/* Player hand */}
          <div className={`flex justify-center ${isMobile ? 'gap-1' : 'gap-1.5'} mt-2 pb-1 overflow-x-auto`}>
            <AnimatePresence>
              {game.player.hand.map((card, i) => (
                <HandCard
                  key={card.instanceId}
                  card={card}
                  index={i}
                  isSelected={game.selectedHandIndex === i}
                  canAfford={card.cost <= game.player.energy}
                  onClick={() => !isAIMode && handleSelectHand(i)}
                  onHoverStart={isMobile ? undefined : () => setHoveredCard(card)}
                  onHoverEnd={isMobile ? undefined : () => setHoveredCard(null)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Game over */}
        <AnimatePresence>
          {game.phase === 'gameOver' && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center"
              style={{ background: 'hsl(0 0% 2% / 0.88)', backdropFilter: 'blur(10px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.2, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
              >
                <motion.h2
                  className="font-display text-5xl md:text-7xl mb-4"
                  style={{
                    color: 'hsl(0 0% 80%)',
                    textShadow: '0 0 60px hsl(0 0% 50% / 0.4)',
                  }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isAIMode
                    ? (game.winner === 'player' ? `${p1Name} WINS` : `${p2Name} WINS`)
                    : (game.winner === 'player' ? 'VICTORY' : 'DEFEAT')
                  }
                </motion.h2>
                <p className="text-muted-foreground mb-8 font-body text-sm">
                  {isAIMode
                    ? `${game.winner === 'player' ? p1Name : p2Name} has conquered the Shattered Dominion.`
                    : (game.winner === 'player' ? 'The dominion falls before you.' : 'Your realm has been shattered.')
                  }
                </p>
                <p className="font-display text-xs text-muted-foreground mb-6" style={{ color: 'hsl(0 0% 35%)' }}>
                  {gameCountRef.current > 0 && `Game #${gameCountRef.current} | `}Final: {p1Name}: {game.player.hp} HP | {p2Name}: {game.opponent.hp} HP | Turn {game.turn}
                </p>
                {autoRestartRef.current && isAIMode && (
                  <p className="font-body text-[10px] text-muted-foreground mb-4" style={{ color: 'hsl(120 40% 45%)' }}>
                    Auto-restarting next game in 5 seconds...
                  </p>
                )}

                {showEndLog && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-8 max-h-48 overflow-y-auto w-96 mx-auto bg-background/60 backdrop-blur-sm border border-foreground/10 p-3 text-left"
                  >
                    <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Battle Log</p>
                    {eventLog.map((entry, i) => (
                      <p key={i} className="text-foreground/50 text-[11px] font-body leading-relaxed border-b border-foreground/5 py-1 last:border-0">
                        {entry}
                      </p>
                    ))}
                  </motion.div>
                )}

                <div className="flex items-center gap-3 justify-center">
                  <motion.button
                    className="font-display text-sm px-10 py-3.5 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--foreground)), hsl(0 0% 70%))',
                      color: 'hsl(var(--background))',
                      boxShadow: '0 0 30px hsl(var(--foreground) / 0.2)',
                    }}
                    onClick={handleNewGame}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    PLAY AGAIN
                  </motion.button>
                  <motion.button
                    className="font-display text-[11px] px-5 py-3 rounded-lg border border-foreground/15 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-colors"
                    onClick={() => setShowEndLog(prev => !prev)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showEndLog ? 'HIDE LOG' : 'BATTLE LOG'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Music player is now inline in the center zone above */}
      </div>
      {/* ── End Center Battlefield ── */}

        {/* ── Right Thinking Panel (War of Minds) ── */}
        {gameMode === 'gpt-vs-r1' && (
          <ThinkingPanel
            thinking={gameMode === 'gpt-vs-r1' ? aiThinking2 : aiThinking}
            playerName={gameMode === 'gpt-vs-r1' ? aiThinkingPlayer2 : aiThinkingPlayer}
            isActive={true}
            side="right"
            model="war-council"
            accentHue={270}
          />
        )}
      </div>
    </div>
  );
};

export default Battlefield;
