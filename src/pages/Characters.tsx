import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { Link } from "react-router-dom";
import { allCards } from "@/data/allCards";
import type { CardData } from "@/data/gameData";
import { tribeIconMap, ShadowIcon, LightIcon, FireIcon, EarthIcon, MythicIcon } from "@/components/TribeIcons";
import TribeParticles from "@/components/TribeParticles";

// Legendary & Mythic (original)
import sylasImg from "@/assets/sylas-dreadhollow.jpg";
import aureliaImg from "@/assets/aurelia-dawnspire.jpg";
import pyraxisImg from "@/assets/pyraxis-unburnt.jpg";
import thornwallImg from "@/assets/thornwall-ancient.jpg";
import vaelkorImg from "@/assets/vaelkor-hollow-crown.jpg";
// Shadow tribe
import lyraImg from "@/assets/cards/lyra-voidstep.jpg";
import rivenImg from "@/assets/cards/riven-ashenmask.jpg";
import thaneImg from "@/assets/cards/thane-gloomveil.jpg";
import miraImg from "@/assets/cards/mira-shadowlace.jpg";
import duskImg from "@/assets/cards/dusk-fadewalker.jpg";
import kaelImg from "@/assets/cards/kael-nightwhisper.jpg";
import nyxImg from "@/assets/cards/nyx-hollowshade.jpg";
import vexImg from "@/assets/cards/vex-inkfinger.jpg";
import shadeImg from "@/assets/cards/shade-vellum.jpg";
import gravesImg from "@/assets/cards/graves-thornwick.jpg";
// Light tribe
import orinImg from "@/assets/cards/orin-crystalward.jpg";
import celestineImg from "@/assets/cards/celestine-brightvow.jpg";
import aldricImg from "@/assets/cards/aldric-shieldborne.jpg";
import seraImg from "@/assets/cards/sera-lightweaver.jpg";
import dorianImg from "@/assets/cards/dorian-prismblade.jpg";
import elaraImg from "@/assets/cards/elara-dawnpetal.jpg";
import tomasImg from "@/assets/cards/tomas-gleamheart.jpg";
import mirielImg from "@/assets/cards/miriel-sunstitch.jpg";
import bramImg from "@/assets/cards/bram-crystaleye.jpg";
import lennaImg from "@/assets/cards/lenna-hallowed.jpg";
import fenricImg from "@/assets/cards/fenric-stoneclad.jpg";
import ivyImg from "@/assets/cards/ivy-luminara.jpg";
// Fire tribe
import crimsonImg from "@/assets/cards/crimson-morrigan.jpg";
import volkarImg from "@/assets/cards/volkar-cinderfist.jpg";
import emberImg from "@/assets/cards/ember-ashvale.jpg";
import scaldImg from "@/assets/cards/scald-blackthorn.jpg";
import asharaImg from "@/assets/cards/ashara-flameveil.jpg";
import brandImg from "@/assets/cards/brand-scorchmark.jpg";
import flintImg from "@/assets/cards/flint-ironblaze.jpg";
import searImg from "@/assets/cards/sear-moltenhand.jpg";
import charImg from "@/assets/cards/char-duskfire.jpg";
import kindleImg from "@/assets/cards/kindle-wraithburn.jpg";
import blazeImg from "@/assets/cards/blaze-hearthcoal.jpg";
// Earth tribe
import gorathImg from "@/assets/cards/gorath-stonehide.jpg";
import willowImg from "@/assets/cards/willow-deeproot.jpg";
import barricImg from "@/assets/cards/barric-ironbark.jpg";
import mossImg from "@/assets/cards/moss-cragborn.jpg";
import rootImg from "@/assets/cards/root-taldris.jpg";
import brambleImg from "@/assets/cards/bramble-thickbough.jpg";
import clayImg from "@/assets/cards/clay-mossfoot.jpg";
import pebbleImg from "@/assets/cards/pebble-cragson.jpg";
import oakleyImg from "@/assets/cards/oakley-deepstride.jpg";
import sageImg from "@/assets/cards/sage-mossmantle.jpg";
// Missing characters
import sableImg from "@/assets/cards/sable-driftmere.jpg";
import whisperImg from "@/assets/cards/whisper.jpg";
import cinderImg from "@/assets/cards/cinder-voss.jpg";
import petraImg from "@/assets/cards/petra-stoneweave.jpg";
import fernImg from "@/assets/cards/fern-willowbend.jpg";
// Tokens
import beastImg from "@/assets/cards/beast.jpg";
import seedlingImg from "@/assets/cards/seedling.jpg";
// Mythic
import vaelithImg from "@/assets/cards/vaelith-shattered-memory.jpg";

