import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

type MythicEffectType = "vaelkor" | "vaelith" | null;

interface MythicEffectsProps {
  effect: MythicEffectType;
  onComplete: () => void;
}

// ═══════════════════════════════════════════
// VAELKOR - DOMINION'S END
// Slow crushing darkness → heartbeat pulses → void implosion → white-hot detonation → shockwaves → fade
// ═══════════════════════════════════════════
const VaelkorEffect = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0); // 0=darken, 1=pulse, 2=implode, 3=detonate, 4=shockwave, 5=fade

  const cracks = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => {
      const cx = 50 + (Math.random() - 0.5) * 20;
      const cy = 50 + (Math.random() - 0.5) * 20;
      const angle = Math.random() * Math.PI * 2;
      const len = 15 + Math.random() * 35;
      return {
        id: i,
        x1: cx, y1: cy,
        x2: cx + Math.cos(angle) * len,
        y2: cy + Math.sin(angle) * len,
        delay: Math.random() * 0.15,
        width: 0.3 + Math.random() * 1.2,
      };
    }),
  []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1200),   // heartbeat pulses
      setTimeout(() => setPhase(2), 2400),   // implode
      setTimeout(() => setPhase(3), 3200),   // detonate
      setTimeout(() => setPhase(4), 3500),   // shockwaves
      setTimeout(() => setPhase(5), 4800),   // fade out
      setTimeout(onComplete, 5600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">

      {/* Phase 0-1: Slow crushing darkness - vignette tightens */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: phase <= 1 ? [0, 0.95] : phase === 3 ? 0 : phase >= 4 ? [0.3, 0] : 0.85,
        }}
        transition={{ duration: phase === 0 ? 1.2 : phase === 3 ? 0.15 : 0.8 }}
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 2%, hsl(0 0% 0%) 45%)",
        }}
      />

      {/* Phase 1: Heartbeat pulses - dark red throbs from center */}
      {phase >= 1 && phase < 3 && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0, 0.25, 0, 0.35, 0, 0.15, 0] }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle at 50% 50%, hsl(0 70% 15% / 0.8) 0%, transparent 50%)",
          }}
        />
      )}

      {/* Phase 2: Implosion - everything sucks toward center */}
      {phase >= 2 && phase < 3 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            background: "radial-gradient(circle at 50% 50%, hsl(0 0% 0%) 0%, hsl(0 0% 0%) 8%, transparent 35%)",
          }}
        />
      )}

      {/* Phase 3: WHITE DETONATION - blinding flash */}
      {phase === 3 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.9, 0] }}
          transition={{ duration: 0.5, times: [0, 0.05, 0.2, 1] }}
          style={{ background: "hsl(0 0% 100%)" }}
        />
      )}

      {/* Phase 3: Red-hot afterglow behind flash */}
      {phase >= 3 && phase < 5 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3, 0] }}
          transition={{ duration: 1.5 }}
          style={{
            background: "radial-gradient(circle at 50% 50%, hsl(0 80% 30% / 0.6) 0%, hsl(0 60% 10% / 0.3) 40%, transparent 70%)",
          }}
        />
      )}

      {/* Phase 4: Expanding shockwave rings */}
      {phase >= 4 && (
        <>
          {[0, 0.12, 0.25, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
                border: `${2.5 - i * 0.5}px solid hsl(0 0% ${95 - i * 20}% / ${0.7 - i * 0.15})`,
                boxShadow: `0 0 ${80 - i * 15}px hsl(0 0% ${80 - i * 20}% / ${0.4 - i * 0.08}),
                            inset 0 0 ${40 - i * 8}px hsl(0 30% 50% / ${0.2 - i * 0.04})`,
              }}
              initial={{ width: 10, height: 10, opacity: 1 }}
              animate={{ width: "350vmax", height: "350vmax", opacity: 0 }}
              transition={{ duration: 2.2, delay, ease: [0.25, 0.1, 0.25, 1] }}
            />
          ))}
        </>
      )}

      {/* Phase 4: Screen crack lines radiating from center */}
      {phase >= 3 && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="crackBlur">
              <feGaussianBlur stdDeviation="0.15" />
            </filter>
          </defs>
          {cracks.map(c => (
            <motion.line
              key={c.id}
              x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="hsl(0 0% 90%)"
              strokeWidth={c.width * 0.25}
              strokeLinecap="round"
              filter="url(#crackBlur)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1], opacity: [0, 0.9, 0.7, 0] }}
              transition={{
                pathLength: { duration: 0.2, delay: c.delay, ease: "easeOut" },
                opacity: { duration: 1.8, delay: c.delay, times: [0, 0.1, 0.5, 1] },
              }}
            />
          ))}
        </svg>
      )}

      {/* Phase 5: Final fade - desaturation wash */}
      {phase >= 5 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ background: "hsl(0 0% 0%)" }}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// VAELITH - REALITY FRACTURE
