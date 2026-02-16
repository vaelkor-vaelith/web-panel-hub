import { motion } from "framer-motion";
import { useState } from "react";
import castleEmberheart from "@/assets/castle-emberheart-pact.jpg";
import castleIronroot from "@/assets/castle-ironroot-bastion.jpg";
import castleRadiant from "@/assets/castle-radiant-sanctum.jpg";
import castleObsidian from "@/assets/castle-obsidian-veil.jpg";

const tribes = [
  { id: "emberheart-pact", name: "Emberheart Pact", short: "Emberheart", color: "var(--fire-glow)", colorDim: "var(--fire)", beats: "Obsidian", reason: "Flame burns away the darkness", castle: castleEmberheart },
  { id: "ironroot-bastion", name: "Ironroot Bastion", short: "Ironroot", color: "var(--earth-glow)", colorDim: "var(--earth)", beats: "Emberheart", reason: "Roots smother the flame", castle: castleIronroot },
  { id: "radiant-sanctum", name: "Radiant Sanctum", short: "Radiant", color: "var(--light-glow)", colorDim: "var(--light)", beats: "Ironroot", reason: "Light scorches the roots", castle: castleRadiant },
  { id: "obsidian-veil", name: "Obsidian Veil", short: "Obsidian", color: "var(--shadow-glow)", colorDim: "var(--shadow)", beats: "Radiant", reason: "Darkness devours light", castle: castleObsidian },
] as const;

type Tribe = (typeof tribes)[number];

