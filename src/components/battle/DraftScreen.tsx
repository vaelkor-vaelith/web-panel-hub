import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CardData } from '@/data/gameData';
import { getCardImage } from '@/game/cardImages';
import {
  createInitialDraft, getCurrentStep, executeDraftAction,
  smartDraftPick, ROUND_NAMES,
  type DraftState,
} from '@/game/draftEngine';
import { draftWithGPT, draftWithDeepSeek } from '@/game/aiDraft';
import ThinkingPanel from './ThinkingPanel';
import AmbientParticles from './AmbientParticles';
import castleObsidianVeil from '@/assets/castle-obsidian-veil.jpg';

const TRIBE_CONFIG: Record<string, { hue: number; label: string }> = {
  'Obsidian Veil': { hue: 270, label: 'SHADOW' },
  'Radiant Sanctum': { hue: 40, label: 'LIGHT' },
  'Emberheart Pact': { hue: 15, label: 'FIRE' },
  'Ironroot Bastion': { hue: 140, label: 'EARTH' },
  'Tribeless': { hue: 0, label: 'MYTHIC' },
};

const RARITY_BORDER: Record<string, string> = {
  mythic: 'hsl(280 60% 50%)',
  legendary: 'hsl(40 80% 55%)',
  epic: 'hsl(270 50% 50%)',
  rare: 'hsl(210 60% 50%)',
  common: 'hsl(0 0% 30%)',
};

const TRIBE_ORDER = ['Obsidian Veil', 'Radiant Sanctum', 'Emberheart Pact', 'Ironroot Bastion', 'Tribeless'];

interface DraftScreenProps {
  mode: 'pvai' | 'aivai';
  p1Name: string;
  p2Name: string;
  onComplete: (p1Deck: CardData[], p2Deck: CardData[]) => void;
  onCancel: () => void;
}

