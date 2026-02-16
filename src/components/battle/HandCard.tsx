import { motion } from "framer-motion";
import type { CardInstance } from "@/game/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCardImage } from "@/game/cardImages";

const tribeAccent: Record<string, string> = {
  'Obsidian Veil': '270 40% 50%',
  'Radiant Sanctum': '45 50% 60%',
  'Emberheart Pact': '10 55% 50%',
  'Ironroot Bastion': '140 35% 42%',
  'Tribeless': '0 55% 45%',
};

interface HandCardProps {
  card: CardInstance;
  index: number;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

const HandCard = ({ card, index, isSelected, canAfford, onClick, onHoverStart, onHoverEnd }: HandCardProps) => {
  const accent = tribeAccent[card.tribe] || '0 0% 50%';
  const image = getCardImage(card.name);
  const isMobile = useIsMobile();
  const cardW = isMobile ? 64 : 128;
  const cardH = isMobile ? 90 : 180;

  return (
    <motion.div
      className={`relative cursor-pointer select-none flex-shrink-0 group ${!canAfford ? 'opacity-30 grayscale' : ''}`}
      style={{ width: cardW, height: cardH }}
      onClick={canAfford ? onClick : undefined}
      initial={{ y: 120, opacity: 0, rotateZ: -8 + index * 3, scale: 0.6 }}
      animate={{
        y: isSelected ? -32 : 0,
        opacity: 1,
        rotateZ: isSelected ? 0 : -4 + index * 2,
        scale: isSelected ? 1.18 : 1,
      }}
      exit={{ y: 120, opacity: 0, scale: 0.3, rotateZ: -15, filter: 'blur(4px)' }}
      transition={{ type: "spring", stiffness: 280, damping: 20, delay: index * 0.05 }}
      whileHover={canAfford ? { y: -24, scale: 1.12, rotateZ: 0 } : undefined}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {/* Selection glow ring */}
      {isSelected && (
        <motion.div
          className="absolute -inset-1.5 rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, hsl(${accent} / 0.6), transparent 40%, hsl(${accent} / 0.4))`,
            filter: 'blur(4px)',
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      <div
        className="w-full h-full rounded-xl overflow-hidden relative"
        style={{
          border: isSelected
            ? `2px solid hsl(${accent})`
            : `1px solid hsl(${accent} / 0.3)`,
          boxShadow: isSelected
            ? `0 0 30px hsl(${accent} / 0.5), 0 10px 25px rgba(0,0,0,0.7)`
            : `0 6px 16px rgba(0,0,0,0.6), 0 0 10px hsl(${accent} / 0.1)`,
          background: 'hsl(var(--card))',
        }}
      >
        {/* Full art */}
        {image && (
          <div className="absolute inset-0">
            <img src={image} alt={card.name} className="w-full h-full object-cover object-top" style={{ opacity: 0.7 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(105deg, transparent 32%, hsl(${accent} / 0.15) 42%, hsl(${accent} / 0.2) 45%, transparent 55%)`,
                backgroundSize: '250% 100%',
              }}
              animate={{ backgroundPosition: ['250% 0%', '-250% 0%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        <div className={`relative z-10 flex flex-col justify-between h-full ${isMobile ? 'p-1' : 'p-2'}`}>
          {/* Cost */}
          <div className="flex justify-between items-start">
            <div
              className={`${isMobile ? 'w-4 h-4 text-[8px]' : 'w-6 h-6 text-xs'} flex items-center justify-center rounded-md font-display`}
              style={{
                background: 'linear-gradient(135deg, hsl(220 60% 25%), hsl(220 50% 12%))',
                color: 'hsl(220 80% 75%)',
                boxShadow: '0 0 8px hsl(220 60% 40% / 0.5)',
                border: '1px solid hsl(220 50% 35% / 0.4)',
              }}
            >
              {card.cost}
            </div>
          </div>

          {/* Bottom info */}
          <div>
            <p className={`${isMobile ? 'text-[7px]' : 'text-[10px]'} font-display text-foreground/95 leading-tight truncate drop-shadow-lg`}>
              {card.name}
            </p>
            {!isMobile && (
              <>
                <p className="text-[7px] font-display truncate mt-0.5" style={{ color: `hsl(${accent} / 0.75)` }}>
                  {card.abilityName} · {card.abilityType}
                </p>
                <p
                  className="text-[7px] font-body leading-[1.3] mt-0.5 line-clamp-2"
                  style={{ color: 'hsl(0 0% 52%)' }}
                >
                  {card.abilityDesc}
                </p>
              </>
            )}
            <div className={`flex justify-between items-center ${isMobile ? 'mt-0.5' : 'mt-1'}`}>
              <span
                className={`font-display ${isMobile ? 'text-[10px]' : 'text-sm'}`}
                style={{ color: 'hsl(var(--fire-glow))', textShadow: '0 0 8px hsl(var(--fire-glow) / 0.6)' }}
              >
                {card.baseAtk}
              </span>
              <span
                className={`font-display ${isMobile ? 'text-[10px]' : 'text-sm'}`}
                style={{ color: 'hsl(var(--earth-glow))', textShadow: '0 0 8px hsl(var(--earth-glow) / 0.6)' }}
              >
                {card.baseHp}
              </span>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default HandCard;
