import { motion } from "framer-motion";
import type { CardInstance } from "@/game/types";
import { getCardImage } from "@/game/cardImages";
import { useIsMobile } from "@/hooks/use-mobile";

const tribeAccent: Record<string, string> = {
  'Obsidian Veil': '270 40% 50%',
  'Radiant Sanctum': '45 50% 60%',
  'Emberheart Pact': '10 55% 50%',
  'Ironroot Bastion': '140 35% 42%',
  'Tribeless': '0 55% 45%',
};

interface BattleCardProps {
  card: CardInstance;
  isAttacking?: boolean;
  isTakingDamage?: boolean;
  damageValue?: number;
  onClick?: () => void;
  isOpponent?: boolean;
  showActive?: boolean;
  onActivate?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

const BattleCard = ({ card, isAttacking, isTakingDamage, damageValue, onClick, isOpponent, showActive, onActivate, onHoverStart, onHoverEnd }: BattleCardProps) => {
  const accent = tribeAccent[card.tribe] || '0 0% 50%';
  const image = getCardImage(card.name);
  const isMobile = useIsMobile();
  const isStunned = card.statusEffects.some(e => e.type === 'stun');
  const isBurning = card.statusEffects.some(e => e.type === 'burn');
  const isStealthed = card.statusEffects.some(e => e.type === 'stealth');
  const isWounded = card.statusEffects.some(e => e.type === 'wound');
  const hpPercent = Math.max(0, card.currentHp / card.maxHp);
  const cardW = isMobile ? 62 : 164;
  const cardH = isMobile ? 86 : 228;

  return (
    <motion.div
      className="relative cursor-pointer select-none group"
      style={{ width: cardW, height: cardH }}
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      layout
      initial={{ scale: 0, opacity: 0, rotateY: 180, rotateX: 30, y: isOpponent ? -60 : 80, filter: 'brightness(3) blur(4px)' }}
      animate={{
        scale: 1,
        opacity: isStealthed ? 0.3 : 1,
        rotateY: 0,
        rotateX: 0,
        y: isAttacking ? (isOpponent ? 36 : -36) : 0,
        x: isTakingDamage ? [0, -10, 12, -8, 8, -4, 0] : 0,
        filter: 'brightness(1) blur(0px)',
      }}
      exit={{ scale: 0, opacity: 0, rotateY: -120, rotateX: -20, y: isOpponent ? -40 : 40, filter: 'brightness(3) blur(6px)' }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 16,
        x: isTakingDamage ? { duration: 0.4, ease: "easeInOut" } : undefined,
        filter: { duration: 0.6 },
      }}
      whileHover={!isOpponent ? { scale: 1.12, zIndex: 20, y: -14, rotateX: -3 } : undefined}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-[3px] rounded-xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, hsl(${accent} / 0.5), transparent 40%, hsl(${accent} / 0.3))`,
          filter: 'blur(2px)',
        }}
        animate={isAttacking ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.4 }}
        transition={{ duration: 0.5, repeat: isAttacking ? Infinity : 0 }}
      />

      {/* Card body */}
      <div
        className="w-full h-full rounded-xl overflow-hidden relative"
        style={{
          border: `1.5px solid hsl(${accent} / 0.5)`,
          boxShadow: `0 0 24px hsl(${accent} / 0.15), 0 6px 20px rgba(0,0,0,0.7), inset 0 0 16px hsl(${accent} / 0.05)`,
          background: `linear-gradient(180deg, hsl(var(--card)) 0%, hsl(0 0% 3%) 100%)`,
        }}
      >
        {/* Full card art */}
        {image && (
          <div className="absolute inset-0">
            <img src={image} alt={card.name} className="w-full h-full object-cover object-top" style={{ opacity: 0.8 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(105deg, transparent 38%, hsl(${accent} / 0.1) 42%, hsl(${accent} / 0.15) 45%, transparent 50%)`,
                backgroundSize: '250% 100%',
              }}
              animate={{ backgroundPosition: ['250% 0%', '-250% 0%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        {/* Status overlays */}
        {isStunned && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ background: 'rgba(120, 100, 0, 0.4)' }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.span
              className="font-display text-base tracking-[0.2em]"
              style={{ color: 'hsl(45 80% 60%)', textShadow: '0 0 16px hsl(45 80% 60% / 0.8)' }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              STUNNED
            </motion.span>
          </motion.div>
        )}

        {isBurning && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none z-10"
            style={{ boxShadow: `inset 0 0 30px hsl(var(--fire-glow) / 0.5), 0 0 20px hsl(var(--fire-glow) / 0.25)` }}
            animate={{ opacity: [0.3, 0.85, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}

        {card.shield > 0 && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none z-10"
            style={{ boxShadow: `inset 0 0 24px hsl(var(--light-glow) / 0.5), 0 0 16px hsl(var(--light-glow) / 0.3)` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {isWounded && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none z-10"
            style={{ boxShadow: `inset 0 0 20px hsl(300 60% 30% / 0.5), 0 0 12px hsl(300 60% 30% / 0.25)` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        {/* Card content */}
        <div className={`relative z-20 flex flex-col justify-between h-full ${isMobile ? 'p-1' : 'p-2'}`}>
          {/* Top: cost + shield */}
          <div className="flex justify-between items-start">
            <div
              className={`${isMobile ? 'w-5 h-5 text-[10px]' : 'w-7 h-7 text-sm'} flex items-center justify-center rounded-md font-display`}
              style={{
                background: 'linear-gradient(135deg, hsl(220 60% 25%), hsl(220 50% 12%))',
                color: 'hsl(220 80% 75%)',
                boxShadow: '0 0 10px hsl(220 60% 40% / 0.5)',
                border: '1px solid hsl(220 50% 35% / 0.5)',
              }}
            >
              {card.cost}
            </div>
            {card.shield > 0 && (
              <div
                className="flex items-center gap-0.5 px-2 py-1 rounded-md font-display text-[11px]"
                style={{
                  background: 'linear-gradient(135deg, hsl(45 50% 25%), hsl(45 40% 12%))',
                  color: 'hsl(45 70% 70%)',
                  boxShadow: '0 0 8px hsl(45 50% 40% / 0.3)',
                }}
              >
                SHIELD {card.shield}
              </div>
            )}
          </div>

          {/* Bottom: name + stats */}
          <div>
            <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} font-display text-foreground leading-tight truncate drop-shadow-lg`}>
              {card.name}
            </p>
            {!isMobile && <p className="text-[8px] font-body truncate mt-0.5" style={{ color: `hsl(${accent} / 0.85)` }}>
              {card.abilityName}
            </p>}
            <div className={`flex justify-between items-center ${isMobile ? 'mt-0.5 gap-0.5' : 'mt-1.5 gap-1'}`}>
              <div
                className={`flex items-center justify-center ${isMobile ? 'w-6 h-5 text-xs' : 'w-8 h-7 text-base'} rounded-md font-display`}
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--fire) / 0.85), hsl(var(--fire-glow) / 0.5))',
                  color: 'hsl(var(--fire-glow))',
                  textShadow: '0 0 10px hsl(var(--fire-glow) / 0.8)',
                  boxShadow: '0 0 10px hsl(var(--fire-glow) / 0.25)',
                }}
              >
                {card.currentAtk}
              </div>
              <div className={`flex-1 ${isMobile ? 'h-1.5' : 'h-2.5'} bg-black/70 rounded-full overflow-hidden border border-white/5`}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: hpPercent > 0.5
                      ? 'linear-gradient(90deg, hsl(var(--earth-glow)), hsl(140 45% 50%))'
                      : hpPercent > 0.25
                      ? 'linear-gradient(90deg, hsl(var(--light-glow)), hsl(45 60% 55%))'
                      : 'linear-gradient(90deg, hsl(var(--fire-glow)), hsl(0 70% 55%))',
                    boxShadow: hpPercent <= 0.25 ? '0 0 10px hsl(var(--fire-glow) / 0.5)' : 'none',
                  }}
                  animate={{ width: `${hpPercent * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              <div
                className={`flex items-center justify-center ${isMobile ? 'w-6 h-5 text-xs' : 'w-8 h-7 text-base'} rounded-md font-display`}
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--earth) / 0.85), hsl(var(--earth-glow) / 0.5))',
                  color: 'hsl(var(--earth-glow))',
                  textShadow: '0 0 10px hsl(var(--earth-glow) / 0.8)',
                  boxShadow: '0 0 10px hsl(var(--earth-glow) / 0.25)',
                }}
              >
                {card.currentHp}
              </div>
            </div>
          </div>
        </div>

        {/* Damage popup */}
        {isTakingDamage && damageValue !== undefined && damageValue > 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 2.5, y: -35 }}
            transition={{ duration: 1 }}
          >
            <span
              className="font-display text-5xl"
              style={{
                color: 'hsl(var(--fire-glow))',
                textShadow: '0 0 24px hsl(var(--fire-glow)), 0 0 50px hsl(var(--fire-glow) / 0.5)',
              }}
            >
              -{damageValue}
            </span>
          </motion.div>
        )}

        {/* Hit flash */}
        {isTakingDamage && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none z-25"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ background: 'hsl(var(--fire-glow) / 0.35)' }}
          />
        )}
      </div>

      {/* Active ability button */}
      {showActive && onActivate && (
        <motion.button
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-display text-[10px] px-4 py-1 rounded-md z-30 whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, hsl(220 60% 30%), hsl(220 50% 18%))',
            color: 'hsl(220 80% 75%)',
            boxShadow: '0 0 14px hsl(220 60% 40% / 0.5)',
            border: '1px solid hsl(220 50% 40% / 0.5)',
          }}
          onClick={(e) => { e.stopPropagation(); onActivate(); }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.12, boxShadow: '0 0 24px hsl(220 60% 40% / 0.7)' }}
        >
          ACTIVATE
        </motion.button>
      )}
    </motion.div>
  );
};

export default BattleCard;
