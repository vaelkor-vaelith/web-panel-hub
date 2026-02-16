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
  1: bgVol1, 2: bgVol2, 3: bgVol3, 4: bgVol4, 5: bgVol5, 6: bgVol6, 0: bgAppendices,
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

/* ── Single accent: warm amber ── */
const ACCENT = "hsl(30, 60%, 50%)";
const ACCENT_DIM = "hsl(30, 40%, 30%)";

// Inline portrait — minimal, monochrome border
const InlinePortrait = ({ portrait }: { portrait: CharacterPortrait }) => (
  <span className="inline-flex items-center gap-1 mx-0.5 align-middle">
    <span
      className="inline-block w-6 h-6 rounded-full overflow-hidden flex-shrink-0 align-middle"
      style={{ border: `1.5px solid ${ACCENT_DIM}` }}
    >
      <img src={portrait.image} alt={portrait.name} className="w-full h-full object-cover object-top" />
    </span>
  </span>
);

// Render paragraph text with character portraits
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
        <strong className="font-heading text-[0.95em] text-foreground/70">{match.name}</strong>
      </Fragment>
    );
    lastIdx = match.end;
  }

  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return <>{parts}</>;
}

/* ── Reading Progress — single thin amber line ── */
const ReadingProgress = () => {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <motion.div
      className="fixed top-16 left-0 h-[1px] z-[100]"
      style={{ width, background: ACCENT }}
    />
  );
};

