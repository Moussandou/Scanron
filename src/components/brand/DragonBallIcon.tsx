import type { CSSProperties } from 'react';

export function DragonBallIcon({ 
  size = 64, 
  className = "", 
  style 
}: { 
  size?: number; 
  className?: string; 
  style?: CSSProperties; 
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id="dbGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffb03a" />
          <stop offset="45%" stopColor="#ff7a00" />
          <stop offset="85%" stopColor="#e65c00" />
          <stop offset="100%" stopColor="#b33600" />
        </radialGradient>
        <radialGradient id="dbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 122, 0, 0.4)" />
          <stop offset="100%" stopColor="rgba(255, 122, 0, 0)" />
        </radialGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#ff7a00" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Glow effect */}
      <circle cx="50" cy="50" r="48" fill="url(#dbGlow)" className="animate-pulse" />
      {/* Main sphere */}
      <circle cx="50" cy="50" r="40" fill="url(#dbGrad)" filter="url(#shadow)" />
      {/* Shiny surface reflections */}
      <ellipse cx="40" cy="28" rx="16" ry="8" fill="#ffffff" opacity="0.35" transform="rotate(-30 40 28)" />
      <circle cx="30" cy="20" r="4" fill="#ffffff" opacity="0.45" />
      {/* 4 red stars inside the sphere */}
      <polygon points="42,38 44,43 49,43 45,46 47,51 42,48 37,51 39,46 35,43 40,43" fill="#d31a1a" />
      <polygon points="58,38 60,43 65,43 61,46 63,51 58,48 53,51 55,46 51,43 56,43" fill="#d31a1a" />
      <polygon points="42,54 44,59 49,59 45,62 47,67 42,64 37,67 39,62 35,59 40,59" fill="#d31a1a" />
      <polygon points="58,54 60,59 65,59 61,62 63,67 58,64 53,67 55,62 51,59 56,59" fill="#d31a1a" />
    </svg>
  );
}
