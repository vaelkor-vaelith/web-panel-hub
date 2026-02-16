import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { legendaryCards, mythicCards } from "@/data/gameData";
import type { CardData } from "@/data/gameData";

import sylasImg from "@/assets/sylas-dreadhollow.jpg";
import aureliaImg from "@/assets/aurelia-dawnspire.jpg";
import pyraxisImg from "@/assets/pyraxis-unburnt.jpg";
import thornwallImg from "@/assets/thornwall-ancient.jpg";
import vaelkorImg from "@/assets/vaelkor-hollow-crown.jpg";
import vaelithImg from "@/assets/cards/vaelith-shattered-memory.jpg";

const cardImages: Record<string, string> = {
  "OV-L-01": sylasImg,
  "RS-L-01": aureliaImg,
  "EP-L-01": pyraxisImg,
  "IB-L-01": thornwallImg,
  "MY-M-01": vaelkorImg,
  "MY-M-02": vaelithImg,
};

const tribeAccent: Record<string, string> = {
  "Obsidian Veil": "text-shadow-glow",
  "Radiant Sanctum": "text-light-glow",
  "Emberheart Pact": "text-fire-glow",
  "Ironroot Bastion": "text-earth-glow",
  "Tribeless": "text-foreground/60",
};

const GameCard = ({ card, index }: { card: CardData; index: number }) => {
  const img = cardImages[card.id];
  const accent = tribeAccent[card.tribe] || "text-foreground/60";
  const cardRef = useRef<HTMLDivElement>(null);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 80 }}
      whileHover={{
        scale: 1.04,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.97 }}
      className="group relative overflow-hidden border border-foreground/10 bg-card cursor-pointer"
    >
      {/* Download button */}
      <button
        onClick={handleDownload}
        className="absolute top-2 left-2 z-20 p-1.5 bg-background/80 backdrop-blur-sm border border-foreground/10 text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
        title="Download card as PNG"
      >
        <Download size={14} />
      </button>

      <div ref={cardRef} className="bg-card">
      {/* Card image */}
      {img && (
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={img}
            alt={card.name}
            className="w-full h-full object-cover object-top"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

          {/* Cost badge */}
          <div className="absolute top-3 left-3 w-10 h-10 bg-foreground/10 backdrop-blur-sm border border-foreground/20 text-foreground font-display text-sm flex items-center justify-center">
            {card.cost}
          </div>

          {/* Rarity badge */}
          <div className="absolute top-3 right-3 font-body text-[10px] uppercase tracking-wider px-2 py-1 bg-background/80 border border-border text-muted-foreground">
            {card.rarity}
          </div>
        </div>
      )}

      {/* Card info */}
      <div className="p-5">
        <h4 className={`font-display text-xl ${accent}`}>{card.name}</h4>
        <p className="font-body text-[10px] text-muted-foreground tracking-[0.2em] uppercase mb-3">{card.title}</p>

        {/* Stats */}
        <div className="flex gap-4 mb-3 font-body text-xs text-foreground/50">
          <span>ATK {card.atk}</span>
          <span>HP {card.hp}</span>
        </div>

        {/* Ability */}
        <div className="bg-muted p-3 mb-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{card.abilityType}</span>
            <span className="font-display text-sm text-foreground">{card.abilityName}</span>
          </div>
          <p className="text-xs text-muted-foreground">{card.abilityDesc}</p>
        </div>

        {/* Quote */}
        <blockquote className="italic text-xs text-muted-foreground border-l border-foreground/10 pl-3">
          "{card.quote}"
        </blockquote>
      </div>
      </div>
    </motion.div>
  );
};

const CardShowcase = () => {
  return (
    <section id="champions" className="py-24 relative">
      <div className="comic-divider mb-24" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-muted-foreground tracking-[0.4em] text-[10px] uppercase mb-3">Meet the Legends</p>
          <h2 className="font-display text-5xl md:text-7xl text-foreground">LEGENDARY CHAMPIONS</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm">
            The most powerful warriors of each tribe - those who shape the fate of Aethara.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {legendaryCards.map((card, i) => (
            <GameCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* Mythic section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="font-display text-4xl text-foreground/50">ECHOES OF VAELKOR</h3>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
            Fragments of a broken god. They belong to no tribe, feared by all.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {mythicCards.map((card, i) => (
            <GameCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardShowcase;
