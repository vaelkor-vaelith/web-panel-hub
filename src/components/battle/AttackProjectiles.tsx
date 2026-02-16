import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";

interface ProjectileConfig {
  fromRect: DOMRect;
  toRect: DOMRect;
  tribe: string;
  id: string;
}

interface AttackProjectilesProps {
  projectiles: ProjectileConfig[];
  onComplete: () => void;
}

interface Particle {
  id: number;
  offsetX: number;
  offsetY: number;
  size: number;
  delay: number;
  rotation: number;
  wobbleAmplitude: number;
  wobbleFrequency: number;
}

// Generate particles for a tribe
function generateParticles(tribe: string): Particle[] {
  switch (tribe) {
    case "Emberheart Pact":
      return Array.from({ length: 14 }, (_, i) => ({
        id: i,
        offsetX: (Math.random() - 0.5) * 60,
        offsetY: (Math.random() - 0.5) * 50,
        size: 16 + Math.random() * 24,
        delay: i * 0.015,
        rotation: Math.random() * 360,
        wobbleAmplitude: 15 + Math.random() * 25,
        wobbleFrequency: 2 + Math.random() * 3,
      }));
    case "Ironroot Bastion":
      return Array.from({ length: 12 }, (_, i) => ({
        id: i,
        offsetX: (Math.random() - 0.5) * 70,
        offsetY: (Math.random() - 0.5) * 50,
        size: 18 + Math.random() * 28,
        delay: i * 0.02 + Math.random() * 0.03,
        rotation: Math.random() * 360,
        wobbleAmplitude: 25 + Math.random() * 35,
        wobbleFrequency: 2 + Math.random() * 3,
      }));
    case "Obsidian Veil":
      return Array.from({ length: 16 }, (_, i) => ({
        id: i,
        offsetX: (Math.random() - 0.5) * 80,
        offsetY: (Math.random() - 0.5) * 60,
        size: 20 + Math.random() * 30,
        delay: i * 0.015 + Math.random() * 0.02,
        rotation: Math.random() * 360,
        wobbleAmplitude: 20 + Math.random() * 30,
        wobbleFrequency: 2 + Math.random() * 3,
      }));
    case "Radiant Sanctum":
      return Array.from({ length: 10 }, (_, i) => ({
        id: i,
        offsetX: (Math.random() - 0.5) * 40,
        offsetY: (Math.random() - 0.5) * 30,
        size: 12 + Math.random() * 18,
        delay: i * 0.012,
        rotation: Math.random() * 360,
        wobbleAmplitude: 6 + Math.random() * 10,
        wobbleFrequency: 4 + Math.random() * 3,
      }));
    default: // Tribeless / Mythic - dark void particles
      return Array.from({ length: 20 }, (_, i) => ({
        id: i,
        offsetX: (Math.random() - 0.5) * 80,
        offsetY: (Math.random() - 0.5) * 60,
        size: 20 + Math.random() * 30,
        delay: i * 0.012,
        rotation: Math.random() * 360,
        wobbleAmplitude: 25 + Math.random() * 35,
        wobbleFrequency: 3 + Math.random() * 4,
      }));
  }
}

// Fire particle
const FireParticle = ({ size }: { size: number }) => (
  <div className="relative" style={{ width: size, height: size * 1.4 }}>
    <div
      className="absolute inset-0"
      style={{
        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
        background: `radial-gradient(ellipse at 50% 40%, hsl(45 100% 70%), hsl(25 100% 55%) 40%, hsl(0 80% 45%) 70%, transparent)`,
        boxShadow: `0 0 ${size * 2}px hsl(25 100% 55% / 0.9), 0 0 ${size * 4}px hsl(0 80% 45% / 0.5), 0 0 ${size * 6}px hsl(25 80% 40% / 0.3)`,
        filter: `blur(${size * 0.08}px)`,
      }}
    />
    <div
      className="absolute"
      style={{
        top: "5%",
        left: "15%",
        width: "70%",
        height: "60%",
        borderRadius: "50%",
        background: "radial-gradient(circle, hsl(50 100% 95%), hsl(45 100% 80%) 50%, transparent)",
        opacity: 0.85,
      }}
    />
  </div>
);

