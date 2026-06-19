import { useId } from 'react';

/**
 * The Scanron mark: a Dragon Radar scope — concentric rings, a sweeping beam and
 * a detected blip. This is the product in one glyph. `animated` gives the beam a
 * slow live rotation (frozen under prefers-reduced-motion via the global rule).
 */
export function ScanronMark({
  size = 28,
  animated = false,
  className = '',
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  const sweepId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={sweepId} x1="24" y1="24" x2="24" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Scope rings */}
      <circle cx="24" cy="24" r="22" stroke="var(--color-primary)" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="13" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.35" />

      {/* Crosshair */}
      <line x1="24" y1="3" x2="24" y2="45" stroke="var(--color-muted)" strokeWidth="1" opacity="0.2" />
      <line x1="3" y1="24" x2="45" y2="24" stroke="var(--color-muted)" strokeWidth="1" opacity="0.2" />

      {/* Sweeping beam */}
      <g
        style={{ transformOrigin: '24px 24px' }}
        className={animated ? 'animate-[radar-sweep_7s_linear_infinite]' : ''}
      >
        <path d="M24 24 L24 2 A22 22 0 0 1 45 17 Z" fill={`url(#${sweepId})`} />
        <line x1="24" y1="24" x2="24" y2="2" stroke="var(--color-primary)" strokeWidth="1.5" />
      </g>

      {/* Detected blip */}
      <circle cx="33" cy="15" r="1.8" fill="var(--color-accent)" />

      {/* Core */}
      <circle cx="24" cy="24" r="3.2" fill="var(--color-primary)" />
      <circle cx="24" cy="24" r="3.2" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}
