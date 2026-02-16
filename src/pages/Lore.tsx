import { useState, useMemo, useEffect, useRef, Fragment, ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  volumes,
  epilogue,
  lorebookEpigraph,
  timelineAppendix,
  glossary,
  tribeRosters,
} from "@/data/lorebookContent";
import { characterPortraits, CharacterPortrait } from "@/data/characterPortraits";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Background images
import bgVol1 from "@/assets/lore/bg-vol1-world-before.jpg";
import bgVol2 from "@/assets/lore/bg-vol2-shattering.jpg";
import bgVol3 from "@/assets/lore/bg-vol3-four-tribes.jpg";
import bgVol4 from "@/assets/lore/bg-vol4-eternal-war.jpg";
import bgVol5 from "@/assets/lore/bg-vol5-legends.jpg";
import bgVol6 from "@/assets/lore/bg-vol6-language-war.jpg";
import bgAppendices from "@/assets/lore/bg-appendices.jpg";

const volumeBackgrounds: Record<number, string> = {
  1: bgVol1,
  2: bgVol2,
  3: bgVol3,
  4: bgVol4,
  5: bgVol5,
  6: bgVol6,
  0: bgAppendices,
};

const volumeLabels = [
  { num: 1, label: "The World Before", roman: "I" },
  { num: 2, label: "The Shattering", roman: "II" },
  { num: 3, label: "The Four Tribes", roman: "III" },
  { num: 4, label: "The Eternal War", roman: "IV" },
  { num: 5, label: "Legends & Secrets", roman: "V" },
  { num: 6, label: "The Language of War", roman: "VI" },
  { num: 0, label: "Appendices", roman: "◆" },
];

const volumeAccentColors: Record<number, string> = {
  1: "hsl(var(--foreground) / 0.3)",
  2: "hsl(var(--mythic-glow))",
  3: "hsl(var(--earth-glow))",
  4: "hsl(var(--fire-glow))",
  5: "hsl(var(--shadow-glow))",
  6: "hsl(var(--light-glow))",
  0: "hsl(var(--foreground) / 0.3)",
};

const tribeColorMap: Record<string, string> = {
  shadow: "hsl(var(--shadow-glow))",
  light: "hsl(var(--light-glow))",
  fire: "hsl(var(--fire-glow))",
  earth: "hsl(var(--earth-glow))",
  mythic: "hsl(var(--mythic-glow))",
};

const tribeGradientMap: Record<string, string> = {
  shadow: "from-[hsl(270,40%,50%,0.15)] to-transparent",
  light: "from-[hsl(45,50%,60%,0.12)] to-transparent",
  fire: "from-[hsl(10,55%,50%,0.12)] to-transparent",
  earth: "from-[hsl(140,35%,42%,0.12)] to-transparent",
  mythic: "from-[hsl(0,55%,45%,0.12)] to-transparent",
};

// Inline portrait component — redesigned
const InlinePortrait = ({ portrait }: { portrait: CharacterPortrait }) => (
  <span className="inline-flex items-center gap-1.5 mx-0.5 align-middle group/portrait">
    <span
      className="inline-block w-7 h-7 rounded-full overflow-hidden border-2 flex-shrink-0 align-middle transition-all duration-300 group-hover/portrait:scale-110"
      style={{
        borderColor: tribeColorMap[portrait.tribe] || "hsl(var(--foreground) / 0.15)",
        boxShadow: `0 0 10px ${tribeColorMap[portrait.tribe] || "transparent"}50`,
      }}
    >
      <img
        src={portrait.image}
        alt={portrait.name}
        className="w-full h-full object-cover object-top"
      />
    </span>
  </span>
);

// Render paragraph text with character portraits injected inline
function renderParagraphWithPortraits(text: string): ReactNode {
  const matches: { name: string; portrait: CharacterPortrait; start: number; end: number }[] = [];
  const seen = new Set<string>();
  const sortedNames = Object.keys(characterPortraits).sort((a, b) => b.length - a.length);

  for (const name of sortedNames) {
    let searchFrom = 0;
    while (true) {
      const idx = text.indexOf(name, searchFrom);
      if (idx === -1) break;
      const overlaps = matches.some((m) => idx >= m.start && idx < m.end);
      if (!overlaps) {
        const portrait = characterPortraits[name];
        const portraitKey = portrait.name;
        const showPortrait = !seen.has(portraitKey);
        if (showPortrait) seen.add(portraitKey);
        matches.push({ name, portrait, start: idx, end: idx + name.length });
      }
      searchFrom = idx + name.length;
      break;
    }
  }

  if (matches.length === 0) return text;
  matches.sort((a, b) => a.start - b.start);

  const parts: ReactNode[] = [];
  let lastIdx = 0;

  for (const match of matches) {
    if (match.start > lastIdx) parts.push(text.slice(lastIdx, match.start));
    parts.push(
      <Fragment key={match.start}>
        <InlinePortrait portrait={match.portrait} />
        <strong
          className="font-heading text-[0.95em]"
          style={{ color: tribeColorMap[match.portrait.tribe] || "hsl(var(--foreground) / 0.7)" }}
        >
          {match.name}
        </strong>
      </Fragment>
    );
    lastIdx = match.end;
  }

  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return <>{parts}</>;
}

