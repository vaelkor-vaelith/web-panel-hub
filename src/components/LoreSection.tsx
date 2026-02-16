import { motion } from "framer-motion";
import { useRef } from "react";
import LoreTimeline from "@/components/lore/LoreTimeline";
import LoreTwins from "@/components/lore/LoreTwins";
import LoreRealms from "@/components/lore/LoreRealms";

const LoreSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="lore" ref={sectionRef} className="relative">
      <div className="comic-divider mb-0" />

      <div className="relative w-full overflow-hidden bg-background">
        <div className="relative z-10 container mx-auto px-6 py-32 md:py-44">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6"
          >
            <p className="font-body text-muted-foreground tracking-[0.5em] text-[10px] uppercase mb-4">
              The World of Aethara
            </p>
            <h2 className="font-display text-6xl md:text-8xl text-foreground glow-shadow">
              THE LORE
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-24 md:mb-32"
          >
            A shattered world. Four warring tribes. One throne that broke reality itself.
          </motion.p>

          {/* Timeline */}
          <LoreTimeline />

          {/* The Twins - emotional centerpiece */}
          <LoreTwins />

          {/* Realm showcase */}
          <LoreRealms />
        </div>
      </div>
    </section>
  );
};

export default LoreSection;
