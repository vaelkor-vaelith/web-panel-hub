import React from "react";

interface TribeIconProps {
  size?: number;
  className?: string;
}

/** Obsidian Veil - a void eye / shadowy slit */
export const ShadowIcon: React.FC<TribeIconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path
      d="M16 6C8 6 3 16 3 16s5 10 13 10 13-10 13-10S24 6 16 6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.08"
    />
    <ellipse cx="16" cy="16" rx="5" ry="7" fill="currentColor" fillOpacity="0.15" />
    <ellipse cx="16" cy="16" rx="2" ry="5" fill="currentColor" fillOpacity="0.6" />
    <line x1="16" y1="8" x2="16" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
);

/** Radiant Sanctum - a crystal / radiant prism */
export const LightIcon: React.FC<TribeIconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <polygon
      points="16,3 20,13 29,13 22,19 25,29 16,23 7,29 10,19 3,13 12,13"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.08"
      strokeLinejoin="round"
    />
    <polygon
      points="16,9 18.5,14 24,14 19.5,18 21,23 16,20 11,23 12.5,18 8,14 13.5,14"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <circle cx="16" cy="16" r="2" fill="currentColor" fillOpacity="0.5" />
  </svg>
);

/** Emberheart Pact - a stylized flame with inner heart */
export const FireIcon: React.FC<TribeIconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path
      d="M16 3C16 3 10 10 10 17c0 3.3 2.7 6 6 6s6-2.7 6-6C22 10 16 3 16 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.08"
      strokeLinejoin="round"
    />
    <path
      d="M16 11c0 0-3 3.5-3 7 0 1.7 1.3 3 3 3s3-1.3 3-3c0-3.5-3-7-3-7Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M16 16c0 0-1.5 1.8-1.5 3.2 0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5C17.5 17.8 16 16 16 16Z"
      fill="currentColor"
      fillOpacity="0.5"
    />
    <path
      d="M13 28L16 23L19 28"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.25"
      strokeLinecap="round"
    />
  </svg>
);

/** Ironroot Bastion - a rooted shield / tree trunk cross-section */
export const EarthIcon: React.FC<TribeIconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    {/* Hexagonal shield */}
    <path
      d="M16 3L27 9V21L16 29L5 21V9L16 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.08"
      strokeLinejoin="round"
    />
    {/* Inner rings like tree rings */}
    <path
      d="M16 8L23 12V20L16 25L9 20V12L16 8Z"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="none"
      opacity="0.2"
    />
    <path
      d="M16 12L20 14.5V19L16 22L12 19V14.5L16 12Z"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="currentColor"
      fillOpacity="0.15"
      opacity="0.35"
    />
    {/* Root tendrils */}
    <line x1="16" y1="16" x2="16" y2="25" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
    <line x1="16" y1="16" x2="9" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <line x1="16" y1="16" x2="23" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

/** Mythic / Tribeless - a shattered crown fragment */
export const MythicIcon: React.FC<TribeIconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path
      d="M6 22L9 8L14 14L16 6L18 14L23 8L26 22H6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.08"
      strokeLinejoin="round"
    />
    {/* Crack / shatter line */}
    <path
      d="M16 6L15 12L17 15L14 18L16 22"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="6" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="1.5" />
    <line x1="8" y1="25" x2="24" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
);

export const tribeIconMap: Record<string, React.FC<TribeIconProps>> = {
  "Obsidian Veil": ShadowIcon,
  "Radiant Sanctum": LightIcon,
  "Emberheart Pact": FireIcon,
  "Ironroot Bastion": EarthIcon,
  "Tribeless": MythicIcon,
};

export const tribeIdIconMap: Record<string, React.FC<TribeIconProps>> = {
  "obsidian-veil": ShadowIcon,
  "radiant-sanctum": LightIcon,
  "emberheart-pact": FireIcon,
  "ironroot-bastion": EarthIcon,
};
