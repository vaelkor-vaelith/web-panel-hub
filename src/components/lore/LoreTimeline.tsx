import { motion } from "framer-motion";
import { timeline } from "@/data/loreData";

const LoreTimeline = () => {
  return (
    <div className="relative max-w-4xl mx-auto mb-32 md:mb-44">
      {/* Central line */}
      <motion.div
        className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/15 to-transparent md:-translate-x-px"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ transformOrigin: "top" }}
      />

      {timeline.map((event, i) => {
        const isLeft = i % 2 === 0;
        return (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className={`relative flex items-start mb-20 md:mb-24 ${
              isLeft ? "md:flex-row" : "md:flex-row-reverse"
            } flex-row`}
          >
            {/* Node */}
            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
              <motion.div
                className="w-10 h-10 rounded-full border border-foreground/20 bg-background flex items-center justify-center"
                whileInView={{ scale: [0.5, 1.15, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 + 0.2 }}
              >
                <span className="text-foreground/40 text-sm">{event.marker}</span>
              </motion.div>
            </div>

            {/* Content */}
            <div
              className={`ml-16 md:ml-0 md:w-[calc(50%-40px)] ${
                isLeft ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
              }`}
            >
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                {event.era}
              </span>
              <h3 className="font-display text-xl md:text-2xl text-foreground/90 mt-2 mb-3">
                {event.title}
              </h3>
              <p className="text-foreground/45 text-sm leading-relaxed">
                {event.text}
              </p>
            </div>

            {/* Spacer */}
            <div className="hidden md:block md:w-[calc(50%-40px)]" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default LoreTimeline;
