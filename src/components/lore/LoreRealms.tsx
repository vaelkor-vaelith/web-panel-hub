import { motion } from "framer-motion";
import { useState } from "react";
import { realms } from "@/data/loreData";

const LoreRealms = () => {
  const [activeRealm, setActiveRealm] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-16">
        <p className="font-body text-muted-foreground tracking-[0.4em] text-[10px] uppercase mb-3">
          Explore
        </p>
        <h3 className="font-display text-3xl md:text-5xl text-foreground glow-shadow">
          THE FOUR REALMS
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
        {/* Tabs */}
        <div className="space-y-3">
          {realms.map((realm, i) => (
            <motion.button
              key={realm.name}
              onClick={() => setActiveRealm(i)}
              className={`w-full text-left px-5 py-4 transition-all duration-300 border-l-2 ${
                activeRealm === i
                  ? "border-foreground/40 bg-foreground/[0.04]"
                  : "border-transparent hover:border-foreground/10 hover:bg-foreground/[0.02]"
              }`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span
                className="font-display text-sm tracking-wider"
                style={{ color: activeRealm === i ? realm.cssColor : undefined }}
              >
                {realm.name}
              </span>
              <p className="text-[11px] text-muted-foreground mt-1">{realm.tribe}</p>
              {activeRealm === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="text-foreground/30 text-[11px] mt-2 leading-relaxed"
                >
                  {realm.tagline}
                </motion.p>
              )}
            </motion.button>
          ))}
        </div>

        {/* Realm display */}
        <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm">
          {realms.map((realm, i) => (
            <motion.div
              key={realm.name}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: activeRealm === i ? 1 : 0,
                scale: activeRealm === i ? 1 : 1.05,
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <img
                src={realm.image}
                alt={realm.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <motion.div
                  initial={false}
                  animate={{ y: activeRealm === i ? 0 : 20, opacity: activeRealm === i ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h4
                    className="font-display text-2xl md:text-3xl mb-3"
                    style={{ color: realm.cssColor }}
                  >
                    {realm.name}
                  </h4>
                  <p className="text-foreground/45 text-sm leading-relaxed max-w-md">
                    {realm.desc}
                  </p>
                  <div
                    className="mt-4 h-px w-20"
                    style={{
                      background: `linear-gradient(to right, ${realm.cssColor}, transparent)`,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}

          <motion.div
            className="absolute inset-0 pointer-events-none rounded-sm"
            initial={false}
            animate={{
              boxShadow: `inset 0 0 60px ${realms[activeRealm].cssColor}15, 0 0 30px ${realms[activeRealm].cssColor}08`,
            }}
            transition={{ duration: 0.7 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoreRealms;