export default function DraftScreen({ mode, p1Name, p2Name, onComplete, onCancel }: DraftScreenProps) {
  const [draft, setDraft] = useState<DraftState>(createInitialDraft);
  const [aiThinking1, setAiThinking1] = useState('');
  const [aiThinking2, setAiThinking2] = useState('');
  const [processingAI, setProcessingAI] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<CardData | null>(null);
  const [recentCardId, setRecentCardId] = useState<string | null>(null);
  const processingRef = useRef(false);

  const step = getCurrentStep(draft);

  // Draft completion → transition to battle
  useEffect(() => {
    if (draft.complete) {
      const timer = setTimeout(() => onComplete(draft.p1Picks, draft.p2Picks), 2000);
      return () => clearTimeout(timer);
    }
  }, [draft.complete, draft.p1Picks, draft.p2Picks, onComplete]);

  // AI turn automation
  useEffect(() => {
    const currentStep = getCurrentStep(draft);
    if (draft.complete || !currentStep || processingRef.current) return;

    const isAITurn = mode === 'aivai' || (mode === 'pvai' && currentStep.player === 'p2');
    if (!isAITurn) return;

    processingRef.current = true;
    setProcessingAI(true);

    const runAI = async () => {
      await new Promise(r => setTimeout(r, 800));

      let cardId: string;
      if (mode === 'aivai') {
        if (currentStep.player === 'p1') {
          setAiThinking1('Analyzing draft options...\n');
          cardId = await draftWithGPT(draft, 'p1', p1Name, (t) => setAiThinking1(t));
        } else {
          setAiThinking2('Analyzing draft options...\n');
          cardId = await draftWithDeepSeek(draft, 'p2', p2Name, (t) => setAiThinking2(t));
        }
      } else {
        setAiThinking2('Analyzing draft options...\n');
        cardId = await draftWithGPT(draft, 'p2', p2Name, (t) => setAiThinking2(t));
      }

      // Highlight card briefly
      setRecentCardId(cardId);
      await new Promise(r => setTimeout(r, 600));

      setDraft(prev => executeDraftAction(prev, cardId));
      setTimeout(() => setRecentCardId(null), 300);
      processingRef.current = false;
      setProcessingAI(false);
    };

    runAI();
  }, [draft, mode, p1Name, p2Name]);

  // Player card click
  const handleCardClick = useCallback((card: CardData) => {
    const currentStep = getCurrentStep(draft);
    if (draft.complete || !currentStep || processingAI) return;
    if (mode === 'aivai') return;
    if (currentStep.player !== 'p1') return;
    setDraft(prev => executeDraftAction(prev, card.id));
  }, [draft, processingAI, mode]);

  // Group pool by tribe
  const poolByTribe: Record<string, CardData[]> = {};
  for (const card of draft.pool) {
    if (!poolByTribe[card.tribe]) poolByTribe[card.tribe] = [];
    poolByTribe[card.tribe].push(card);
  }
  for (const tribe of Object.keys(poolByTribe)) {
    poolByTribe[tribe].sort((a, b) => a.cost - b.cost);
  }

  const isPlayerTurn = step && !processingAI && step.player === 'p1' && mode !== 'aivai';

  return (
    <div className="w-full h-screen bg-background overflow-hidden relative flex">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={castleObsidianVeil} alt="bg" className="w-full h-full object-cover" style={{ opacity: 0.08 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70" />
      </div>
      <AmbientParticles />

      {/* Left Thinking Panel (P1 / GPT in AI vs AI) */}
      {mode === 'aivai' && (
        <ThinkingPanel
          thinking={aiThinking1}
          playerName={p1Name}
          isActive={true}
          side="left"
          model="draft-strategist"
          accentHue={160}
        />
      )}

      {/* Center Draft Area */}
      <div className="flex-1 h-full flex flex-col relative z-10 overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-1">
          <div className="flex items-center gap-3">
            <span className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">CAPTAIN MODE</span>
            {step && (
              <span
                className="font-display text-[10px] tracking-[0.15em] px-2 py-0.5 rounded"
                style={{
                  background: step.phase === 'ban' ? 'hsl(0 40% 12%)' : 'hsl(210 40% 12%)',
                  color: step.phase === 'ban' ? 'hsl(0 60% 55%)' : 'hsl(210 60% 60%)',
                  border: `1px solid ${step.phase === 'ban' ? 'hsl(0 40% 22%)' : 'hsl(210 40% 22%)'}`,
                }}
              >
                ROUND {step.round} — {ROUND_NAMES[step.round - 1]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {step && (
              <span className="font-mono text-[9px] text-muted-foreground">Step {step.step}/36</span>
            )}
            <button
              onClick={onCancel}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px]"
              style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)', color: 'hsl(0 0% 50%)' }}
            >✕</button>
          </div>
        </div>

        {/* Current Action Banner */}
        <div className="shrink-0 flex items-center justify-center py-1">
          {draft.complete ? (
            <motion.div
              className="font-display text-lg tracking-[0.3em]"
              style={{ color: 'hsl(40 60% 60%)', textShadow: '0 0 30px hsl(40 60% 40% / 0.4)' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              DRAFT COMPLETE — ENTERING BATTLE
            </motion.div>
          ) : step ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="font-display text-sm tracking-[0.2em]"
                style={{ color: isPlayerTurn ? 'hsl(40 60% 65%)' : 'hsl(0 0% 50%)' }}
                key={step.step}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {step.player === 'p1' ? p1Name : p2Name} — {step.phase === 'ban' ? 'BAN' : 'PICK'}
              </motion.div>
              {isPlayerTurn && (
                <motion.span
                  className="text-[8px] font-mono px-2 py-0.5 rounded"
                  style={{ background: 'hsl(40 40% 12%)', color: 'hsl(40 60% 55%)', border: '1px solid hsl(40 40% 22%)' }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {step.phase === 'ban' ? 'CLICK TO BAN' : 'CLICK TO PICK'}
                </motion.span>
              )}
              {processingAI && (
                <motion.span
                  className="text-[8px] font-mono px-2 py-0.5 rounded"
                  style={{ background: 'hsl(270 30% 10%)', color: 'hsl(270 40% 55%)', border: '1px solid hsl(270 30% 20%)' }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >THINKING</motion.span>
              )}
            </div>
          ) : null}
        </div>

        {/* Card Pool Grid + Picks */}
        <div className="flex-1 flex flex-col overflow-hidden px-2 gap-1.5">
          {/* Card Pool */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            <div className="flex gap-1.5 justify-center">
              {TRIBE_ORDER.map(tribe => {
                const cards = poolByTribe[tribe] || [];
                const cfg = TRIBE_CONFIG[tribe];
                return (
                  <div key={tribe} className="flex flex-col gap-0.5" style={{ minWidth: tribe === 'Tribeless' ? 100 : 130, maxWidth: 160, flex: tribe === 'Tribeless' ? '0 0 100px' : '1 1 140px' }}>
                    <div
                      className="text-[7px] font-display tracking-[0.2em] text-center py-0.5 rounded-t"
                      style={{ color: `hsl(${cfg.hue} 40% 50%)`, background: `hsl(${cfg.hue} 20% 6%)` }}
                    >
                      {cfg.label} ({cards.length})
                    </div>
                    <AnimatePresence>
                      {cards.map(card => {
                        const img = getCardImage(card.name);
                        const isRecent = recentCardId === card.id;
                        const rarityColor = RARITY_BORDER[card.rarity] || RARITY_BORDER.common;
                        return (
                          <motion.div
                            key={card.id}
                            className="relative rounded cursor-pointer overflow-hidden"
                            style={{
                              height: 44,
                              border: `1px solid ${isRecent ? (step?.phase === 'ban' ? 'hsl(0 60% 50%)' : 'hsl(40 60% 50%)') : `hsl(${cfg.hue} 15% 15%)`}`,
                              background: isRecent
                                ? (step?.phase === 'ban' ? 'hsl(0 30% 10%)' : 'hsl(40 30% 10%)')
                                : `hsl(${cfg.hue} 8% 5%)`,
                              opacity: isPlayerTurn ? 1 : 0.65,
                            }}
                            onClick={() => handleCardClick(card)}
                            whileHover={isPlayerTurn ? {
                              scale: 1.03,
                              borderColor: step?.phase === 'ban' ? 'hsl(0 50% 45%)' : `hsl(${cfg.hue} 40% 40%)`,
                              transition: { duration: 0.1 },
                            } : {}}
                            onHoverStart={() => setHoveredCard(card)}
                            onHoverEnd={() => setHoveredCard(null)}
                            layout
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                          >
                            {img && (
                              <div className="absolute inset-0" style={{
                                backgroundImage: `url(${img})`, backgroundSize: 'cover',
                                backgroundPosition: 'center top', opacity: 0.15,
                              }} />
                            )}
                            <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, hsl(${cfg.hue} 8% 5% / 0.8), transparent)` }} />
                            <div className="relative flex items-center h-full px-1.5 gap-1">
                              <div
                                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-display shrink-0"
                                style={{ background: 'hsl(210 25% 10%)', border: '1px solid hsl(210 25% 22%)', color: 'hsl(210 50% 65%)' }}
                              >{card.cost}</div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[8px] font-display truncate" style={{ color: rarityColor }}>{card.name}</div>
                                <div className="text-[6px] font-mono text-muted-foreground/60 truncate">{card.abilityName}</div>
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0">
                                <span className="text-[8px] font-mono" style={{ color: 'hsl(0 50% 50%)' }}>{card.atk}</span>
                                <span className="text-[6px] text-muted-foreground/40">/</span>
                                <span className="text-[8px] font-mono" style={{ color: 'hsl(120 35% 45%)' }}>{card.hp}</span>
                              </div>
                            </div>
                            <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: rarityColor }} />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {cards.length === 0 && (
                      <div className="text-[7px] text-muted-foreground/20 text-center py-3 font-mono">All drafted</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom: Picks + Bans */}
          <div className="shrink-0 flex items-start gap-3 pb-2 pt-1" style={{ borderTop: '1px solid hsl(0 0% 8%)' }}>
            {/* P1 Picks */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] font-display tracking-[0.15em]" style={{ color: 'hsl(160 50% 50%)' }}>
                  {p1Name.toUpperCase()} ({draft.p1Picks.length}/15)
                </span>
              </div>
              <div className="flex flex-wrap gap-0.5">
                {draft.p1Picks.map(card => {
                  const cfg = TRIBE_CONFIG[card.tribe] || TRIBE_CONFIG['Tribeless'];
                  return (
                    <motion.div
                      key={card.id}
                      className="rounded px-1 py-0.5"
                      style={{ background: `hsl(${cfg.hue} 12% 8%)`, border: `1px solid hsl(${cfg.hue} 20% 20%)` }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      onHoverStart={() => setHoveredCard(card)}
                      onHoverEnd={() => setHoveredCard(null)}
                    >
                      <span className="text-[7px] font-mono" style={{ color: `hsl(${cfg.hue} 25% 50%)` }}>
                        {card.name.split(' ')[0]}
                      </span>
                      <span className="text-[6px] font-mono text-muted-foreground/40 ml-0.5">{card.cost}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Banned */}
            <div className="shrink-0 text-center">
              <span className="text-[8px] font-display tracking-[0.15em]" style={{ color: 'hsl(0 35% 40%)' }}>
                BANNED ({draft.banned.length})
              </span>
              <div className="flex gap-0.5 mt-1 justify-center">
                {draft.banned.map(card => (
                  <motion.div
                    key={card.id}
                    className="rounded px-1 py-0.5"
                    style={{ background: 'hsl(0 15% 7%)', border: '1px solid hsl(0 25% 18%)' }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    onHoverStart={() => setHoveredCard(card)}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    <span className="text-[7px] font-mono line-through" style={{ color: 'hsl(0 35% 40%)' }}>
                      {card.name.split(' ')[0]}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* P2 Picks */}
            <div className="flex-1 min-w-0 text-right">
              <div className="flex items-center gap-2 mb-1 justify-end">
                <span className="text-[8px] font-display tracking-[0.15em]" style={{ color: 'hsl(270 35% 50%)' }}>
                  {p2Name.toUpperCase()} ({draft.p2Picks.length}/15)
                </span>
              </div>
              <div className="flex flex-wrap gap-0.5 justify-end">
                {draft.p2Picks.map(card => {
                  const cfg = TRIBE_CONFIG[card.tribe] || TRIBE_CONFIG['Tribeless'];
                  return (
                    <motion.div
                      key={card.id}
                      className="rounded px-1 py-0.5"
                      style={{ background: `hsl(${cfg.hue} 12% 8%)`, border: `1px solid hsl(${cfg.hue} 20% 20%)` }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      onHoverStart={() => setHoveredCard(card)}
                      onHoverEnd={() => setHoveredCard(null)}
                    >
                      <span className="text-[7px] font-mono" style={{ color: `hsl(${cfg.hue} 25% 50%)` }}>
                        {card.name.split(' ')[0]}
                      </span>
                      <span className="text-[6px] font-mono text-muted-foreground/40 ml-0.5">{card.cost}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredCard && (
            <motion.div
              className="absolute z-50 rounded-lg overflow-hidden pointer-events-none"
              style={{
                width: 210, left: '50%', top: '18%', transform: 'translateX(-50%)',
                background: 'hsl(0 0% 4% / 0.95)', border: `1px solid ${RARITY_BORDER[hoveredCard.rarity]}`,
                backdropFilter: 'blur(12px)', boxShadow: '0 10px 40px rgba(0,0,0,0.9)',
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.12 }}
            >
              {getCardImage(hoveredCard.name) && (
                <div className="h-28 overflow-hidden">
                  <img src={getCardImage(hoveredCard.name)} alt={hoveredCard.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-2">
                <div className="font-display text-[10px] mb-0.5" style={{ color: RARITY_BORDER[hoveredCard.rarity] }}>{hoveredCard.name}</div>
                <div className="text-[7px] text-muted-foreground/60 mb-1 italic">{hoveredCard.title}</div>
                <div className="flex items-center gap-2 mb-1 text-[8px] font-mono">
                  <span style={{ color: 'hsl(210 60% 60%)' }}>Cost {hoveredCard.cost}</span>
                  <span style={{ color: 'hsl(0 50% 50%)' }}>ATK {hoveredCard.atk}</span>
                  <span style={{ color: 'hsl(120 35% 45%)' }}>HP {hoveredCard.hp}</span>
                </div>
                <div className="text-[7px] font-display tracking-wider mb-0.5" style={{ color: `hsl(${TRIBE_CONFIG[hoveredCard.tribe]?.hue || 0} 35% 55%)` }}>
                  {hoveredCard.abilityName}
                </div>
                <div className="text-[7px] text-muted-foreground/70 leading-relaxed">{hoveredCard.abilityDesc}</div>
                {hoveredCard.quote && (
                  <div className="text-[6px] text-muted-foreground/30 italic mt-1 border-t border-foreground/5 pt-1">"{hoveredCard.quote}"</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Thinking Panel (P2 / AI) */}
      <ThinkingPanel
        thinking={aiThinking2}
        playerName={p2Name}
        isActive={true}
        side="right"
        model="draft-strategist"
        accentHue={270}
      />
    </div>
  );
}
