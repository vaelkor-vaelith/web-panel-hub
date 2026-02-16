import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";


const phases = [
  { name: "DRAW", icon: "◈", desc: "Draw a card from your deck at the start of each turn." },
  { name: "DEPLOY", icon: "⬡", desc: "Spend energy to place cards onto your 5 battlefield slots." },
  { name: "BATTLE", icon: "X", desc: "Cards attack opposing slots. Empty slots deal damage to Player HP." },
  { name: "END", icon: "◎", desc: "Turn passes. Energy increases by 1 (max 10)." },
];

const coreRules = [
  {
    title: "ENERGY",
    value: "1 → 10",
    desc: "Start with 1 energy. Gain +1 each turn up to 10. Spend to deploy cards.",
    icon: "◆",
  },
  {
    title: "BATTLEFIELD",
    value: "5 SLOTS",
    desc: "Each player has 5 card slots plus a Player HP pool (default 20 HP).",
    icon: "▣",
  },
  {
    title: "TRIBAL SYNERGY",
    value: "3+ CARDS",
    desc: "Deploy 3+ cards of the same tribe to trigger unique tribal bonuses.",
    icon: "✦",
  },
  {
    title: "DECK BUILDING",
    value: "20 CARDS",
    desc: "Build a 20-card deck. Max 1 copy per card. Mono-tribe or mixed.",
    icon: "◇",
  },
];

const rarities = [
  { name: "Common", count: 28, budget: "3-4", pct: 20, desc: "Backbone of every deck" },
  { name: "Rare", count: 12, budget: "5-7", pct: 40, desc: "Tactical advantage" },
  { name: "Epic", count: 8, budget: "8-10", pct: 60, desc: "Game-changing presence" },
  { name: "Legendary", count: 4, budget: "12-14", pct: 80, desc: "Faction leaders" },
  { name: "Mythic", count: 2, budget: "16-17", pct: 100, desc: "World-breaking power" },
];

const keywords = [
  { name: "Taunt", desc: "Must be attacked first" },
  { name: "Shield", desc: "Absorbs damage before HP" },
  { name: "Stealth", desc: "Cannot be targeted for 1 turn" },
  { name: "Lifesteal", desc: "Heals player for damage dealt" },
  { name: "Burn", desc: "Deals damage over time" },
  { name: "Backstab", desc: "Bonus damage from Stealth" },
  { name: "Rage", desc: "Gains ATK when damaged" },
  { name: "Thorns", desc: "Reflects damage to attacker" },
  { name: "Slow", desc: "Cannot attack on deploy turn" },
];

const MechanicsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const [activePhase, setActivePhase] = useState(0);

  return (
    <section id="mechanics" ref={sectionRef} className="relative">
      <div className="comic-divider mb-0" />

      <div className="relative w-full overflow-hidden bg-background">

        <div className="relative z-10 container mx-auto px-6 py-32 md:py-44">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6"
          >
            <p className="font-body text-muted-foreground tracking-[0.5em] text-[10px] uppercase mb-4">
              Master the Game
            </p>
            <h2 className="font-display text-6xl md:text-8xl text-foreground glow-shadow">
              HOW TO PLAY
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-24 md:mb-32"
          >
            Strategic depth meets elemental warfare. Every decision matters.
          </motion.p>

          {/* ─── TURN PHASES ─── */}
          <div className="max-w-4xl mx-auto mb-28 md:mb-36">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl text-center text-foreground/80 mb-12"
            >
              TURN PHASES
            </motion.h3>

            {/* Phase selector */}
            <div className="flex justify-center gap-2 md:gap-4 mb-10">
              {phases.map((p, i) => (
                <motion.button
                  key={p.name}
                  onClick={() => setActivePhase(i)}
                  className={`relative px-4 md:px-8 py-3 md:py-4 transition-all duration-300 ${
                    activePhase === i
                      ? "bg-foreground/[0.06]"
                      : "hover:bg-foreground/[0.02]"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <span className="text-lg md:text-xl block mb-1 text-foreground/30">{p.icon}</span>
                  <span
                    className={`font-display text-xs md:text-sm tracking-wider ${
                      activePhase === i ? "text-foreground/80" : "text-foreground/30"
                    }`}
                  >
                    {p.name}
                  </span>
                  {activePhase === i && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-px bg-foreground/30"
                      layoutId="phaseIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Phase description */}
            <div className="text-center min-h-[60px]">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 border border-foreground/10 bg-foreground/[0.02]">
                  <span className="font-display text-foreground/60">{phases[activePhase].name}</span>
                  <span className="w-px h-4 bg-foreground/10" />
                  <span className="text-sm text-muted-foreground">{phases[activePhase].desc}</span>
                </div>
              </motion.div>
            </div>

            {/* Phase flow arrows */}
            <div className="flex justify-center items-center gap-1 mt-8">
              {phases.map((p, i) => (
                <div key={p.name} className="flex items-center gap-1">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center text-xs font-display transition-all duration-300 ${
                      i <= activePhase
                        ? "border-foreground/30 text-foreground/60 bg-foreground/[0.05]"
                        : "border-foreground/8 text-foreground/15"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < phases.length - 1 && (
                    <div
                      className={`w-6 md:w-10 h-px transition-colors duration-300 ${
                        i < activePhase ? "bg-foreground/20" : "bg-foreground/5"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── CORE RULES ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-28 md:mb-36">
            {coreRules.map((rule, i) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-6 border border-foreground/[0.06] bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all duration-500"
              >
                <span className="text-foreground/10 text-2xl group-hover:text-foreground/20 transition-colors">
                  {rule.icon}
                </span>
                <div className="mt-4">
                  <span className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">
                    {rule.title}
                  </span>
                  <p className="font-display text-2xl md:text-3xl text-foreground/70 mt-1 group-hover:text-foreground/90 transition-colors">
                    {rule.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{rule.desc}</p>
                </div>
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-foreground/[0.06] group-hover:border-foreground/10 transition-colors" />
              </motion.div>
            ))}
          </div>

          {/* ─── RARITY SYSTEM ─── */}
          <div className="max-w-4xl mx-auto mb-28 md:mb-36">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl text-center text-foreground/80 mb-14"
            >
              RARITY SYSTEM
            </motion.h3>

            <div className="space-y-4">
              {rarities.map((r, i) => (
                <motion.div
                  key={r.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group grid grid-cols-[1fr_auto] md:grid-cols-[140px_1fr_100px_80px] items-center gap-4 py-4 border-b border-foreground/[0.06] hover:bg-foreground/[0.02] transition-colors px-2"
                >
                  <div>
                    <span className="font-display text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors">
                      {r.name}
                    </span>
                    <p className="text-[10px] text-muted-foreground md:hidden">{r.desc}</p>
                  </div>

                  {/* Power bar - visible on md+ */}
                  <div className="hidden md:block">
                    <div className="h-1.5 bg-foreground/[0.04] w-full overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--foreground) / 0.08), hsl(var(--foreground) / ${0.1 + i * 0.08}))`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${r.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                      />
                    </div>
                  </div>

                  <span className="hidden md:block text-xs text-muted-foreground text-center">
                    {r.budget} stats
                  </span>
                  <span className="text-xs text-foreground/40 text-right font-display">
                    ×{r.count}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── KEYWORDS ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto"
          >
            <h3 className="font-display text-2xl md:text-3xl text-center text-foreground/80 mb-14">
              KEYWORDS
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-8 gap-y-6">
              {keywords.map((kw, i) => (
                <motion.div
                  key={kw.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-start gap-3 group"
                >
                  <span className="w-1 h-1 rounded-full bg-foreground/15 mt-2 shrink-0 group-hover:bg-foreground/30 transition-colors" />
                  <div>
                    <span className="font-display text-xs text-foreground/60 group-hover:text-foreground/80 transition-colors">
                      {kw.name}
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{kw.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MechanicsSection;
