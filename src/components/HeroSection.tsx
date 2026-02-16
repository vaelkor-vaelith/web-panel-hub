import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="The Shattered Dominion"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="font-heading text-muted-foreground tracking-[0.4em] text-xs uppercase mb-4">
            A Card Battle Game
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none mb-6 text-foreground"
        >
          THE SHATTERED
          <br />
          <span className="text-foreground/60">DOMINION</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl mb-10 font-body"
        >
          54 warriors. 4 tribes. 1 shattered world. Build your deck, choose your allegiance,
          and battle for dominion over Aethara.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#tribes"
            className="font-display text-sm bg-foreground text-background px-10 py-4 hover:bg-foreground/80 transition-all hover:scale-105"
          >
            EXPLORE THE TRIBES
          </a>
          <a
            href="#lore"
            className="font-display text-sm border border-foreground/20 text-foreground/70 px-10 py-4 hover:border-foreground/40 hover:text-foreground transition-all"
          >
            READ THE LORE
          </a>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { label: "UNIQUE CARDS", value: "54" },
            { label: "TRIBES", value: "4" },
            { label: "MYTHIC ECHOES", value: "2" },
            { label: "MATCH LENGTH", value: "5-15m" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl text-foreground">
                {stat.value}
              </div>
              <div className="font-heading text-[10px] text-muted-foreground tracking-[0.3em]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroSection;
