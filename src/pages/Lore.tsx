import { useState, useMemo, Fragment, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  { num: 1, label: "The World Before" },
  { num: 2, label: "The Shattering" },
  { num: 3, label: "The Four Tribes" },
  { num: 4, label: "The Eternal War" },
  { num: 5, label: "Legends & Secrets" },
  { num: 6, label: "The Language of War" },
  { num: 0, label: "Appendices" },
];

const tribeColorMap: Record<string, string> = {
  shadow: "hsl(var(--shadow-glow))",
  light: "hsl(var(--light-glow))",
  fire: "hsl(var(--fire-glow))",
  earth: "hsl(var(--earth-glow))",
  mythic: "hsl(var(--mythic-glow))",
};

// Inline portrait component
const InlinePortrait = ({ portrait }: { portrait: CharacterPortrait }) => (
  <span className="inline-flex items-center gap-2 mx-1 align-middle">
    <span
      className="inline-block w-8 h-8 rounded-full overflow-hidden border border-foreground/15 flex-shrink-0 align-middle"
      style={{ boxShadow: `0 0 8px ${tribeColorMap[portrait.tribe] || "transparent"}40` }}
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
  // Find all character name matches and their positions
  const matches: { name: string; portrait: CharacterPortrait; start: number; end: number }[] = [];
  const seen = new Set<string>();

  // Sort keys by length descending to match longer names first
  const sortedNames = Object.keys(characterPortraits).sort((a, b) => b.length - a.length);

  for (const name of sortedNames) {
    let searchFrom = 0;
    while (true) {
      const idx = text.indexOf(name, searchFrom);
      if (idx === -1) break;
      // Check it's not inside an already matched range
      const overlaps = matches.some(
        (m) => idx >= m.start && idx < m.end
      );
      if (!overlaps) {
        const portrait = characterPortraits[name];
        const portraitKey = portrait.name;
        const showPortrait = !seen.has(portraitKey);
        if (showPortrait) seen.add(portraitKey);
        matches.push({
          name,
          portrait,
          start: idx,
          end: idx + name.length,
        });
      }
      searchFrom = idx + name.length;
      break; // Only first occurrence per name
    }
  }

  if (matches.length === 0) return text;

  matches.sort((a, b) => a.start - b.start);

  const parts: ReactNode[] = [];
  let lastIdx = 0;

  for (const match of matches) {
    if (match.start > lastIdx) {
      parts.push(text.slice(lastIdx, match.start));
    }
    parts.push(
      <Fragment key={match.start}>
        <InlinePortrait portrait={match.portrait} />
        <strong className="text-foreground/60">{match.name}</strong>
      </Fragment>
    );
    lastIdx = match.end;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return <>{parts}</>;
}

const Lore = () => {
  const [activeVolume, setActiveVolume] = useState(1);

  const activeChapters = useMemo(() => {
    if (activeVolume === 0) return [];
    return volumes.filter((v) => v.volumeNum === activeVolume);
  }, [activeVolume]);

  const currentBg = volumeBackgrounds[activeVolume] || bgAppendices;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Full-bleed background layer */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVolume}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img
              src={currentBg}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* Heavy dark overlays for readability */}
            <div className="absolute inset-0 bg-background/85" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="container mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="font-body text-muted-foreground tracking-[0.5em] text-[10px] uppercase mb-6"
          >
            The Complete History of Aethara
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-8xl text-foreground glow-shadow mb-8"
          >
            THE LOREBOOK
          </motion.h1>
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-2xl mx-auto text-foreground/30 text-sm md:text-base italic leading-relaxed"
          >
            "{lorebookEpigraph.quote}"
            <footer className="mt-3 text-foreground/20 text-xs not-italic">
              - {lorebookEpigraph.attribution}
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* Volume Navigation */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
            {volumeLabels.map((vol) => (
              <button
                key={vol.num}
                onClick={() => setActiveVolume(vol.num)}
                className={`font-body text-[10px] md:text-xs tracking-[0.15em] uppercase whitespace-nowrap px-4 py-2 transition-all rounded-sm ${
                  activeVolume === vol.num
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground/70"
                }`}
              >
                {vol.num > 0 && (
                  <span className="text-foreground/20 mr-2">{vol.num}.</span>
                )}
                {vol.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-6 py-16 md:py-24">
        <AnimatePresence mode="wait">
          {activeVolume > 0 ? (
            <motion.div
              key={activeVolume}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              {/* Volume header */}
              <div className="text-center mb-16 md:mb-20">
                <p className="font-body text-foreground/20 tracking-[0.4em] text-[10px] uppercase mb-3">
                  Volume {activeVolume}
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-foreground/90">
                  {volumeLabels.find((v) => v.num === activeVolume)?.label.toUpperCase()}
                </h2>
              </div>

              {/* Chapters */}
              {activeChapters.map((chapter, ci) => (
                <article key={chapter.id} className="mb-20 md:mb-28">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: ci * 0.08 }}
                  >
                    <h3 className="font-display text-2xl md:text-3xl text-foreground/85 mb-8">
                      {chapter.title}
                    </h3>

                    {chapter.content.map((para, pi) => (
                      <p
                        key={pi}
                        className="text-foreground/45 text-sm md:text-base leading-[1.85] mb-5"
                      >
                        {renderParagraphWithPortraits(para)}
                      </p>
                    ))}

                    {chapter.subsections?.map((sub, si) => (
                      <div key={si} className="mt-10 mb-8 pl-4 md:pl-6 border-l border-foreground/8">
                        <h4 className="font-heading text-lg md:text-xl text-foreground/70 mb-5">
                          {sub.title}
                        </h4>
                        {sub.content.map((para, pi) => (
                          <p
                            key={pi}
                            className="text-foreground/45 text-sm md:text-base leading-[1.85] mb-5"
                          >
                            {renderParagraphWithPortraits(para)}
                          </p>
                        ))}
                      </div>
                    ))}

                    {chapter.quote && (
                      <blockquote className="border-l border-foreground/15 pl-5 mt-10 italic text-foreground/25 text-sm">
                        "{chapter.quote}"
                      </blockquote>
                    )}
                  </motion.div>

                  {ci < activeChapters.length - 1 && (
                    <div className="w-8 h-px bg-foreground/10 mx-auto mt-16" />
                  )}
                </article>
              ))}

              {/* Epilogue at end of Vol 6 */}
              {activeVolume === 6 && (
                <article className="mt-20 md:mt-28 pt-16 border-t border-foreground/8">
                  <p className="font-body text-foreground/20 tracking-[0.4em] text-[10px] uppercase mb-6 text-center">
                    Epilogue
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground/85 mb-10 text-center">
                    THE WORLD TODAY
                  </h3>
                  {epilogue.map((para, i) => (
                    <p
                      key={i}
                      className={`text-sm md:text-base leading-[1.85] mb-5 ${
                        para.length < 30
                          ? "text-foreground/50 font-heading text-center my-8"
                          : "text-foreground/45"
                      }`}
                    >
                      {renderParagraphWithPortraits(para)}
                    </p>
                  ))}
                </article>
              )}
            </motion.div>
          ) : (
            /* Appendices */
            <motion.div
              key="appendices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              {/* Timeline */}
              <section className="mb-24">
                <h2 className="font-display text-2xl md:text-4xl text-foreground/90 mb-10 text-center">
                  TIMELINE OF AETHARA
                </h2>
                <div className="space-y-0">
                  {timelineAppendix.map((entry, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[120px_1fr] md:grid-cols-[180px_100px_1fr] gap-4 py-5 border-b border-foreground/6"
                    >
                      <span className="font-heading text-sm text-foreground/60">
                        {entry.era}
                      </span>
                      <span className="hidden md:block font-body text-xs text-foreground/30">
                        {entry.duration}
                      </span>
                      <span className="text-foreground/40 text-sm leading-relaxed">
                        {entry.events}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Glossary */}
              <section className="mb-24">
                <h2 className="font-display text-2xl md:text-4xl text-foreground/90 mb-10 text-center">
                  GLOSSARY OF AETHARAN TERMS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                  {glossary.map((entry, i) => (
                    <div key={i} className="py-4 border-b border-foreground/6">
                      <dt className="font-heading text-sm text-foreground/70 mb-1">
                        {entry.term}
                      </dt>
                      <dd className="text-foreground/35 text-xs leading-relaxed">
                        {entry.definition}
                      </dd>
                    </div>
                  ))}
                </div>
              </section>

              {/* Character Index */}
              <section>
                <h2 className="font-display text-2xl md:text-4xl text-foreground/90 mb-10 text-center">
                  CHARACTER INDEX
                </h2>
                <p className="text-center text-foreground/30 text-sm mb-12">
                  All 54 champions, organized by tribe and rarity
                </p>
                {tribeRosters.map((roster) => (
                  <div key={roster.tribe} className="mb-14">
                    <h3
                      className="font-display text-xl md:text-2xl mb-6"
                      style={{ color: tribeColorMap[roster.color] || "hsl(var(--foreground) / 0.7)" }}
                    >
                      {roster.tribe}
                      <span className="text-foreground/20 text-sm ml-3 font-body uppercase tracking-widest">
                        {roster.element}
                      </span>
                    </h3>
                    <div className="space-y-0">
                      {roster.characters.map((char, i) => {
                        // Find portrait for this character
                        const portrait = characterPortraits[char.name];
                        return (
                          <div
                            key={i}
                            className="grid grid-cols-[auto_1fr_1fr] md:grid-cols-[36px_200px_180px_1fr] gap-2 md:gap-4 py-3 border-b border-foreground/5 items-center"
                          >
                            {portrait ? (
                              <span
                                className="w-8 h-8 rounded-full overflow-hidden border border-foreground/10 flex-shrink-0"
                                style={{ boxShadow: `0 0 6px ${tribeColorMap[roster.color]}30` }}
                              >
                                <img
                                  src={portrait.image}
                                  alt={char.name}
                                  className="w-full h-full object-cover object-top"
                                />
                              </span>
                            ) : (
                              <span className="w-8 h-8 rounded-full bg-foreground/5 flex-shrink-0" />
                            )}
                            <span className="font-heading text-sm text-foreground/60">
                              {char.name}
                            </span>
                            <span className="font-body text-xs text-foreground/30 hidden md:block">
                              {char.title}
                            </span>
                            <span className="text-foreground/35 text-xs leading-relaxed">
                              {char.role}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </section>

              {/* Final quote */}
              <div className="text-center mt-20 pt-12 border-t border-foreground/8">
                <p className="text-foreground/20 text-xs md:text-sm italic max-w-xl mx-auto leading-relaxed">
                  "Four realms. Four wars. One broken throne. And in the spaces between, two ghosts who cannot forgive what they became."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to home */}
        <div className="text-center mt-20">
          <Link
            to="/"
            className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase"
          >
            ← Return to the dominion
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