const cardImages: Record<string, string> = {
  "OV-L-01": sylasImg, "OV-E-01": lyraImg, "OV-E-02": rivenImg,
  "OV-R-01": thaneImg, "OV-R-02": miraImg, "OV-R-03": duskImg,
  "OV-C-01": kaelImg, "OV-C-02": nyxImg, "OV-C-03": vexImg,
  "OV-C-04": shadeImg, "OV-C-05": whisperImg, "OV-C-06": gravesImg, "OV-C-07": sableImg,
  "RS-L-01": aureliaImg, "RS-E-01": orinImg, "RS-E-02": celestineImg,
  "RS-R-01": aldricImg, "RS-R-02": seraImg, "RS-R-03": dorianImg,
  "RS-C-01": elaraImg, "RS-C-02": tomasImg, "RS-C-03": mirielImg,
  "RS-C-04": bramImg, "RS-C-05": lennaImg, "RS-C-06": fenricImg, "RS-C-07": ivyImg,
  "EP-L-01": pyraxisImg, "EP-E-01": crimsonImg, "EP-E-02": volkarImg,
  "EP-R-01": emberImg, "EP-R-02": scaldImg, "EP-R-03": asharaImg,
  "EP-C-01": cinderImg, "EP-C-02": brandImg, "EP-C-03": flintImg, "EP-C-04": searImg,
  "EP-C-05": charImg, "EP-C-06": kindleImg, "EP-C-07": blazeImg,
  "IB-L-01": thornwallImg, "IB-E-01": gorathImg, "IB-E-02": willowImg,
  "IB-R-01": barricImg, "IB-R-02": mossImg, "IB-R-03": petraImg,
  "IB-C-01": rootImg, "IB-C-02": brambleImg, "IB-C-03": clayImg,
  "IB-C-04": fernImg, "IB-C-05": pebbleImg, "IB-C-06": oakleyImg, "IB-C-07": sageImg,
  "MY-M-01": vaelkorImg, "MY-M-02": vaelithImg,
  "TK-BEAST": beastImg, "TK-SEEDLING": seedlingImg,
};

const tribeFilters = [
  { label: "All", value: "all", Icon: null },
  { label: "Obsidian Veil", value: "Obsidian Veil", color: "text-shadow-glow", Icon: ShadowIcon },
  { label: "Radiant Sanctum", value: "Radiant Sanctum", color: "text-light-glow", Icon: LightIcon },
  { label: "Emberheart Pact", value: "Emberheart Pact", color: "text-fire-glow", Icon: FireIcon },
  { label: "Ironroot Bastion", value: "Ironroot Bastion", color: "text-earth-glow", Icon: EarthIcon },
  { label: "Mythic", value: "Tribeless", color: "text-foreground/50", Icon: MythicIcon },
];

const rarityFilters = [
  { label: "All", value: "all" },
  { label: "Common", value: "common" },
  { label: "Rare", value: "rare" },
  { label: "Epic", value: "epic" },
  { label: "Legendary", value: "legendary" },
  { label: "Mythic", value: "mythic" },
  { label: "Token", value: "token" },
];

const tribeAccent: Record<string, { text: string; border: string; bg: string }> = {
  "Obsidian Veil": { text: "text-shadow-glow", border: "border-shadow/15", bg: "bg-shadow/5" },
  "Radiant Sanctum": { text: "text-light-glow", border: "border-light/15", bg: "bg-light/5" },
  "Emberheart Pact": { text: "text-fire-glow", border: "border-fire/15", bg: "bg-fire/5" },
  "Ironroot Bastion": { text: "text-earth-glow", border: "border-earth/15", bg: "bg-earth/5" },
  "Tribeless": { text: "text-foreground/60", border: "border-foreground/10", bg: "bg-foreground/5" },
};

const tribeBarGradient: Record<string, { atk: string; hp: string }> = {
  "Obsidian Veil": { atk: "bg-gradient-to-r from-purple-900 to-purple-500", hp: "bg-gradient-to-r from-purple-950 to-purple-700" },
  "Radiant Sanctum": { atk: "bg-gradient-to-r from-amber-700 to-yellow-400", hp: "bg-gradient-to-r from-amber-800 to-yellow-500" },
  "Emberheart Pact": { atk: "bg-gradient-to-r from-red-900 to-orange-500", hp: "bg-gradient-to-r from-red-950 to-red-600" },
  "Ironroot Bastion": { atk: "bg-gradient-to-r from-green-900 to-emerald-500", hp: "bg-gradient-to-r from-green-950 to-emerald-600" },
  "Tribeless": { atk: "bg-gradient-to-r from-slate-700 to-slate-400", hp: "bg-gradient-to-r from-slate-800 to-slate-500" },
};