// ─── Reading Progress Bar ───
const ReadingProgress = () => {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return <motion.div className="lore-progress-bar" style={{ width }} />;
};

// ─── Chapter Divider ───
const ChapterDivider = ({ color }: { color: string }) => (
  <div className="lore-chapter-divider">
    <span
      className="w-2 h-2 rotate-45 flex-shrink-0"
      style={{ background: color, opacity: 0.4 }}
    />
  </div>
);

// ─── Volume Selector Cards ───
const VolumeSelectorCard = ({
  vol,
  isActive,
  onClick,
  accentColor,
}: {
  vol: (typeof volumeLabels)[number];
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
}) => (
  <button
    onClick={onClick}
    className={`lore-volume-card flex flex-col items-center justify-center px-5 py-4 min-w-[130px] md:min-w-[150px] cursor-pointer ${
      isActive ? "active" : ""
    }`}
  >
    <span
      className="font-display text-lg md:text-xl transition-colors duration-300"
      style={{ color: isActive ? accentColor : "hsl(var(--foreground) / 0.2)" }}
    >
      {vol.roman}
    </span>
    <span
      className={`font-body text-[9px] md:text-[10px] tracking-[0.15em] uppercase mt-1.5 transition-colors duration-300 ${
        isActive ? "text-foreground/70" : "text-muted-foreground/60"
      }`}
    >
      {vol.label}
    </span>
    {isActive && (
      <motion.div
        layoutId="volumeIndicator"
        className="w-8 h-0.5 mt-2 rounded-full"
        style={{ background: accentColor }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
  </button>
);

const Lore = () => {
  const [activeVolume, setActiveVolume] = useState(1);
  const mainRef = useRef<HTMLElement>(null);

  const activeChapters = useMemo(() => {
    if (activeVolume === 0) return [];
    return volumes.filter((v) => v.volumeNum === activeVolume);
  }, [activeVolume]);

  const currentBg = volumeBackgrounds[activeVolume] || bgAppendices;
  const accentColor = volumeAccentColors[activeVolume] || "hsl(var(--foreground) / 0.3)";

  // Scroll to top on volume change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeVolume]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ReadingProgress />

      {/* Full-bleed background layer with parallax */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVolume}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={currentBg}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/80" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
            {/* Accent color wash */}
            <div
              className="absolute inset-0 mix-blend-soft-light opacity-30"
              style={{ background: `radial-gradient(ellipse at 50% 30%, ${accentColor}, transparent 70%)` }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Hero ─── */}
      <section className="relative z-10 pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-foreground/15" />
            <span className="font-body text-muted-foreground tracking-[0.6em] text-[9px] uppercase">
              The Complete History of Aethara
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-foreground/15" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-display text-6xl md:text-9xl text-foreground mb-10"
            style={{ textShadow: `0 0 80px ${accentColor}` }}
          >
            THE LOREBOOK
          </motion.h1>

          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="max-w-xl mx-auto"
          >
            <p className="text-foreground/40 text-sm md:text-base italic leading-[1.9] font-light">
              "{lorebookEpigraph.quote}"
            </p>
            <footer className="mt-4 text-foreground/20 text-[10px] tracking-[0.2em] uppercase not-italic">
              — {lorebookEpigraph.attribution}
            </footer>
          </motion.blockquote>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-5 h-8 mx-auto rounded-full border border-foreground/15 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-2 rounded-full bg-foreground/30" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Volume Navigation ─── */}
      <div className="sticky top-16 z-40 bg-background/70 backdrop-blur-xl border-b border-foreground/5">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide justify-center">
            {volumeLabels.map((vol) => (
              <VolumeSelectorCard
                key={vol.num}
                vol={vol}
                isActive={activeVolume === vol.num}
                onClick={() => setActiveVolume(vol.num)}
                accentColor={volumeAccentColors[vol.num]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <main ref={mainRef} className="relative z-10 container mx-auto px-6 py-16 md:py-28">
        <AnimatePresence mode="wait">
          {activeVolume > 0 ? (
            <motion.div
              key={activeVolume}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl mx-auto"
            >
              {/* Volume header */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-center mb-20 md:mb-28"
              >
                <span
                  className="font-display text-6xl md:text-8xl opacity-10 block mb-2"
                  style={{ color: accentColor }}
                >
                  {volumeLabels.find((v) => v.num === activeVolume)?.roman}
                </span>
                <p className="font-body text-foreground/15 tracking-[0.5em] text-[9px] uppercase mb-4">
                  Volume {activeVolume}
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-foreground/90">
                  {volumeLabels.find((v) => v.num === activeVolume)?.label.toUpperCase()}
                </h2>
                <div
                  className="w-16 h-0.5 mx-auto mt-6 rounded-full"
                  style={{ background: accentColor, opacity: 0.5 }}
                />
              </motion.div>

              {/* Chapters */}
              {activeChapters.map((chapter, ci) => (
                <article key={chapter.id} className="mb-24 md:mb-32">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, delay: ci * 0.05 }}
                  >
                    {/* Chapter title */}
                    <h3 className="font-display text-2xl md:text-4xl text-foreground mb-10 tracking-wide">
                      {chapter.title}
                    </h3>

                    {/* Paragraphs with drop cap on first */}
                    {chapter.content.map((para, pi) => (
                      <motion.p
                        key={pi}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.5, delay: pi * 0.03 }}
                        className={`text-foreground/55 text-[15px] md:text-base leading-[2] mb-6 ${
                          pi === 0 ? "lore-drop-cap text-foreground/60" : ""
                        }`}
                      >
                        {renderParagraphWithPortraits(para)}
                      </motion.p>
                    ))}

                    {/* Subsections */}
                    {chapter.subsections?.map((sub, si) => (
                      <motion.div
                        key={si}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lore-subsection my-10"
                        style={{
                          borderImage: `linear-gradient(to bottom, ${accentColor}, transparent) 1`,
                        }}
                      >
                        <h4 className="font-heading text-lg md:text-xl text-foreground/80 mb-6">
                          {sub.title}
                        </h4>
                        {sub.content.map((para, pi) => (
                          <motion.p
                            key={pi}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: pi * 0.03 }}
                            className="text-foreground/50 text-[15px] md:text-base leading-[2] mb-5"
                          >
                            {renderParagraphWithPortraits(para)}
                          </motion.p>
                        ))}
                      </motion.div>
                    ))}

                    {/* Chapter quote */}
                    {chapter.quote && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lore-quote-block"
                      >
                        <p className="italic text-foreground/35 text-sm leading-[1.9] relative z-10">
                          {chapter.quote}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>

                  {ci < activeChapters.length - 1 && (
                    <ChapterDivider color={accentColor} />
                  )}
                </article>
              ))}

              {/* Epilogue at end of Vol 6 */}
              {activeVolume === 6 && (
                <motion.article
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="mt-24 md:mt-32 pt-16"
                >
                  <div className="lore-chapter-divider mb-12">
                    <span className="w-3 h-3 rotate-45 flex-shrink-0 bg-foreground/10" />
                  </div>
                  <p className="font-body text-foreground/15 tracking-[0.5em] text-[9px] uppercase mb-4 text-center">
                    Epilogue
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl text-foreground/90 mb-12 text-center">
                    THE WORLD TODAY
                  </h3>
                  {epilogue.map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.03 }}
                      className={`text-[15px] md:text-base leading-[2] mb-6 ${
                        para.length < 30
                          ? "text-foreground/60 font-heading text-center text-lg my-10"
                          : "text-foreground/50"
                      }`}
                    >
                      {renderParagraphWithPortraits(para)}
                    </motion.p>
                  ))}
                </motion.article>
              )}
            </motion.div>
          ) : (
            /* ─── Appendices ─── */
            <motion.div
              key="appendices"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              {/* Timeline */}
              <section className="mb-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-14"
                >
                  <h2 className="font-display text-3xl md:text-5xl text-foreground/90 mb-3">
                    TIMELINE OF AETHARA
                  </h2>
                  <div className="w-12 h-0.5 mx-auto bg-foreground/10 rounded-full" />
                </motion.div>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 md:left-[88px] top-0 bottom-0 w-px bg-gradient-to-b from-foreground/10 via-foreground/5 to-transparent" />

                  {timelineAppendix.map((entry, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.5, delay: i * 0.04 }}
                      className="relative grid grid-cols-[40px_1fr] md:grid-cols-[90px_90px_1fr] gap-4 md:gap-6 py-6 group"
                    >
                      {/* Dot */}
                      <div className="flex justify-center pt-1.5 md:col-start-1">
                        <div className="lore-timeline-dot" />
                      </div>

                      <div className="hidden md:block">
                        <span className="font-heading text-xs text-foreground/50 group-hover:text-foreground/70 transition-colors">
                          {entry.era}
                        </span>
                        <span className="block font-body text-[10px] text-foreground/20 mt-0.5">
                          {entry.duration}
                        </span>
                      </div>

                      <div>
                        <span className="md:hidden font-heading text-xs text-foreground/50 block mb-1">
                          {entry.era}
                        </span>
                        <span className="text-foreground/45 text-sm leading-relaxed group-hover:text-foreground/60 transition-colors">
                          {entry.events}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Glossary */}
              <section className="mb-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-14"
                >
                  <h2 className="font-display text-3xl md:text-5xl text-foreground/90 mb-3">
                    GLOSSARY
                  </h2>
                  <p className="text-foreground/25 text-xs tracking-[0.2em] uppercase">
                    Terms of the Shattered World
                  </p>
                  <div className="w-12 h-0.5 mx-auto mt-4 bg-foreground/10 rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {glossary.map((entry, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.4, delay: i * 0.02 }}
                      className="lore-glossary-card rounded-sm"
                    >
                      <dt className="font-heading text-sm text-foreground/75 mb-1.5">
                        {entry.term}
                      </dt>
                      <dd className="text-foreground/35 text-xs leading-relaxed">
                        {entry.definition}
                      </dd>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Character Index */}
              <section>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-14"
                >
                  <h2 className="font-display text-3xl md:text-5xl text-foreground/90 mb-3">
                    CHARACTER INDEX
                  </h2>
                  <p className="text-foreground/25 text-xs tracking-[0.2em] uppercase">
                    All 54 champions, organized by tribe
                  </p>
                  <div className="w-12 h-0.5 mx-auto mt-4 bg-foreground/10 rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {tribeRosters.map((roster) => (
                    <motion.div
                      key={roster.tribe}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className={`rounded-sm overflow-hidden border border-foreground/5 bg-gradient-to-br ${
                        tribeGradientMap[roster.color] || "from-card/40 to-transparent"
                      }`}
                    >
                      {/* Tribe header */}
                      <div className="px-6 py-5 border-b border-foreground/5">
                        <h3
                          className="font-display text-xl"
                          style={{ color: tribeColorMap[roster.color] || "hsl(var(--foreground) / 0.7)" }}
                        >
                          {roster.tribe}
                        </h3>
                        <span className="text-foreground/20 text-[10px] font-body uppercase tracking-[0.2em]">
                          {roster.element}
                        </span>
                      </div>

                      {/* Characters */}
                      <div className="px-4 py-2">
                        {roster.characters.map((char, i) => {
                          const portrait = characterPortraits[char.name];
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: i * 0.02 }}
                              className="flex items-center gap-3 py-2.5 border-b border-foreground/3 last:border-b-0 group hover:bg-foreground/[0.02] px-2 rounded-sm transition-colors"
                            >
                              {portrait ? (
                                <span
                                  className="w-9 h-9 rounded-full overflow-hidden border flex-shrink-0 transition-all duration-300 group-hover:scale-105"
                                  style={{
                                    borderColor: `${tribeColorMap[roster.color]}40`,
                                    boxShadow: `0 0 8px ${tribeColorMap[roster.color]}20`,
                                  }}
                                >
                                  <img
                                    src={portrait.image}
                                    alt={char.name}
                                    className="w-full h-full object-cover object-top"
                                  />
                                </span>
                              ) : (
                                <span
                                  className="w-9 h-9 rounded-full flex-shrink-0"
                                  style={{ background: `${tribeColorMap[roster.color]}10` }}
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="font-heading text-sm text-foreground/65 block truncate group-hover:text-foreground/80 transition-colors">
                                  {char.name}
                                </span>
                                <span className="text-foreground/25 text-[10px] block truncate">
                                  {char.title}
                                </span>
                              </div>
                              <span className="text-foreground/20 text-[10px] hidden md:block flex-shrink-0 max-w-[120px] truncate">
                                {char.role}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Final quote */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-center mt-24 pt-16"
              >
                <div className="lore-chapter-divider mb-10">
                  <span className="w-2 h-2 rotate-45 flex-shrink-0 bg-foreground/10" />
                </div>
                <p className="text-foreground/20 text-sm italic max-w-xl mx-auto leading-[2]">
                  "Four realms. Four wars. One broken throne. And in the spaces between, two ghosts who cannot forgive what they became."
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.15em] uppercase group"
          >
            <span className="w-4 h-px bg-muted-foreground group-hover:w-8 transition-all" />
            Return to the dominion
          </Link>
        </motion.div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Lore;
