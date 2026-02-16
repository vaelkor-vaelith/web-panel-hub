import { motion } from "framer-motion";
import { useMemo } from "react";

type TribeName = "Obsidian Veil" | "Radiant Sanctum" | "Emberheart Pact" | "Ironroot Bastion" | "Tribeless";

interface TribeParticlesProps {
  tribe?: TribeName;
  count?: number;
  className?: string;
  /** Mix all tribe particles (for battlefield) */
  mixed?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  tribe: TribeName;
  shape: "circle" | "diamond" | "leaf" | "ember" | "star" | "wisp";
  drift: number;
  rise: number;
  rotation: number;
}

const TRIBE_CONFIGS: Record<TribeName, {
  colors: string[];
  shapes: Particle["shape"][];
  glowColor: string;
  sizeRange: [number, number];
}> = {
  "Obsidian Veil": {
    colors: [
      "hsl(270 40% 50% / VAR)",
      "hsl(280 30% 40% / VAR)",
      "hsl(260 35% 55% / VAR)",
      "hsl(290 25% 35% / VAR)",
    ],
    shapes: ["wisp", "diamond", "circle", "wisp"],
    glowColor: "hsl(270 40% 50%)",
    sizeRange: [2, 5],
  },
  "Radiant Sanctum": {
    colors: [
      "hsl(45 60% 60% / VAR)",
      "hsl(40 50% 70% / VAR)",
      "hsl(50 55% 55% / VAR)",
      "hsl(35 45% 65% / VAR)",
    ],
    shapes: ["star", "circle", "diamond", "star"],
    glowColor: "hsl(45 50% 60%)",
    sizeRange: [1.5, 4],
  },
  "Emberheart Pact": {
    colors: [
      "hsl(10 70% 50% / VAR)",
      "hsl(25 80% 55% / VAR)",
      "hsl(0 60% 45% / VAR)",
      "hsl(15 75% 60% / VAR)",
    ],
    shapes: ["ember", "circle", "ember", "diamond"],
    glowColor: "hsl(10 55% 50%)",
    sizeRange: [1.5, 4.5],
  },
  "Ironroot Bastion": {
    colors: [
      "hsl(140 35% 42% / VAR)",
      "hsl(120 30% 38% / VAR)",
      "hsl(150 40% 45% / VAR)",
      "hsl(100 25% 35% / VAR)",
    ],
    shapes: ["leaf", "circle", "leaf", "circle"],
    glowColor: "hsl(140 35% 42%)",
    sizeRange: [2, 6],
  },
  "Tribeless": {
    colors: [
      "hsl(0 45% 45% / VAR)",
      "hsl(270 30% 40% / VAR)",
      "hsl(45 40% 50% / VAR)",
      "hsl(0 0% 60% / VAR)",
    ],
    shapes: ["star", "diamond", "wisp", "circle"],
    glowColor: "hsl(0 0% 50%)",
    sizeRange: [2, 5],
  },
};

const ALL_TRIBES: TribeName[] = ["Obsidian Veil", "Radiant Sanctum", "Emberheart Pact", "Ironroot Bastion"];

function generateParticle(id: number, tribe: TribeName, count: number): Particle {
  const config = TRIBE_CONFIGS[tribe];
  const [minSize, maxSize] = config.sizeRange;
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: minSize + Math.random() * (maxSize - minSize),
    duration: 6 + Math.random() * 14,
    delay: Math.random() * 8,
    opacity: 0.15 + Math.random() * 0.35,
    tribe,
    shape: config.shapes[Math.floor(Math.random() * config.shapes.length)],
    drift: -20 + Math.random() * 40,
    rise: 30 + Math.random() * 80,
    rotation: Math.random() * 360,
  };
}

const ShapeRenderer = ({ shape, size, color, glow }: { shape: Particle["shape"]; size: number; color: string; glow: string }) => {
  switch (shape) {
    case "ember":
      return (
        <div
          style={{
            width: size,
            height: size * 1.4,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: `radial-gradient(ellipse at 50% 30%, ${color}, transparent)`,
            boxShadow: `0 0 ${size * 3}px ${glow.replace(")", " / 0.4)")}`,
          }}
        />
      );
    case "leaf":
      return (
        <div
          style={{
            width: size * 1.8,
            height: size,
            borderRadius: "0 80% 0 80%",
            background: `linear-gradient(135deg, ${color}, transparent)`,
            boxShadow: `0 0 ${size * 2}px ${glow.replace(")", " / 0.3)")}`,
          }}
        />
      );
    case "star":
      return (
        <div style={{ position: "relative", width: size, height: size }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: color,
              borderRadius: "50%",
              boxShadow: `0 0 ${size * 4}px ${glow.replace(")", " / 0.5)")}, 0 0 ${size * 8}px ${glow.replace(")", " / 0.2)")}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: size * 3,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(90deg)",
              width: size * 3,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />
        </div>
      );
    case "diamond":
      return (
        <div
          style={{
            width: size,
            height: size,
            transform: "rotate(45deg)",
            background: color,
            boxShadow: `0 0 ${size * 3}px ${glow.replace(")", " / 0.4)")}`,
          }}
        />
      );
    case "wisp":
      return (
        <div
          style={{
            width: size * 2.5,
            height: size * 0.8,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${color}, transparent 70%)`,
            filter: `blur(${size * 0.5}px)`,
          }}
        />
      );
    default:
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 ${size * 3}px ${glow.replace(")", " / 0.4)")}`,
          }}
        />
      );
  }
};

const TribeParticles = ({ tribe, count = 24, className = "", mixed = false }: TribeParticlesProps) => {
  const particles = useMemo(() => {
    if (mixed) {
      return Array.from({ length: count }, (_, i) => {
        const t = ALL_TRIBES[i % ALL_TRIBES.length];
        return generateParticle(i, t, count);
      });
    }
    const t = tribe || "Tribeless";
    return Array.from({ length: count }, (_, i) => generateParticle(i, t, count));
  }, [tribe, count, mixed]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((p) => {
        const config = TRIBE_CONFIGS[p.tribe];
        const colorTemplate = config.colors[p.id % config.colors.length];
        const color = colorTemplate.replace("VAR", String(p.opacity));

        return (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -p.rise, 0],
              x: [0, p.drift, 0],
              opacity: [0, p.opacity, 0],
              rotate: [p.rotation, p.rotation + (p.shape === "leaf" ? 180 : 0), p.rotation],
              scale: [0.6, 1, 0.6],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ShapeRenderer
              shape={p.shape}
              size={p.size}
              color={color}
              glow={config.glowColor}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default TribeParticles;