// Map summoner IDs to their token IDs
const summonerToToken: Record<string, string> = {
  "IB-E-02": "TK-SEEDLING", // Willow -> Seedling
  "IB-R-02": "TK-BEAST",    // Moss -> Beast
};

const tokenIds = new Set(Object.values(summonerToToken));

const CharacterCard = ({ card, index }: { card: CardData; index: number }) => {
  const isToken = card.rarity === "token";
  const colors = tribeAccent[card.tribe] || tribeAccent["Tribeless"];
  const img = cardImages[card.id];
  const TribeIcon = tribeIconMap[card.tribe];
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "#0a0a0a",
      });
      const fileName = `${card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, [card.name]);

  const tribeName = card.tribe as "Obsidian Veil" | "Radiant Sanctum" | "Emberheart Pact" | "Ironroot Bastion" | "Tribeless";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.5) }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.25 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`comic-panel border group overflow-hidden relative ${isToken ? "border-earth/25" : "border-border"}`}
    >
      {/* Tribe particles on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[1] pointer-events-none"
          >
            <TribeParticles tribe={tribeName} count={10} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="absolute top-2 left-2 z-20 p-1.5 bg-background/80 backdrop-blur-sm border border-foreground/10 text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
        title="Download card as PNG"
      >
        <Download size={12} />
      </button>

      <div ref={cardRef} className="relative z-10 bg-card">
        {/* Image with tribe tag */}
        {img ? (
          <div className={`relative ${isToken ? "h-32" : "h-44"} overflow-hidden`}>
            <motion.img
              src={img}
              alt={card.name}
              className="w-full h-full object-cover object-top"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            {/* Tribe tag - top right */}
            <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-background/80 backdrop-blur-sm border ${colors.border}`}>
              {isToken && <span className="font-body text-[7px] uppercase tracking-[0.15em] text-earth-glow/70 mr-0.5">⬡</span>}
              {TribeIcon && <span className={colors.text}><TribeIcon size={10} /></span>}
              <span className={`font-body text-[8px] uppercase tracking-[0.15em] ${colors.text}`}>
                {isToken ? "Token" : card.tribe === "Tribeless" ? "Mythic" : card.tribe.split(" ")[0]}
              </span>
            </div>
          </div>
        ) : (
          <div className={`h-20 flex items-center justify-center ${colors.bg}`}>
            {TribeIcon && (
              <span className={`${colors.text} opacity-30`}>
                <TribeIcon size={32} />
              </span>
            )}
          </div>
        )}

        <div className={`${isToken ? "p-3 space-y-2" : "p-4 space-y-2.5"}`}>
          {/* Name + Cost */}
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-display ${isToken ? "text-xs" : "text-sm"} leading-tight ${colors.text}`}>{card.name}</h3>
            <span className="bg-foreground/5 text-foreground/40 font-display text-[10px] px-1.5 py-0.5 shrink-0 border border-foreground/10">
              {card.cost}
            </span>
          </div>

          {/* Title */}
          <p className="text-[10px] text-muted-foreground font-body tracking-[0.1em] uppercase leading-snug">{card.title}</p>

          {/* Stats bars */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-body text-[9px] uppercase tracking-wider text-foreground/40 w-7">ATK</span>
              <div className="flex-1 h-2 bg-foreground/5 border border-foreground/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${tribeBarGradient[card.tribe]?.atk || 'bg-foreground/20'}`}
                  style={{ width: `${(card.atk / 9) * 100}%` }}
                />
              </div>
              <span className="font-display text-[10px] text-foreground/50 w-4 text-right">{card.atk}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-[9px] uppercase tracking-wider text-foreground/40 w-7">HP</span>
              <div className="flex-1 h-2 bg-foreground/5 border border-foreground/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${tribeBarGradient[card.tribe]?.hp || 'bg-foreground/20'}`}
                  style={{ width: `${(card.hp / 9) * 100}%` }}
                />
              </div>
              <span className="font-display text-[10px] text-foreground/50 w-4 text-right">{card.hp}</span>
            </div>
            <div className="flex justify-end">
              <span className={`font-body text-[9px] uppercase tracking-[0.15em] ${colors.text} opacity-60`}>{card.rarity.toUpperCase()}</span>
            </div>
          </div>

          {/* Ability - always visible */}
          <div className="bg-muted/40 p-2.5 border border-border space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-[10px] text-foreground/60">{card.abilityName}</span>
              <span className="text-muted-foreground text-[9px]">· {card.abilityType}</span>
            </div>
            <p className="text-foreground/50 text-[11px] leading-relaxed">
              {card.abilityDesc}
            </p>
          </div>

          {/* Quote - always visible */}
          <blockquote className="italic text-[10px] text-muted-foreground border-l border-foreground/10 pl-2 leading-relaxed">
            "{card.quote}"
          </blockquote>
        </div>
      </div>
    </motion.div>
  );
};