/* ─── Castle Card ─── */
const CastleCard = ({
  tribe, index, isHovered, onHover, onLeave,
}: {
  tribe: Tribe; index: number; isHovered: boolean;
  onHover: () => void; onLeave: () => void;
}) => (
  <motion.div
    className="relative flex flex-col items-center cursor-pointer"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay: 0.2 + index * 0.15 }}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
  >
    {/* Image frame */}
    <motion.div
      className="relative overflow-hidden rounded-sm"
      style={{ width: "clamp(110px, 16vw, 170px)", aspectRatio: "3 / 4" }}
      animate={isHovered
        ? { boxShadow: `0 4px 50px hsl(${tribe.color} / 0.25), 0 0 100px hsl(${tribe.color} / 0.08)` }
        : { boxShadow: `0 2px 20px hsl(${tribe.color} / 0.06)` }
      }
      transition={{ duration: 0.5 }}
    >
      {/* Border */}
      <motion.div
        className="absolute inset-0 z-20 rounded-sm pointer-events-none"
        style={{ border: `1px solid hsl(${tribe.colorDim} / 0.15)` }}
        animate={isHovered ? { borderColor: `hsl(${tribe.color} / 0.45)` } : { borderColor: `hsl(${tribe.colorDim} / 0.15)` }}
        transition={{ duration: 0.3 }}
      />
      {/* Image */}
      <motion.img
        src={tribe.castle}
        alt={tribe.name}
        className="w-full h-full object-cover"
        animate={isHovered ? { scale: 1.06 } : { scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 pointer-events-none z-10" />
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l z-20 pointer-events-none"
        style={{ borderColor: `hsl(${tribe.color} / 0.2)` }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r z-20 pointer-events-none"
        style={{ borderColor: `hsl(${tribe.color} / 0.2)` }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l z-20 pointer-events-none"
        style={{ borderColor: `hsl(${tribe.color} / 0.2)` }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r z-20 pointer-events-none"
        style={{ borderColor: `hsl(${tribe.color} / 0.2)` }} />
    </motion.div>

    {/* Name below */}
    <motion.p
      className="mt-4 font-display text-[10px] md:text-xs tracking-[0.3em]"
      style={{ color: `hsl(${tribe.color})`, textShadow: `0 0 15px hsl(${tribe.color} / 0.3)` }}
      animate={isHovered ? { letterSpacing: "0.4em" } : { letterSpacing: "0.3em" }}
      transition={{ duration: 0.4 }}
    >
      {tribe.short}
    </motion.p>

    {/* Hover reveal: beats info */}
    <motion.div
      className="flex flex-col items-center"
      initial={false}
      animate={isHovered ? { opacity: 1, height: 28, marginTop: 6 } : { opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: "hidden" }}
    >
      <span className="font-body text-[8px] md:text-[9px] text-muted-foreground tracking-[0.15em] uppercase">
        Dominates <span style={{ color: `hsl(${tribe.colorDim})` }}>{tribe.beats}</span>
      </span>
    </motion.div>
  </motion.div>
);

/* ─── Main ─── */
const TribalAdvantageCycle = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  /* 
    Diamond layout with SVG overlay for arrows.
    Positions (in a 2x2 conceptual grid, diamond-rotated):
    
         [Emberheart]        (top)
     [Obsidian] → [Ironroot] (middle)
         [Radiant]           (bottom)

    Cycle: Emberheart→Obsidian, Obsidian→Radiant, Radiant→Ironroot, Ironroot→Emberheart
  */

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="mt-40 mb-8 relative"
    >
      {/* Header */}
      <div className="text-center mb-24">
        <motion.p className="font-body text-muted-foreground tracking-[0.5em] text-[9px] uppercase mb-4"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          The Eternal Struggle
        </motion.p>
        <motion.h3 className="font-display text-4xl md:text-6xl text-foreground"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}>
          ADVANTAGE CYCLE
        </motion.h3>
        <motion.div className="mx-auto mt-5 w-16 h-px"
          style={{ background: "linear-gradient(to right, transparent, hsl(var(--foreground) / 0.2), transparent)" }}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }} />
        <motion.p className="text-muted-foreground mt-5 max-w-lg mx-auto text-xs md:text-sm leading-relaxed"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}>
          Each tribe holds dominion over another - an unbreakable cycle forged
          in the ashes of The Shattering.
        </motion.p>
      </div>

      {/* Diamond layout with SVG arrows underneath */}
      <div className="relative max-w-4xl mx-auto px-4">
        {/* SVG arrow overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 800 700"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="arrow-fire" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="none" stroke="hsl(var(--fire-glow))" strokeWidth="0.8" />
            </marker>
            <marker id="arrow-earth" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="none" stroke="hsl(var(--earth-glow))" strokeWidth="0.8" />
            </marker>
            <marker id="arrow-light" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="none" stroke="hsl(var(--light-glow))" strokeWidth="0.8" />
            </marker>
            <marker id="arrow-shadow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="none" stroke="hsl(var(--shadow-glow))" strokeWidth="0.8" />
            </marker>
          </defs>

          {/* Emberheart (top ~400,80) → Obsidian (left ~160,340) */}
          <motion.path
            d="M 370 130 C 300 180, 200 230, 195 290"
            stroke="hsl(var(--fire-glow))" strokeWidth="1" opacity="0.25"
            markerEnd="url(#arrow-fire)" fill="none"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.6 }}
          />
          <motion.path d="M 370 130 C 300 180, 200 230, 195 290"
            stroke="hsl(var(--fire-glow))" strokeWidth="8" opacity="0.04" fill="none" filter="blur(4px)"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.6 }}
          />

          {/* Obsidian (left ~160,440) → Radiant (bottom ~400,590) */}
          <motion.path
            d="M 195 440 C 230 510, 310 570, 370 590"
            stroke="hsl(var(--shadow-glow))" strokeWidth="1" opacity="0.25"
            markerEnd="url(#arrow-shadow)" fill="none"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.9 }}
          />
          <motion.path d="M 195 440 C 230 510, 310 570, 370 590"
            stroke="hsl(var(--shadow-glow))" strokeWidth="8" opacity="0.04" fill="none" filter="blur(4px)"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.9 }}
          />

          {/* Radiant (bottom ~430,590) → Ironroot (right ~640,340) */}
          <motion.path
            d="M 430 590 C 510 570, 590 510, 610 440"
            stroke="hsl(var(--light-glow))" strokeWidth="1" opacity="0.25"
            markerEnd="url(#arrow-light)" fill="none"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 1.2 }}
          />
          <motion.path d="M 430 590 C 510 570, 590 510, 610 440"
            stroke="hsl(var(--light-glow))" strokeWidth="8" opacity="0.04" fill="none" filter="blur(4px)"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 1.2 }}
          />

          {/* Ironroot (right ~640,290) → Emberheart (top ~430,130) */}
          <motion.path
            d="M 610 290 C 590 230, 510 180, 430 130"
            stroke="hsl(var(--earth-glow))" strokeWidth="1" opacity="0.25"
            markerEnd="url(#arrow-earth)" fill="none"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 1.5 }}
          />
          <motion.path d="M 610 290 C 590 230, 510 180, 430 130"
            stroke="hsl(var(--earth-glow))" strokeWidth="8" opacity="0.04" fill="none" filter="blur(4px)"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 1.5 }}
          />
        </svg>

        {/* HTML card grid */}
        <div className="relative z-10">
          {/* Top: Emberheart */}
          <div className="flex justify-center mb-12 md:mb-16">
            <CastleCard tribe={tribes[0]} index={0} isHovered={hovered === 0}
              onHover={() => setHovered(0)} onLeave={() => setHovered(null)} />
          </div>

          {/* Middle: Obsidian (left) + Ironroot (right) */}
          <div className="flex justify-between items-center px-4 md:px-12">
            <CastleCard tribe={tribes[3]} index={3} isHovered={hovered === 3}
              onHover={() => setHovered(3)} onLeave={() => setHovered(null)} />

            {/* Center element */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />
              <div className="w-1.5 h-1.5 rotate-45 border border-foreground/10" />
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />
            </motion.div>

            <CastleCard tribe={tribes[1]} index={1} isHovered={hovered === 1}
              onHover={() => setHovered(1)} onLeave={() => setHovered(null)} />
          </div>

          {/* Bottom: Radiant */}
          <div className="flex justify-center mt-12 md:mt-16">
            <CastleCard tribe={tribes[2]} index={2} isHovered={hovered === 2}
              onHover={() => setHovered(2)} onLeave={() => setHovered(null)} />
          </div>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-3"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 1.6 }}
      >
        {tribes.map((t) => (
          <div key={t.id} className="flex items-center gap-2.5 text-[9px] md:text-[11px]">
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: `hsl(${t.color})`, boxShadow: `0 0 6px hsl(${t.color} / 0.5)` }} />
            <span className="font-display tracking-[0.2em]" style={{ color: `hsl(${t.color})` }}>
              {t.short}
            </span>
            <span className="text-muted-foreground/30 font-body">▸</span>
            <span className="font-body text-muted-foreground tracking-wider">{t.beats}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TribalAdvantageCycle;
