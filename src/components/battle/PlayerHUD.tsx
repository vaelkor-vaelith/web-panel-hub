import { motion, AnimatePresence } from "framer-motion";
import { Skull, Layers, Hand, Zap, Heart } from "lucide-react";
import type { PlayerState } from "@/game/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface PlayerHUDProps {
  player: PlayerState;
  isOpponent?: boolean;
  label: string;
}

const PlayerHUD = ({ player, isOpponent, label }: PlayerHUDProps) => {
  const isMobile = useIsMobile();
  const hpPercent = Math.max(0, (player.hp / 20) * 100);
  const isLow = hpPercent <= 25;
  const isCritical = hpPercent <= 10;
  const fieldCount = player.field.filter(Boolean).length;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: isOpponent ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(0 0% 5% / 0.92), hsl(0 0% 2% / 0.95))',
          border: '1px solid hsl(0 0% 10%)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 hsl(0 0% 12% / 0.3)',
          minWidth: isMobile ? 180 : 280,
        }}
      >
        {/* Top accent - monochrome */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(0 0% 25% / 0.5), transparent)',
          }}
        />

        <div className={isMobile ? 'px-2 py-1.5' : 'px-3 py-2.5'}>
          {/* Row 1: Label + HP */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: isOpponent ? 'hsl(0 0% 35%)' : 'hsl(0 0% 50%)',
                  boxShadow: isOpponent
                    ? '0 0 6px hsl(0 0% 30% / 0.4)'
                    : '0 0 6px hsl(0 0% 45% / 0.4)',
                }}
              />
              <span
                className="font-display text-[10px] tracking-[0.35em]"
                style={{ color: 'hsl(0 0% 32%)' }}
              >
                {label}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Heart
                size={11}
                strokeWidth={1.5}
                style={{
                  color: isCritical ? 'hsl(0 0% 45%)' : 'hsl(0 0% 28%)',
                  fill: isCritical ? 'hsl(0 0% 35% / 0.3)' : 'none',
                }}
              />
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={player.hp}
                  className="font-display text-lg tabular-nums"
                  style={{
                    color: isCritical
                      ? 'hsl(0 0% 55%)'
                      : isLow
                      ? 'hsl(0 0% 45%)'
                      : 'hsl(0 0% 58%)',
                    textShadow: isCritical ? '0 0 10px hsl(0 0% 40% / 0.4)' : 'none',
                  }}
                  initial={{ scale: 1.4, y: -4 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  {player.hp}
                </motion.span>
              </AnimatePresence>
              <span className="font-body text-[9px]" style={{ color: 'hsl(0 0% 18%)' }}>/20</span>
            </div>
          </div>

          {/* Row 2: HP Bar - monochrome */}
          <div className="relative mb-2.5" style={{ height: 6 }}>
            <div
              className="w-full h-full rounded-sm overflow-hidden relative"
              style={{
                background: 'hsl(0 0% 4%)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)',
                border: '1px solid hsl(0 0% 7%)',
              }}
            >
              {[20, 40, 60, 80].map(pct => (
                <div
                  key={pct}
                  className="absolute top-0 bottom-0 w-px z-10"
                  style={{ left: `${pct}%`, background: 'hsl(0 0% 8%)' }}
                />
              ))}

              <motion.div
                className="h-full relative overflow-hidden rounded-sm"
                style={{
                  background: isCritical
                    ? 'linear-gradient(90deg, hsl(0 0% 18%), hsl(0 0% 25%))'
                    : isLow
                    ? 'linear-gradient(90deg, hsl(0 0% 22%), hsl(0 0% 30%))'
                    : 'linear-gradient(90deg, hsl(0 0% 25%), hsl(0 0% 38%), hsl(0 0% 30%))',
                  boxShadow: '0 0 6px hsl(0 0% 20% / 0.2)',
                }}
                animate={{ width: `${hpPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.12) 6px, rgba(0,0,0,0.12) 7px)',
                  }}
                />
              </motion.div>

              {isCritical && (
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-sm"
                  style={{ background: 'hsl(0 0% 30% / 0.1)' }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </div>
          </div>

          {/* Row 3: Energy + Counters */}
          <div className="flex items-center justify-between">
            {/* Energy */}
            <div className="flex items-center gap-1.5">
              <Zap
                size={10}
                strokeWidth={1.6}
                style={{
                  color: player.energy > 0 ? 'hsl(0 0% 42%)' : 'hsl(0 0% 16%)',
                }}
              />
              <div className="flex items-center gap-[3px]">
                {Array.from({ length: Math.min(10, player.maxEnergy) }).map((_, i) => {
                  const filled = i < player.energy;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 10,
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%)',
                        background: filled
                          ? 'linear-gradient(180deg, hsl(0 0% 45%), hsl(0 0% 25%))'
                          : 'hsl(0 0% 6%)',
                        border: `1px solid ${filled ? 'hsl(0 0% 30%)' : 'hsl(0 0% 9%)'}`,
                      }}
                    />
                  );
                })}
              </div>
              <span
                className="font-display text-[9px] tabular-nums ml-0.5"
                style={{ color: player.energy > 0 ? 'hsl(0 0% 38%)' : 'hsl(0 0% 20%)' }}
              >
                {player.energy}/{player.maxEnergy}
              </span>
            </div>

            {/* Counters */}
            <div className="flex items-center gap-3">
              <HUDCounter icon={<Hand size={9} strokeWidth={1.3} />} value={player.hand.length} label="Hand" />
              <HUDCounter icon={<Layers size={9} strokeWidth={1.3} />} value={player.deck.length} label="Deck" />
              <HUDCounter icon={<Zap size={9} strokeWidth={1.3} />} value={fieldCount} label="Field" />
              {player.graveyard.length > 0 && (
                <HUDCounter icon={<Skull size={9} strokeWidth={1.3} />} value={player.graveyard.length} label="Dead" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HUDCounter = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) => (
  <div className="flex items-center gap-[3px] cursor-default" title={label}>
    <span style={{ color: 'hsl(0 0% 24%)', opacity: 0.8 }}>{icon}</span>
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        className="font-display text-[9px] tabular-nums"
        style={{ color: 'hsl(0 0% 28%)' }}
        initial={{ scale: 1.3, y: -2 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

export default PlayerHUD;
