import React from 'react';

interface NavioraaLogoProps {
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  className?: string;
}

/**
 * NavioraaLogo: Authentic vector-based reproduction of the Navioraa brand identity.
 * Features:
 * - 3D folded origami ribbon "N" emblem with royal-blue, electric-cyan, and lime-teal gradients.
 * - Modern geometric uppercase wordmark "NAVIORAA".
 * - Stylized final "A" featuring the signature electric cyan-blue left leg & crossbar with split apex.
 * - Wide-tracked tagline "INNOVATION BEYOND TOMORROW" with illuminated cyan "INNOVATION".
 * - Adapts seamlessly to light (navbar) and dark (footer) UI contexts without background boxes.
 */
export const NavioraaLogo: React.FC<NavioraaLogoProps> = ({
  variant = 'light',
  showTagline = true,
  size = 'responsive',
  className = '',
}) => {
  const isDark = variant === 'dark';

  // Mark sizing
  const isResponsive = size === 'responsive';
  const markDimensions = {
    sm: { w: 32, h: 32, cls: 'w-8 h-8' },
    md: { w: 38, h: 38, cls: 'w-[38px] h-[38px]' },
    lg: { w: 46, h: 46, cls: 'w-[46px] h-[46px]' },
    responsive: { w: 38, h: 38, cls: 'w-8 h-8 sm:w-[38px] sm:h-[38px]' },
  }[size];

  // Font sizing based on size
  const titleSizeClass = {
    sm: 'text-lg tracking-wider',
    md: 'text-xl sm:text-[22px] tracking-wider',
    lg: 'text-2xl sm:text-3xl tracking-wider',
    responsive: 'text-[17px] sm:text-xl tracking-wider',
  }[size];

  const taglineSizeClass = {
    sm: 'text-[7.5px] tracking-[0.22em]',
    md: 'text-[8.5px] sm:text-[9.5px] tracking-[0.24em]',
    lg: 'text-[10px] sm:text-[11px] tracking-[0.26em]',
    responsive: 'hidden sm:flex text-[8.5px] sm:text-[9.5px] tracking-[0.24em]',
  }[size];

  const markId = React.useId().replace(/:/g, '');

  return (
    <div className={`inline-flex items-center gap-1.5 sm:gap-2.5 select-none ${className}`}>
      {/* 3D Folded Ribbon "N" Mark */}
      <svg
        width={markDimensions.w}
        height={markDimensions.h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`flex-shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105 ${markDimensions.cls}`}
        aria-hidden="true"
      >
        <defs>
          {/* Left Vertical Pillar Gradient: Deep Royal Blue to Electric Blue */}
          <linearGradient id={`${markId}-left`} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0047E0" />
            <stop offset="50%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0052FF" />
          </linearGradient>

          {/* Right Vertical Pillar Gradient: Lime-Teal Shimmer to Brilliant Cyan */}
          <linearGradient id={`${markId}-right`} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="35%" stopColor="#2DD4BF" />
            <stop offset="70%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#0099FF" />
          </linearGradient>

          {/* Diagonal Fold Gradient: Electric Blue through Gloss Cyan */}
          <linearGradient id={`${markId}-diag`} x1="10" y1="12" x2="90" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0052FF" />
            <stop offset="25%" stopColor="#0077FF" />
            <stop offset="65%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>

          {/* 3D Fold Shadow Layer */}
          <linearGradient id={`${markId}-fold-shadow`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#001845" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#001845" stopOpacity="0" />
          </linearGradient>

          {/* Stylized 'A' Gradient */}
          <linearGradient id={`${markId}-a-grad`} x1="0" y1="0" x2="0" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>
        </defs>

        {/* 1. Left Vertical Pillar */}
        <path
          d="M 18 12 L 32 12 L 32 88 L 18 88 A 8 8 0 0 1 10 80 L 10 20 A 8 8 0 0 1 18 12 Z"
          fill={`url(#${markId}-left)`}
        />

        {/* 2. Right Vertical Pillar with Lime/Teal Header */}
        <path
          d="M 68 12 L 82 12 A 8 8 0 0 1 90 20 L 90 80 A 8 8 0 0 1 82 88 L 68 88 Z"
          fill={`url(#${markId}-right)`}
        />

        {/* 3. Subtle Under-Fold Drop Shadow on Left */}
        <path
          d="M 10 20 L 32 45 L 32 55 L 10 30 Z"
          fill={`url(#${markId}-fold-shadow)`}
          opacity="0.6"
        />

        {/* 4. Diagonal 3D Fold Ribbon (Folds smoothly from top-left to bottom-right) */}
        <path
          d="M 10 18 A 6 6 0 0 1 18 12 L 32 12 L 90 80 A 8 8 0 0 1 82 88 L 68 88 L 10 22 A 6 6 0 0 1 10 18 Z"
          fill={`url(#${markId}-diag)`}
        />

        {/* 5. Sleek Fold Highlights */}
        <path
          d="M 18 12 L 32 12 L 90 80"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
        <path
          d="M 68 12 L 82 12 A 8 8 0 0 1 90 20"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography Block: NAVIORAA & Tagline */}
      <div className="flex flex-col justify-center leading-none">
        {/* NAVIORAA Wordmark */}
        <div className={`font-extrabold flex items-center font-heading ${titleSizeClass}`}>
          {/* Main characters: NAVIOR + first A */}
          <span
            className={
              isDark
                ? 'text-white tracking-wider'
                : 'text-slate-900 tracking-wider'
            }
          >
            NAVIORA
          </span>

          {/* Stylized Signature Second "A" */}
          <span className="inline-flex items-center ml-[0.5px] relative" title="A">
            <svg
              className="h-[0.88em] w-auto inline-block -translate-y-[0.5px]"
              viewBox="0 0 24 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left leg + horizontal crossbar in electric cyan gradient */}
              <path
                d="M 10.5 2.5 L 1.5 26 L 6.5 26 L 9.2 18.5 L 16.5 18.5 L 16.5 14.5 L 10.8 14.5 L 13.2 8.5 Z"
                fill={`url(#${markId}-a-grad)`}
              />
              {/* Right leg in navy (light) or white (dark) */}
              <path
                d="M 15 2.5 L 12.8 8.5 L 19 26 L 24 26 Z"
                fill={isDark ? '#FFFFFF' : '#0F172A'}
              />
            </svg>
          </span>
        </div>

        {/* Tagline: INNOVATION BEYOND TOMORROW */}
        {showTagline && (
          <div className={`font-semibold uppercase pt-1 sm:pt-1.2 flex items-center gap-1 ${taglineSizeClass}`}>
            <span className="text-[#00B4D8] font-bold">INNOVATION</span>
            <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>
              BEYOND TOMORROW
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
