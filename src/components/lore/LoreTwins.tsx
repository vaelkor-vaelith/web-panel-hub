import { motion } from "framer-motion";
import { twinsStory } from "@/data/loreData";
import vaelkorImg from "@/assets/vaelkor-hollow-crown.jpg";
import vaelithImg from "@/assets/cards/vaelith-shattered-memory.jpg";

const TwinCard = ({
  twin,
  image,
  align,
  delay,
}: {
  twin: typeof twinsStory.vaelkor;
  image: string;
  align: "left" | "right";
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, delay }}
    className="flex flex-col"
  >
    {/* Portrait */}
    <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-6 group">
      <img
        src={image}
        alt={twin.name}
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-1">
          {twin.subtitle}
        </p>
        <h4 className="font-display text-xl md:text-2xl text-foreground/90">
          {twin.name}
        </h4>
      </div>
    </div>

    {/* Description */}
    <p className="text-foreground/40 text-sm leading-relaxed mb-4">
      {twin.desc}
    </p>

    {/* Quote */}
    <blockquote
      className={`border-l border-foreground/10 pl-4 italic text-foreground/30 text-xs leading-relaxed ${
        align === "right" ? "md:border-l-0 md:border-r md:pl-0 md:pr-4 md:text-right" : ""
      }`}
    >
      "{twin.quote}"
    </blockquote>
  </motion.div>
);

const LoreTwins = () => {
  return (
    <div className="max-w-5xl mx-auto mb-32 md:mb-44">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-6"
      >
        <p className="font-body text-muted-foreground tracking-[0.4em] text-[10px] uppercase mb-3">
          The Echoes
        </p>
        <h3 className="font-display text-3xl md:text-5xl text-foreground glow-shadow">
          THE SHATTERED TWINS
        </h3>
      </motion.div>

      {/* Intro */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center text-foreground/40 text-sm md:text-base max-w-2xl mx-auto mb-16 md:mb-20 leading-relaxed"
      >
        {twinsStory.intro}
      </motion.p>

      {/* Twin cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-16">
        <TwinCard twin={twinsStory.vaelkor} image={vaelkorImg} align="left" delay={0} />
        <TwinCard twin={twinsStory.vaelith} image={vaelithImg} align="right" delay={0.15} />
      </div>

      {/* Closing truth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-center"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-foreground/10 mx-auto mb-6" />
        <p className="text-foreground/30 text-xs md:text-sm max-w-xl mx-auto leading-relaxed italic">
          {twinsStory.closing}
        </p>
      </motion.div>
    </div>
  );
};

export default LoreTwins;