// Stacked summoner + token card
const SummonerWithToken = ({ summoner, token, index }: { summoner: CardData; token: CardData; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const tokenImg = cardImages[token.id];
  const colors = tribeAccent[token.tribe] || tribeAccent["Tribeless"];

  return (
    <div className="relative">
      {/* The summoner card */}
      <CharacterCard card={summoner} index={index} />

      {/* Token tab peeking from the right - collapsed state */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute top-3 -right-3 z-30 cursor-pointer"
            onClick={() => setExpanded(true)}
            title={`Click to reveal ${token.name}`}
          >
            <div className="relative w-[52px] h-[72px] border border-earth/30 bg-card shadow-lg shadow-black/50 overflow-hidden group/token hover:border-earth/60 transition-colors">
              {tokenImg ? (
                <img src={tokenImg} alt={token.name} className="w-full h-full object-cover object-top" />
              ) : (
                <div className={`w-full h-full ${colors.bg} flex items-center justify-center`}>
                  <span className="text-earth-glow/40 text-[8px] font-display">TK</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-1 left-0 right-0 text-center">
                <span className="font-display text-[6px] text-earth-glow/80 uppercase tracking-wider">{token.name}</span>
              </div>
              {/* Pulse indicator */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-earth-glow/60 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded token card - slides out below */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden cursor-pointer"
            onClick={() => setExpanded(false)}
          >
            <div className="relative">
              {/* Connector line */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-px h-2 bg-earth/30" />
              <div className="scale-[0.92] origin-top">
                <CharacterCard card={token} index={index + 0.5} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const Characters = () => {
  const [tribeFilter, setTribeFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Build a lookup of token cards by ID
  const tokenCardMap = useMemo(() => {
    const map: Record<string, CardData> = {};
    allCards.forEach(c => { if (tokenIds.has(c.id)) map[c.id] = c; });
    return map;
  }, []);

  const filtered = useMemo(() => {
    return allCards.filter((c) => {
      // Skip tokens from main list - they render stacked with summoners
      if (tokenIds.has(c.id)) return false;
      if (tribeFilter !== "all" && c.tribe !== tribeFilter) return false;
      if (rarityFilter !== "all" && c.rarity !== rarityFilter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tribeFilter, rarityFilter, search]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background tribe particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <TribeParticles mixed count={40} />
      </div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 flex items-center justify-between h-14">
          <Link to="/" className="font-display text-xs tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors">
            THE SHATTERED DOMINION
          </Link>
          <span className="font-body text-muted-foreground text-xs">{filtered.length} / {allCards.length}</span>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="font-body text-muted-foreground tracking-[0.4em] text-[10px] uppercase mb-3">All 54 Warriors of Aethara</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground">CHARACTER ROSTER</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <input
            type="text"
            placeholder="Search characters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md mx-auto block bg-muted border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/20 transition-colors font-body"
          />

          <div className="flex flex-wrap justify-center gap-2">
            {tribeFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setTribeFilter(f.value)}
                className={`font-body text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
                  tribeFilter === f.value
                    ? "border-foreground/30 text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/15"
                }`}
              >
                {f.Icon && <f.Icon size={12} />}
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {rarityFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setRarityFilter(f.value)}
                className={`font-body text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border transition-all ${
                  rarityFilter === f.value
                    ? "border-foreground/30 text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/15"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {filtered.map((card, i) => {
                const tokenId = summonerToToken[card.id];
                const tokenCard = tokenId ? tokenCardMap[tokenId] : null;
                if (tokenCard) {
                  return <SummonerWithToken key={card.id} summoner={card} token={tokenCard} index={i} />;
                }
                return <CharacterCard key={card.id} card={card} index={i} />;
              })}
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground font-body text-sm py-20"
            >
              No characters match your filters.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Characters;
