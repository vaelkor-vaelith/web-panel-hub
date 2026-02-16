import { motion, AnimatePresence } from "framer-motion";
import type { CardInstance } from "@/game/types";
import { getCardImage } from "@/game/cardImages";

const tribeAccent: Record<string, string> = {
  'Obsidian Veil': '270 40% 50%',
  'Radiant Sanctum': '45 50% 60%',
  'Emberheart Pact': '10 55% 50%',
  'Ironroot Bastion': '140 35% 42%',
  'Tribeless': '0 55% 45%',
};

interface CardInfoPanelProps {
  card: CardInstance | null;
}

const CardInfoPanel = ({ card }: CardInfoPanelProps) => {
  const accent = card ? (tribeAccent[card.tribe] || '0 0% 50%') : '0 0% 50%';
  const image = card ? getCardImage(card.name) : null;

  return (
    <AnimatePresence mode="wait">
      {card && (
        <>
          {/* Dark vignette backdrop */}
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, hsl(0 0% 0% / 0.7) 70%)',
            }}
          />

          {/* Centered card info */}
          <motion.div
            key={card.instanceId}
            className="fixed left-1/2 top-1/2 z-50 pointer-events-none flex gap-4 items-start"
            style={{ transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Card art */}
            <div
              className="w-44 aspect-[3/4] rounded-xl overflow-hidden relative shrink-0"
              style={{
                border: `1px solid hsl(${accent} / 0.3)`,
                boxShadow: `0 0 60px hsl(${accent} / 0.12), 0 20px 60px rgba(0,0,0,0.8)`,
              }}
            >
              {image && (
                <img src={image} alt={card.name} className="w-full h-full object-cover object-top" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Stats overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                <div
                  className="font-display text-lg px-2 py-0.5 rounded"
                  style={{
                    color: 'hsl(var(--fire-glow))',
                    textShadow: '0 0 12px hsl(var(--fire-glow) / 0.8)',
                    background: 'hsl(0 0% 0% / 0.6)',
                  }}
                >
                  ATK {card.currentAtk}
                </div>
                <div
                  className="font-display text-sm px-2 py-0.5 rounded"
                  style={{ color: 'hsl(220 80% 75%)', background: 'hsl(0 0% 0% / 0.6)' }}
                >
                  ◆ {card.cost}
                </div>
                <div
                  className="font-display text-lg px-2 py-0.5 rounded"
                  style={{
                    color: 'hsl(var(--earth-glow))',
                    textShadow: '0 0 12px hsl(var(--earth-glow) / 0.8)',
                    background: 'hsl(0 0% 0% / 0.6)',
                  }}
                >
                  ♥ {card.currentHp}/{card.maxHp}
                </div>
              </div>
            </div>

            {/* Text info */}
            <div className="max-w-[220px] pt-1 px-4 py-3 rounded-xl" style={{ background: 'hsl(0 0% 3% / 0.85)', backdropFilter: 'blur(8px)', border: '1px solid hsl(0 0% 10%)' }}>
              <p className="font-display text-lg text-foreground leading-tight drop-shadow-lg">
                {card.name}
              </p>
              <p className="text-[11px] font-body mt-0.5" style={{ color: 'hsl(0 0% 45%)' }}>
                {card.title}
              </p>

              <div className="h-px my-2.5" style={{ background: `linear-gradient(90deg, hsl(${accent} / 0.4), transparent)` }} />

              <p className="text-sm font-display" style={{ color: `hsl(${accent})` }}>
                {card.abilityName}
              </p>
              <p className="text-[10px] font-body mt-0.5 uppercase tracking-wider" style={{ color: 'hsl(0 0% 38%)' }}>
                {card.abilityType}
              </p>
              <p className="text-xs font-body leading-relaxed mt-1.5" style={{ color: 'hsl(0 0% 60%)' }}>
                {card.abilityDesc}
              </p>

              {card.shield > 0 && (
                <p className="text-[11px] font-display mt-2.5" style={{ color: 'hsl(45 70% 60%)' }}>
                  SHIELD: {card.shield}
                </p>
              )}

              {card.statusEffects.length > 0 && (
                <div className="flex gap-2 mt-2.5 flex-wrap">
                  {card.statusEffects.map((e, i) => (
                    <span key={i} className="text-[9px] font-display uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: 'hsl(0 0% 50%)', background: 'hsl(0 0% 8%)' }}>
                      {e.type} ({e.duration})
                    </span>
                  ))}
                </div>
              )}

              {card.quote && (
                <>
                  <div className="h-px my-2.5" style={{ background: 'hsl(0 0% 12%)' }} />
                  <p className="text-[11px] font-body italic leading-relaxed" style={{ color: 'hsl(0 0% 32%)' }}>
                    "{card.quote}"
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CardInfoPanel;