// Rock/boulder particle (avalanche style)
const EarthParticle = ({ size, rotation }: { size: number; rotation: number }) => {
  const crackOffset = Math.random() * 20;
  return (
    <div className="relative" style={{ width: size * 1.3, height: size * 1.2, transform: `rotate(${rotation}deg)` }}>
      <svg viewBox="0 0 40 36" style={{ width: "100%", height: "100%", filter: `drop-shadow(0 0 ${size * 0.5}px hsl(30 15% 15% / 0.8))` }}>
        <polygon
          points="6,2 18,0 34,4 38,16 36,30 24,35 8,32 2,20 0,10"
          fill="hsl(30 10% 28%)"
          stroke="hsl(25 8% 18%)"
          strokeWidth="1.5"
        />
        <line x1={8 + crackOffset * 0.3} y1="8" x2={20 + crackOffset * 0.2} y2="18" stroke="hsl(25 6% 15%)" strokeWidth="1" opacity="0.7" />
        <line x1="22" y1={10 + crackOffset * 0.2} x2="32" y2="24" stroke="hsl(25 6% 15%)" strokeWidth="0.8" opacity="0.5" />
        <polygon points="10,6 20,4 28,10 18,14" fill="hsl(35 12% 38%)" opacity="0.5" />
        <polygon points="8,22 20,26 14,32 4,28" fill="hsl(25 8% 12%)" opacity="0.4" />
      </svg>
      <div
        className="absolute inset-[-30%] rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(30 15% 40% / 0.3), hsl(30 10% 25% / 0.15), transparent 70%)`,
          filter: `blur(${size * 0.2}px)`,
        }}
      />
    </div>
  );
};

// Dark purple/black smoke particle
const ShadowParticle = ({ size }: { size: number }) => (
  <div className="relative" style={{ width: size * 1.8, height: size * 1.8 }}>
    <div
      className="absolute rounded-full"
      style={{
        width: "100%", height: "100%",
        background: `radial-gradient(ellipse at 40% 45%, hsl(270 40% 18% / 0.9), hsl(270 30% 8% / 0.7) 50%, transparent 80%)`,
        filter: `blur(${size * 0.25}px)`,
      }}
    />
    <div
      className="absolute rounded-full"
      style={{
        top: "10%", left: "15%", width: "75%", height: "70%",
        background: `radial-gradient(ellipse at 55% 50%, hsl(280 50% 25% / 0.8), hsl(0 0% 0% / 0.6) 60%, transparent)`,
        filter: `blur(${size * 0.18}px)`,
      }}
    />
    <div
      className="absolute rounded-full"
      style={{
        top: "25%", left: "25%", width: "50%", height: "50%",
        background: `radial-gradient(circle, hsl(0 0% 2% / 0.9), hsl(270 20% 10% / 0.5) 70%, transparent)`,
        filter: `blur(${size * 0.1}px)`,
      }}
    />
    <div
      className="absolute inset-[-10%] rounded-full"
      style={{
        boxShadow: `0 0 ${size * 1.5}px hsl(270 50% 30% / 0.4), 0 0 ${size * 3}px hsl(280 40% 15% / 0.2)`,
      }}
    />
  </div>
);

