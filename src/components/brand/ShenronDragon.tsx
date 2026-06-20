import { useId } from 'react';

/**
 * Stylised Shenron — a serpentine green dragon that rises from the radar core at
 * the summon. Graphic, not photoreal: a flowing tapering body, horns, whiskers
 * and a glowing red eye. Built to read instantly as the Dragon Ball wish dragon.
 */
export function ShenronDragon({ className = '' }: { className?: string }) {
  const body = useId();
  const sheen = useId();

  return (
    <svg
      viewBox="0 0 200 340"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={body} x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="45%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Coiling body — tapering serpent rising from the core */}
      <path
        d="M92 340 C 58 300 138 274 100 232 C 66 196 132 168 100 130 C 86 110 98 100 116 92"
        stroke={`url(#${body})`}
        strokeWidth="26"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sheen highlight along the body */}
      <path
        d="M92 340 C 58 300 138 274 100 232 C 66 196 132 168 100 130 C 86 110 98 100 116 92"
        stroke={`url(#${sheen})`}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* Dorsal spikes */}
      <path d="M108 250 l10 -7 -2 12 z" fill="#34d399" />
      <path d="M96 196 l-11 -6 1 12 z" fill="#34d399" />
      <path d="M110 150 l11 -5 -3 12 z" fill="#34d399" />

      {/* Head */}
      <g>
        <path
          d="M116 92 C 104 78 110 60 130 56 C 152 52 172 64 174 84 C 176 100 164 112 146 112 C 132 112 122 104 116 92 Z"
          fill={`url(#${body})`}
        />
        {/* Snout */}
        <path d="M168 80 C 184 76 192 82 190 92 C 188 100 176 100 168 96 Z" fill="#10b981" />
        {/* Horns */}
        <path d="M126 56 C 120 40 124 28 134 22 C 132 36 134 46 140 54 Z" fill="#34d399" />
        <path d="M150 54 C 150 38 158 28 168 26 C 162 38 160 48 162 56 Z" fill="#34d399" />
        {/* Glowing red eye */}
        <circle cx="150" cy="80" r="6" fill="#fca5a5" />
        <circle cx="150" cy="80" r="3.4" fill="#dc2626" />
        {/* Whiskers */}
        <path d="M186 92 C 200 100 196 116 180 120" stroke="#34d399" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M168 100 C 178 116 170 132 154 134" stroke="#34d399" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
