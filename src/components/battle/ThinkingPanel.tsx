import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ThinkingPanelProps {
  thinking: string;
  playerName: string;
  isActive: boolean;
  side?: 'left' | 'right';
  model?: string;
  accentHue?: number;
}

export default function ThinkingPanel({
  thinking,
  playerName,
  isActive,
  side = 'right',
  model = 'war-council',
  accentHue = 270,
}: ThinkingPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thinking]);

  if (!isActive) return null;

  const isLeft = side === 'left';
  const hasContent = thinking.length > 0;

  const accent = (lightness: number, alpha?: number) =>
    alpha !== undefined
      ? `hsl(${accentHue} 40% ${lightness}% / ${alpha})`
      : `hsl(${accentHue} 40% ${lightness}%)`;

  const accentGlow = (lightness: number, alpha: number) =>
    `hsl(${accentHue} 60% ${lightness}% / ${alpha})`;

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden shrink-0"
      style={{
        width: collapsed ? 36 : 300,
        minWidth: collapsed ? 36 : 300,
        transition: 'width 0.3s ease, min-width 0.3s ease',
      }}
    >
      {/* Seamless fade background - blends into the battlefield */}
      <div
        className="absolute inset-0"
        style={{
          background: isLeft
            ? 'linear-gradient(to right, hsl(0 0% 2% / 0.92) 0%, hsl(0 0% 2% / 0.7) 60%, transparent 100%)'
            : 'linear-gradient(to left, hsl(0 0% 2% / 0.92) 0%, hsl(0 0% 2% / 0.7) 60%, transparent 100%)',
        }}
      />
      {/* Very subtle colored tint at the edge */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLeft
            ? `linear-gradient(to right, ${accentGlow(20, 0.06)} 0%, transparent 50%)`
            : `linear-gradient(to left, ${accentGlow(20, 0.06)} 0%, transparent 50%)`,
        }}
      />

      {/* ── Header ── */}
      <div
        className={`relative shrink-0 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 pt-3 pb-2 cursor-pointer select-none z-10`}
        onClick={() => setCollapsed(!collapsed)}
      >
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: hasContent ? accent(55) : 'hsl(0 0% 20%)',
                  boxShadow: hasContent ? `0 0 6px ${accentGlow(50, 0.5)}` : 'none',
                }}
                animate={hasContent ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className="text-[9px] font-display tracking-[0.2em] uppercase"
                style={{
                  color: accent(55),
                  textShadow: `0 0 8px ${accentGlow(40, 0.15)}`,
                }}
              >
                {playerName}
              </span>
            </div>
            {hasContent && (
              <motion.span
                className="text-[7px] font-mono"
                style={{ color: 'hsl(120 30% 35%)' }}
                animate={{ opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                streaming
              </motion.span>
            )}
          </>
        ) : (
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: hasContent ? accent(55) : 'hsl(0 0% 20%)',
              boxShadow: hasContent ? `0 0 6px ${accentGlow(50, 0.5)}` : 'none',
            }}
            animate={hasContent ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* ── Scrollable reasoning text ── */}
      {!collapsed && (
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto px-3 py-1 z-10"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 3%, black 94%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 3%, black 94%, transparent 100%)',
          }}
        >
          {hasContent ? (
            <pre
              className="font-mono text-[9.5px] leading-[1.7] whitespace-pre-wrap break-words"
              style={{
                color: `hsl(${accentHue} 8% 52%)`,
                textShadow: `0 0 6px hsl(${accentHue} 30% 30% / 0.08)`,
              }}
            >
              {thinking}
              <motion.span
                style={{
                  color: `hsl(${accentHue} 45% 55%)`,
                  textShadow: `0 0 6px ${accentGlow(50, 0.2)}`,
                }}
                animate={{ opacity: [0.7, 0.1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ▌
              </motion.span>
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full opacity-30">
              <span
                className="text-[8px] font-mono tracking-widest uppercase"
                style={{ color: `hsl(${accentHue} 10% 30%)` }}
              >
                awaiting
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Footer info (very subtle) ── */}
      {!collapsed && (
        <div className="relative shrink-0 px-3 pb-2 pt-1 flex items-center justify-between z-10">
          <span
            className="text-[7px] font-mono tracking-[0.1em]"
            style={{ color: 'hsl(0 0% 18%)' }}
          >
            {model}
          </span>
          {hasContent && (
            <span
              className="text-[7px] font-mono"
              style={{ color: `hsl(${accentHue} 15% 22%)` }}
            >
              {thinking.length.toLocaleString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