// Light particle
const LightParticle = ({ size }: { size: number }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background: `radial-gradient(circle, hsl(45 100% 97%), hsl(45 80% 70%) 40%, hsl(40 60% 50%) 70%, transparent)`,
        boxShadow: `0 0 ${size * 3}px hsl(45 80% 65% / 0.8), 0 0 ${size * 6}px hsl(45 60% 55% / 0.4), 0 0 ${size * 10}px hsl(45 50% 50% / 0.2)`,
      }}
    />
    <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: size * 4, height: 2, background: `linear-gradient(90deg, transparent, hsl(45 100% 85% / 0.9), hsl(45 100% 97%), hsl(45 100% 85% / 0.9), transparent)` }} />
    <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 2, height: size * 4, background: `linear-gradient(180deg, transparent, hsl(45 100% 85% / 0.9), hsl(45 100% 97%), hsl(45 100% 85% / 0.9), transparent)` }} />
  </div>
);

// Mythic/Tribeless void particle
const VoidParticle = ({ size }: { size: number }) => (
  <div className="relative" style={{ width: size * 1.3, height: size * 1.3 }}>
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background: `radial-gradient(circle, hsl(0 0% 5%), hsl(0 0% 0%) 50%, hsl(280 30% 8%) 80%, transparent)`,
        boxShadow: `0 0 ${size * 2}px hsl(0 0% 0%), 0 0 ${size * 4}px hsl(280 30% 15% / 0.5), 0 0 ${size * 6}px hsl(0 60% 30% / 0.3)`,
      }}
    />
    {/* Inner rift glow */}
    <div
      className="absolute rounded-full"
      style={{
        top: "20%", left: "20%", width: "60%", height: "60%",
        background: `radial-gradient(circle, hsl(0 80% 55% / 0.7), hsl(280 50% 30% / 0.4) 60%, transparent)`,
        filter: `blur(${size * 0.15}px)`,
      }}
    />
    {/* Distortion ring */}
    <div
      className="absolute inset-[-15%] rounded-full"
      style={{
        border: `1px solid hsl(0 0% 40% / 0.3)`,
        boxShadow: `inset 0 0 ${size}px hsl(280 30% 20% / 0.3)`,
      }}
    />
  </div>
);

const ParticleRenderer = ({ tribe, size, rotation }: { tribe: string; size: number; rotation: number }) => {
  switch (tribe) {
    case "Emberheart Pact":
      return <FireParticle size={size} />;
    case "Ironroot Bastion":
      return <EarthParticle size={size} rotation={rotation} />;
    case "Obsidian Veil":
      return <ShadowParticle size={size} />;
    case "Radiant Sanctum":
      return <LightParticle size={size} />;
    default: // Tribeless / Mythic
      return <VoidParticle size={size} />;
  }
};

const DURATION = 0.5; // seconds for projectile to travel

// Tribe-specific trail color (shared across all projectiles)
  const trailColor: Record<string, string> = {
    "Emberheart Pact": "hsl(25 100% 55% / 0.5)",
    "Ironroot Bastion": "hsl(100 30% 30% / 0.5)",
    "Obsidian Veil": "hsl(270 50% 45% / 0.5)",
    "Radiant Sanctum": "hsl(45 80% 65% / 0.5)",
    "Tribeless": "hsl(0 0% 10% / 0.7)",
  };