/* ── Volume Navigation — minimal horizontal list ── */
const VolumeNav = ({
  activeVolume,
  setActiveVolume,
}: {
  activeVolume: number;
  setActiveVolume: (v: number) => void;
}) => (
  <div className="sticky top-16 z-40 border-b border-foreground/[0.04]" style={{ background: "hsl(0 0% 2% / 0.85)", backdropFilter: "blur(20px)" }}>
    <div className="container mx-auto px-6">
      <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide py-0">
        {volumeLabels.map((vol) => {
          const isActive = activeVolume === vol.num;
          return (
            <button
              key={vol.num}
              onClick={() => setActiveVolume(vol.num)}
              className="relative flex-shrink-0 px-5 py-4 transition-colors duration-300"
              style={{ color: isActive ? ACCENT : "hsl(0 0% 35%)" }}
            >
              <span className="font-display text-[11px] tracking-[0.15em]">
                {vol.roman}
              </span>
              {isActive && (
                <motion.div
                  layoutId="loreNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[1px]"
                  style={{ background: ACCENT }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const Lore = () => {
  const [activeVolume, setActiveVolume] = useState(1);
  const mainRef = useRef<HTMLElement>(null);

  const activeChapters = useMemo(() => {
    if (activeVolume === 0) return [];
    return volumes.filter((v) => v.volumeNum === activeVolume);
  }, [activeVolume]);

  const currentBg = volumeBackgrounds[activeVolume] || bgAppendices;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeVolume]);

  return (
    <div className="min-h-screen" style={{ background: "hsl(0 0% 2%)" }}>
      <Navbar />
      <ReadingProgress />

      {/* ── Fixed background — cinematic, dark ── */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVolume}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img src={currentBg} alt="" className="w-full h-full object-cover" />
            {/* Heavy darken — image is atmosphere, not the star */}
            <div className="absolute inset-0" style={{ background: "hsl(0 0% 2% / 0.88)" }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(0_0%_2%_/_0.6)] to-[hsl(0_0%_2%)]" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Hero — massive, minimal ── */}
      <section className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="font-body tracking-[0.5em] text-[9px] uppercase mb-8"
          style={{ color: ACCENT }}
        >
          The Complete History of Aethara
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-display text-6xl sm:text-8xl md:text-[10rem] leading-[0.85] text-center text-foreground/90"
        >
          THE
          <br />
          LOREBOOK
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="max-w-lg mx-auto mt-12 text-center"
        >
          <p className="text-foreground/30 text-sm italic leading-[2] font-light">
            "{lorebookEpigraph.quote}"
          </p>
          <p className="mt-4 text-[10px] tracking-[0.25em] uppercase" style={{ color: ACCENT_DIM }}>
            — {lorebookEpigraph.attribution}
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke={ACCENT_DIM} strokeWidth="1">
              <path d="M8 4v16M2 14l6 6 6-6" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Volume Navigation ── */}
      <VolumeNav activeVolume={activeVolume} setActiveVolume={setActiveVolume} />

      {/* ── Content ── */}
      <main ref={mainRef} className="relative z-10 container mx-auto px-6 py-20 md:py-32">
        <AnimatePresence mode="wait">
          {activeVolume > 0 ? (
            <motion.div
              key={activeVolume}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              {/* Volume header — bold, centered */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-center mb-24 md:mb-36"
              >
                <span
                  className="font-display text-[8rem] md:text-[12rem] leading-none block"
                  style={{ color: "hsl(0 0% 6%)" }}
                >
                  {volumeLabels.find((v) => v.num === activeVolume)?.roman}
                </span>
                <h2 className="font-display text-2xl md:text-4xl text-foreground/80 -mt-8 md:-mt-12">
                  {volumeLabels.find((v) => v.num === activeVolume)?.label.toUpperCase()}
                </h2>
                <div className="w-8 h-[1px] mx-auto mt-8" style={{ background: ACCENT_DIM }} />
              </motion.div>

              {/* Chapters */}
              {activeChapters.map((chapter, ci) => (
                <article key={chapter.id} className="mb-28 md:mb-40">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: ci * 0.05 }}
                  >
                    {/* Chapter title */}
                    <h3 className="font-display text-xl md:text-3xl text-foreground/85 mb-12 tracking-wide">
                      {chapter.title}
                    </h3>

                    {/* Paragraphs */}
                    {chapter.content.map((para, pi) => (
                      <motion.p
                        key={pi}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.6, delay: pi * 0.03 }}
                        className={`text-foreground/40 text-[15px] leading-[2.1] mb-7 ${
                          pi === 0 ? "lore-drop-cap text-foreground/50" : ""
                        }`}
                      >
                        {renderParagraphWithPortraits(para)}
                      </motion.p>
                    ))}

                    {/* Subsections */}
                    {chapter.subsections?.map((sub, si) => (
                      <motion.div
                        key={si}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-16 mb-12 pl-6"
                        style={{ borderLeft: `1px solid ${ACCENT_DIM}` }}
                      >
                        <h4 className="font-display text-sm md:text-base text-foreground/60 mb-6 tracking-[0.1em]">
                          {sub.title}
                        </h4>
                        {sub.content.map((para, pi) => (
                          <p
                            key={pi}
                            className="text-foreground/35 text-[15px] leading-[2.1] mb-6"
                          >
                            {renderParagraphWithPortraits(para)}
                          </p>
                        ))}
                      </motion.div>
                    ))}

                    {/* Quote */}
                    {chapter.quote && (
                      <motion.blockquote
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="my-16 py-8 px-0 border-l-0 text-center"
                      >
                        <div className="w-4 h-[1px] mx-auto mb-6" style={{ background: ACCENT_DIM }} />
                        <p className="italic text-foreground/25 text-sm leading-[2] max-w-md mx-auto">
                          "{chapter.quote}"
                        </p>
                        <div className="w-4 h-[1px] mx-auto mt-6" style={{ background: ACCENT_DIM }} />
                      </motion.blockquote>
                    )}
                  </motion.div>

                  {/* Chapter separator */}
                  {ci < activeChapters.length - 1 && (
                    <div className="flex justify-center my-20">
                      <div className="w-1 h-1 rounded-full" style={{ background: ACCENT_DIM }} />
                    </div>
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
                  className="mt-32 pt-20"
                >
                  <div className="w-8 h-[1px] mx-auto mb-16" style={{ background: ACCENT_DIM }} />
                  <p className="text-[10px] tracking-[0.4em] uppercase text-center mb-6" style={{ color: ACCENT_DIM }}>
                    Epilogue
                  </p>
                  <h3 className="font-display text-2xl md:text-4xl text-foreground/80 mb-16 text-center">
                    THE WORLD TODAY
                  </h3>
                  {epilogue.map((para, i) => (
                    <p
                      key={i}
                      className={`text-[15px] leading-[2.1] mb-7 ${
                        para.length < 30
                          ? "text-foreground/50 font-display text-center text-lg my-12"
                          : "text-foreground/40"
                      }`}
                    >
                      {renderParagraphWithPortraits(para)}
                    </p>
                  ))}
                </motion.article>
              )}
            </motion.div>
          ) : (
            /* ── Appendices ── */
            <motion.div
              key="appendices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Timeline */}
              <section className="mb-32">
                <div className="text-center mb-20">
                  <h2 className="font-display text-2xl md:text-4xl text-foreground/80 mb-3">
                    TIMELINE
                  </h2>
                  <div className="w-6 h-[1px] mx-auto" style={{ background: ACCENT_DIM }} />
                </div>

                <div className="space-y-0">
                  {timelineAppendix.map((entry, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.5, delay: i * 0.03 }}
                      className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_100px_1fr] gap-6 py-5 border-b border-foreground/[0.04] group"
                    >
                      <span className="font-display text-[11px] tracking-[0.1em]" style={{ color: ACCENT_DIM }}>
                        {entry.era}
                      </span>
                      <span className="hidden md:block text-foreground/15 text-xs">
                        {entry.duration}
                      </span>
                      <span className="text-foreground/35 text-sm leading-relaxed group-hover:text-foreground/50 transition-colors duration-500">
                        {entry.events}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Glossary */}
              <section className="mb-32">
                <div className="text-center mb-20">
                  <h2 className="font-display text-2xl md:text-4xl text-foreground/80 mb-3">
                    GLOSSARY
                  </h2>
                  <div className="w-6 h-[1px] mx-auto" style={{ background: ACCENT_DIM }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                  {glossary.map((entry, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.02 }}
                      className="py-5 border-b border-foreground/[0.04]"
                    >
                      <dt className="font-display text-xs tracking-[0.1em] text-foreground/60 mb-1.5">
                        {entry.term}
                      </dt>
                      <dd className="text-foreground/30 text-sm leading-relaxed">
                        {entry.definition}
                      </dd>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Character Index */}
              <section>
                <div className="text-center mb-20">
                  <h2 className="font-display text-2xl md:text-4xl text-foreground/80 mb-3">
                    CHARACTER INDEX
                  </h2>
                  <p className="text-foreground/15 text-[10px] tracking-[0.3em] uppercase mt-4">
                    54 champions · Four allegiances
                  </p>
                  <div className="w-6 h-[1px] mx-auto mt-6" style={{ background: ACCENT_DIM }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {tribeRosters.map((roster) => (
                    <div key={roster.tribe}>
                      {/* Tribe header */}
                      <div className="mb-6 pb-4 border-b border-foreground/[0.06]">
                        <h3 className="font-display text-base tracking-[0.1em] text-foreground/70">
                          {roster.tribe}
                        </h3>
                        <span className="text-foreground/15 text-[10px] tracking-[0.2em] uppercase">
                          {roster.element}
                        </span>
                      </div>

                      {/* Characters */}
                      <div className="space-y-0">
                        {roster.characters.map((char, i) => {
                          const portrait = characterPortraits[char.name];
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-3 py-2.5 group"
                            >
                              {portrait ? (
                                <span
                                  className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
                                  style={{ border: `1px solid hsl(0 0% 15%)` }}
                                >
                                  <img
                                    src={portrait.image}
                                    alt={char.name}
                                    className="w-full h-full object-cover object-top"
                                  />
                                </span>
                              ) : (
                                <span className="w-7 h-7 rounded-full flex-shrink-0 bg-foreground/[0.03]" />
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="text-sm text-foreground/50 group-hover:text-foreground/70 transition-colors duration-300">
                                  {char.name}
                                </span>
                                <span className="text-foreground/15 text-[10px] block">
                                  {char.title}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Closing */}
              <div className="text-center mt-32">
                <div className="w-6 h-[1px] mx-auto mb-10" style={{ background: ACCENT_DIM }} />
                <p className="text-foreground/15 text-sm italic max-w-md mx-auto leading-[2]">
                  "Four realms. Four wars. One broken throne."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back link */}
        <div className="text-center mt-28">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 group"
            style={{ color: ACCENT_DIM }}
          >
            <span className="w-4 h-[1px] group-hover:w-8 transition-all duration-300" style={{ background: ACCENT_DIM }} />
            Return
          </Link>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Lore;