// Static distortion → glitch tears → purple void collapse → mirror shard explosion → chromatic bleed
// ═══════════════════════════════════════════
const VaelithEffect = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0); // 0=static, 1=tears, 2=void, 3=shatter, 4=bleed, 5=fade

  const shards = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 30,
      y: 50 + (Math.random() - 0.5) * 30,
      size: 8 + Math.random() * 40,
      angle: Math.random() * 360,
      dx: (Math.random() - 0.5) * 600,
      dy: (Math.random() - 0.5) * 600,
      spin: (Math.random() - 0.5) * 720,
      hue: 255 + Math.random() * 50,
      delay: Math.random() * 0.2,
    })),
  []);

  const tears = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      y: 5 + Math.random() * 90,
      height: 0.3 + Math.random() * 2.5,
      offset: (Math.random() - 0.5) * 40,
      delay: i * 0.04,
    })),
  []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 3600),
      setTimeout(() => setPhase(5), 4600),
      setTimeout(onComplete, 5400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">

      {/* Phase 0: Creeping static / noise overlay */}
      {phase < 3 && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: phase === 0 ? [0, 0.15] : phase === 1 ? [0.15, 0.35] : [0.35, 0.5] }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg, transparent, transparent 1px, hsl(280 40% 30% / 0.08) 1px, hsl(280 40% 30% / 0.08) 2px
            )`,
            backgroundSize: "100% 3px",
          }}
        />
      )}

      {/* Phase 0-2: Purple vignette tightening */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: phase < 3 ? [0, 0.5 + phase * 0.15] : [0.8, 0],
        }}
        transition={{ duration: phase < 3 ? 1 : 0.6 }}
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 5%, hsl(275 40% 4% / 0.95) 50%)",
        }}
      />

      {/* Phase 1-2: Horizontal glitch tears */}
      {phase >= 1 && phase < 4 && (
        <>
          {tears.map(t => (
            <motion.div
              key={t.id}
              className="absolute left-0 right-0"
              initial={{ opacity: 0, x: t.offset }}
              animate={{
                opacity: [0, 0.8, 0.6, 0.9, 0],
                x: [t.offset, -t.offset, t.offset * 0.5, -t.offset * 0.3, 0],
              }}
              transition={{
                duration: 1.5,
                delay: t.delay,
                repeat: phase < 3 ? 2 : 0,
                repeatType: "mirror",
              }}
              style={{
                top: `${t.y}%`,
                height: `${t.height}%`,
                background: `linear-gradient(90deg, transparent, hsl(280 70% 50% / 0.5), hsl(270 60% 40% / 0.4), transparent)`,
                mixBlendMode: "screen" as const,
              }}
            />
          ))}
        </>
      )}

      {/* Phase 2: Central void orb growing */}
      {phase >= 2 && phase < 4 && (
        <motion.div
          className="absolute"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          initial={{ width: 0, height: 0 }}
          animate={{
            width: phase === 2 ? [0, 120, 160] : [160, 250, 180],
            height: phase === 2 ? [0, 120, 160] : [160, 250, 180],
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle,
                hsl(280 100% 70% / 0.15) 0%,
                hsl(280 60% 20% / 0.6) 25%,
                hsl(270 50% 5%) 50%,
                hsl(0 0% 0%) 70%,
                transparent 100%)`,
              boxShadow: `0 0 80px hsl(280 70% 50% / 0.4),
                          0 0 200px hsl(280 50% 30% / 0.2),
                          inset 0 0 60px hsl(280 80% 60% / 0.3)`,
            }}
          />
          {/* Spinning ring */}
          <motion.div
            className="absolute inset-[-20%] rounded-full"
            style={{
              border: "1.5px solid hsl(280 60% 60% / 0.4)",
              boxShadow: "0 0 20px hsl(280 60% 50% / 0.2)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Phase 3: SHATTER - purple flash */}
      {phase === 3 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0.7, 0] }}
          transition={{ duration: 0.5, times: [0, 0.06, 0.25, 1] }}
          style={{
            background: "radial-gradient(circle at 50% 50%, hsl(280 80% 70% / 0.9) 0%, hsl(280 60% 30% / 0.4) 35%, transparent 65%)",
          }}
        />
      )}

      {/* Phase 3-4: Mirror shards exploding outward from center */}
      {phase >= 3 && phase < 5 && (
        <>
          {shards.map(s => (
            <motion.div
              key={s.id}
              className="absolute"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size * (0.4 + Math.random() * 0.8),
              }}
              initial={{ opacity: 0, scale: 0, rotate: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.9, 0.7, 0],
                scale: [0, 1.3, 1, 0.5],
                rotate: [0, s.spin],
                x: [0, s.dx],
                y: [0, s.dy],
              }}
              transition={{
                duration: 1.4,
                delay: s.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(${s.angle}deg,
                    hsl(${s.hue} 60% 55% / 0.6),
                    hsl(${s.hue} 40% 25% / 0.3),
                    hsl(${s.hue} 30% 10% / 0.2))`,
                  clipPath: `polygon(
                    ${10 + Math.random() * 20}% 0%,
                    ${80 + Math.random() * 20}% ${Math.random() * 20}%,
                    ${90 - Math.random() * 15}% ${80 + Math.random() * 20}%,
                    0% ${70 + Math.random() * 30}%
                  )`,
                  boxShadow: `0 0 ${s.size * 0.3}px hsl(${s.hue} 60% 50% / 0.5)`,
                  border: `0.5px solid hsl(${s.hue} 50% 60% / 0.3)`,
                }}
              />
            </motion.div>
          ))}
        </>
      )}

      {/* Phase 4: Chromatic aberration bleed */}
      {phase >= 4 && phase < 5 && (
        <>
          <motion.div
            className="absolute inset-0"
            style={{ background: "hsl(280 100% 50% / 0.06)", mixBlendMode: "screen" }}
            animate={{ x: [-10, 12, -6, 4, 0], opacity: [0.7, 0.4, 0.2, 0] }}
            transition={{ duration: 1 }}
          />
          <motion.div
            className="absolute inset-0"
            style={{ background: "hsl(180 100% 50% / 0.04)", mixBlendMode: "screen" }}
            animate={{ x: [10, -12, 6, -4, 0], opacity: [0.7, 0.4, 0.2, 0] }}
            transition={{ duration: 1 }}
          />
        </>
      )}

      {/* Phase 5: Clean fade */}
      {phase >= 5 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0.25 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ background: "hsl(275 30% 5%)" }}
        />
      )}
    </div>
  );
};

const MythicEffects = ({ effect, onComplete }: MythicEffectsProps) => (
  <AnimatePresence>
    {effect === "vaelkor" && <VaelkorEffect key="vaelkor" onComplete={onComplete} />}
    {effect === "vaelith" && <VaelithEffect key="vaelith" onComplete={onComplete} />}
  </AnimatePresence>
);

export default MythicEffects;
export type { MythicEffectType };