/** Renders a single projectile's trail + particles + impact flash */
const SingleProjectile = ({ config }: { config: ProjectileConfig }) => {
  const particles = useMemo(() => generateParticles(config.tribe), [config.id]);
  const { fromRect, toRect, tribe } = config;
  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;
  const endX = toRect.left + toRect.width / 2;
  const endY = toRect.top + toRect.height / 2;

  return (
    <>
      {/* Trail line */}
      <motion.div
        className="absolute"
        style={{ left: startX, top: startY, width: 2, height: 2, borderRadius: "50%" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.8, 0],
          x: [0, endX - startX],
          y: [0, endY - startY],
          scale: [1.5, 0.8],
        }}
        transition={{ duration: DURATION * 1.2, ease: "easeIn" }}
      >
        <div style={{
          width: 120, height: 120, borderRadius: "50%",
            background: `radial-gradient(circle, ${trailColor[tribe] || "hsl(0 0% 50% / 0.3)"}, transparent 70%)`,
          transform: "translate(-50%, -50%)", filter: "blur(12px)",
        }} />
      </motion.div>

      {/* Particles */}
      {particles.map((p) => {
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx);
        const perpX = -Math.sin(angle) * p.wobbleAmplitude;
        const perpY = Math.cos(angle) * p.wobbleAmplitude;
        const arcY =
          tribe === "Ironroot Bastion" ? -15 - Math.random() * 20 :
          tribe === "Emberheart Pact" ? -40 - Math.random() * 50 :
          tribe === "Obsidian Veil" ? -25 + Math.random() * 50 :
          -20;

        return (
          <motion.div
            key={`${config.id}-p${p.id}`}
            className="absolute"
            style={{ left: startX + p.offsetX, top: startY + p.offsetY }}
            initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0.6, 0],
              scale: [0.4, 1.6, 1.3, 1, 0.3],
              x: [0, dx * 0.3 + perpX, dx * 0.6 - perpX * 0.5, dx * 0.85 + perpX * 0.3, dx],
              y: [0, dy * 0.3 + arcY, dy * 0.6 + arcY * 0.5, dy * 0.85, dy],
              rotate: tribe === "Ironroot Bastion" ? [p.rotation - 20, p.rotation + 15, p.rotation - 10, p.rotation + 5, p.rotation] :
                      tribe === "Obsidian Veil" ? [p.rotation, p.rotation + 15, p.rotation - 15, p.rotation] :
                      [0, 0],
            }}
            transition={{ duration: DURATION, delay: p.delay, ease: tribe === "Radiant Sanctum" ? "easeIn" : "easeOut" }}
          >
            <ParticleRenderer tribe={tribe} size={p.size} rotation={p.rotation} />
          </motion.div>
        );
      })}

      {/* Impact flash at destination */}
      <motion.div
        className="absolute"
        style={{ left: endX, top: endY, transform: "translate(-50%, -50%)" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0, 1, 0], scale: [0, 0, 2.5, 4] }}
        transition={{ duration: DURATION + 0.2, ease: "easeOut" }}
      >
        <div style={{
          width: 140, height: 140, borderRadius: "50%", filter: "blur(6px)",
            background:
              tribe === "Emberheart Pact" ? "radial-gradient(circle, hsl(25 100% 70% / 0.7), hsl(0 80% 50% / 0.3), transparent 70%)" :
              tribe === "Ironroot Bastion" ? "radial-gradient(circle, hsl(100 40% 45% / 0.6), hsl(110 25% 25% / 0.3), transparent 70%)" :
              tribe === "Obsidian Veil" ? "radial-gradient(circle, hsl(270 60% 60% / 0.6), hsl(270 35% 35% / 0.3), transparent 70%)" :
              "radial-gradient(circle, hsl(45 100% 90% / 0.8), hsl(45 60% 60% / 0.3), transparent 70%)",
        }} />
      </motion.div>
    </>
  );
};

/** Renders ALL active projectiles simultaneously. Fires onComplete when they all finish. */
const AttackProjectiles = ({ projectiles, onComplete }: AttackProjectilesProps) => {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Track which batch we're rendering to prevent stale timers
  const batchIdRef = useRef(0);

  useEffect(() => {
    if (projectiles.length > 0) {
      const currentBatch = ++batchIdRef.current;
      const timer = setTimeout(() => {
        if (batchIdRef.current === currentBatch) {
          onCompleteRef.current();
        }
      }, (DURATION + 0.15) * 1000); // 650ms - all projectiles land at the same time
      return () => clearTimeout(timer);
    }
  }, [projectiles]);

  if (projectiles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[55] pointer-events-none">
      {projectiles.map((p) => (
        <SingleProjectile key={p.id} config={p} />
      ))}
    </div>
  );
};

export default AttackProjectiles;
