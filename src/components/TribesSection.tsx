import { motion } from "framer-motion";
import { tribes } from "@/data/gameData";
import { tribeIdIconMap } from "@/components/TribeIcons";
import TribalAdvantageCycle from "@/components/TribalAdvantageCycle";
import castleObsidian from "@/assets/castle-obsidian-veil.jpg";
import castleRadiant from "@/assets/castle-radiant-sanctum.jpg";
import castleEmberheart from "@/assets/castle-emberheart-pact.jpg";
import castleIronroot from "@/assets/castle-ironroot-bastion.jpg";

const tribeColors: Record<string, { text: string; accent: string; glow: string }> = {
  "obsidian-veil": { text: "text-shadow-glow", accent: "border-shadow/30", glow: "shadow-[0_0_60px_-15px_hsl(var(--shadow))]" },
  "radiant-sanctum": { text: "text-light-glow", accent: "border-light/30", glow: "shadow-[0_0_60px_-15px_hsl(var(--light))]" },
  "emberheart-pact": { text: "text-fire-glow", accent: "border-fire/30", glow: "shadow-[0_0_60px_-15px_hsl(var(--fire))]" },
  "ironroot-bastion": { text: "text-earth-glow", accent: "border-earth/30", glow: "shadow-[0_0_60px_-15px_hsl(var(--earth))]" },
};

const castleImages: Record<string, string> = {
  "obsidian-veil": castleObsidian,
  "radiant-sanctum": castleRadiant,
  "emberheart-pact": castleEmberheart,
  "ironroot-bastion": castleIronroot,
};

const TribesSection = () => {
  return (
    <section id="tribes" className="py-24 relative">
      <div className="comic-divider mb-24" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="font-body text-muted-foreground tracking-[0.4em] text-[10px] uppercase mb-3">Choose Your Allegiance</p>
          <h2 className="font-display text-5xl md:text-7xl text-foreground">THE FOUR TRIBES</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm">
            Four civilizations rose from the ashes of The Shattering, each claiming dominion over their fragment of the old world.
          </p>
        </motion.div>

        <div className="space-y-40">
          {tribes.map((tribe, i) => {
            const colors = tribeColors[tribe.id];
            const IconComponent = tribeIdIconMap[tribe.id];
            const castle = castleImages[tribe.id];
            const isEven = i % 2 === 0;

            return (
              <motion.div
                key={tribe.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
                className="relative w-full overflow-hidden"
              >
                {/* Full-width background: castle image positioned to one side, fading to dark */}
                <div className={`absolute inset-0 ${isEven ? '' : 'flex justify-end'}`}>
                  <img
                    src={castle}
                    alt={`${tribe.name} stronghold`}
                    className={`h-full w-2/3 md:w-1/2 object-cover ${isEven ? '' : ''}`}
                    style={{ objectPosition: isEven ? 'center' : 'center' }}
                  />
                  {/* Fade overlay: dark side where text lives */}
                  <div className={`absolute inset-0 ${
                    isEven
                      ? 'bg-gradient-to-r from-transparent via-background/70 to-background'
                      : 'bg-gradient-to-l from-transparent via-background/70 to-background'
                  }`} />
                  {/* Top/bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
                  {/* Radial vignette */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background))_85%)]" />
                </div>

                {/* Content layer */}
                <div className={`relative z-10 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center min-h-[400px] md:min-h-[450px]`}>
                  {/* Spacer for the image side */}
                  <div className="w-full md:w-1/2" />

                  {/* Info on the dark side */}
                  <div className="w-full md:w-1/2 space-y-5 p-8 md:p-12">
                    <div className="flex items-center gap-4">
                      {IconComponent && (
                        <span className={`${colors.text} opacity-70`}>
                          <IconComponent size={40} />
                        </span>
                      )}
                      <div>
                        <h3 className={`font-display text-3xl md:text-4xl ${colors.text}`}>{tribe.name}</h3>
                        <p className="font-body text-[10px] text-muted-foreground tracking-[0.3em] uppercase mt-1">
                          {tribe.element} · {tribe.realm}
                        </p>
                      </div>
                    </div>

                    <blockquote className={`italic text-foreground/50 border-l-2 ${colors.accent} pl-4 text-sm leading-relaxed`}>
                      "{tribe.philosophy}"
                    </blockquote>

                    <p className="text-foreground/60 text-sm leading-relaxed">{tribe.lore}</p>

                    <div className="flex flex-wrap gap-4 text-xs pt-2">
                      <span className={`${colors.text} opacity-80`}>
                        ◆ Strength: {tribe.strength}
                      </span>
                      <span className="text-muted-foreground">
                        ◇ Weakness: {tribe.weakness}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <TribalAdvantageCycle />
      </div>
    </section>
  );
};

export default TribesSection;
