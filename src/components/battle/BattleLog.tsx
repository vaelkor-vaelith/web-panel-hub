import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BattleLogProps {
  eventLog: string[];
}

function classifyEntry(msg: string): 'phase' | 'deploy' | 'attack' | 'damage' | 'heal' | 'ability' | 'death' | 'win' | 'info' {
  if (msg.startsWith('[') || msg.startsWith('━')) return 'phase';
  if (msg.includes('deployed')) return 'deploy';
  // v1.2 abilities - check before 'damage'/'attack' keywords to avoid misclassification
  if (msg.includes('marks') || msg.includes('silences') || msg.includes('sabotage') || msg.includes('foresees') || msg.includes('blessed') || msg.includes('crystal record')) return 'ability';
  if (msg.includes('attacks') || msg.includes('hits player')) return 'attack';
  if (msg.includes('damage') || msg.includes('deals') || msg.includes('scorched') || msg.includes('flame') || msg.includes('stunned') || msg.includes('petrified')) return 'damage';
  if (msg.includes('heal') || msg.includes('Heal') || msg.includes('restore') || msg.includes('mend') || msg.includes('patched')) return 'heal';
  if (msg.includes('destroyed') || msg.includes('DOMINION') || msg.includes('death')) return 'death';
  if (msg.includes('wins')) return 'win';
  if (msg.includes('shield') || msg.includes('Shield') || msg.includes('inspire') || msg.includes('fortif') || msg.includes('nourish') || msg.includes('strengthen') || msg.includes('buff') || msg.includes('fueled') || msg.includes('cloak') || msg.includes('harden')) return 'ability';
  if (msg.includes('draw') || msg.includes('scrie') || msg.includes('scan') || msg.includes('reveal') || msg.includes('steal') || msg.includes('stolen') || msg.includes('fracture') || msg.includes('Wound') || msg.includes('sprout') || msg.includes('emerges') || msg.includes('returns') || msg.includes('fades')) return 'ability';
  return 'info';
}

function getColor(type: ReturnType<typeof classifyEntry>): string {
  switch (type) {
    case 'phase':    return 'hsl(0 0% 70%)';
    case 'deploy':   return 'hsl(200 40% 72%)';
    case 'attack':   return 'hsl(15 60% 72%)';
    case 'damage':   return 'hsl(0 55% 68%)';
    case 'heal':     return 'hsl(140 45% 65%)';
    case 'ability':  return 'hsl(270 40% 75%)';
    case 'death':    return 'hsl(0 40% 62%)';
    case 'win':      return 'hsl(45 70% 70%)';
    case 'info':
    default:         return 'hsl(0 0% 65%)';
  }
}

const BattleLog = ({ eventLog }: BattleLogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [eventLog]);

  const maxVisible = isMobile ? 6 : 10;
  const visibleLog = eventLog.slice(-maxVisible);
  const total = visibleLog.length;

  return (
    <div
      className="overflow-hidden pl-3"
      style={{
        width: isMobile ? 160 : 220,
        maxHeight: isMobile ? 120 : 160,
      }}
    >
      <div
        ref={scrollRef}
        className="overflow-y-auto h-full"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 90%, transparent 100%)',
        }}
      >
        <div className="flex flex-col justify-end">
        <AnimatePresence initial={false}>
          {visibleLog.map((msg, i) => {
              const globalIndex = eventLog.length - total + i;
              const type = classifyEntry(msg);
              const color = getColor(type);
              const isPhase = type === 'phase';

              // Spotify lyrics progressive sizing
              const distFromEnd = total - 1 - i;
              const isCurrent = distFromEnd === 0;
              const isPrev = distFromEnd === 1;

              const fontSize = isCurrent ? 12
                : isPrev ? 10
                : Math.max(8, 10 - (distFromEnd - 1) * 0.4);

              const opacity = isCurrent ? 1
                : isPrev ? 0.85
                : Math.max(0.4, 0.8 - (distFromEnd - 1) * 0.07);

              const marginBottom = isCurrent ? 0 : 1;
              const marginTop = isCurrent ? 4 : 0;

            return (
              <motion.div
                key={`${globalIndex}-${msg}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{ marginBottom, marginTop }}
                >
                  {isPhase ? (
                    <p
                      className="font-display tracking-[0.12em] uppercase"
                      style={{
                        color,
                        fontSize: Math.min(fontSize, 9),
                        lineHeight: 1.3,
                        paddingTop: 3,
                        paddingBottom: 1,
                      }}
                    >
                      {msg}
                    </p>
                  ) : (
                    <p
                      className="font-body"
                  style={{
                        color,
                        fontSize,
                        lineHeight: 1.35,
                        fontWeight: isCurrent ? 600 : 400,
                        transition: 'font-size 0.25s ease, opacity 0.25s ease',
                  }}
                >
                  {msg}
                </p>
                  )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BattleLog;
