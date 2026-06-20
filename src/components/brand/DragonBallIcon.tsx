import type { CSSProperties } from 'react';

// Canonical star layouts for the 1- through 7-star Dragon Balls (unit square,
// centred on 0.5/0.5). Mapped onto the sphere at render time.
const LAYOUTS: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.5, 0.36], [0.5, 0.64]],
  3: [[0.5, 0.34], [0.38, 0.6], [0.62, 0.6]],
  4: [[0.38, 0.38], [0.62, 0.38], [0.38, 0.62], [0.62, 0.62]],
  5: [[0.36, 0.36], [0.64, 0.36], [0.5, 0.5], [0.36, 0.64], [0.64, 0.64]],
  6: [[0.36, 0.36], [0.64, 0.36], [0.36, 0.5], [0.64, 0.5], [0.36, 0.64], [0.64, 0.64]],
  7: [[0.5, 0.3], [0.36, 0.45], [0.64, 0.45], [0.5, 0.52], [0.36, 0.67], [0.64, 0.67], [0.5, 0.74]],
};

/** Five-point star polygon points, centred on (cx,cy) with outer radius r. */
function starPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const ao = (-90 + i * 72) * (Math.PI / 180);
    const ai = (-90 + i * 72 + 36) * (Math.PI / 180);
    pts.push(`${(cx + r * Math.cos(ao)).toFixed(1)},${(cy + r * Math.sin(ao)).toFixed(1)}`);
    pts.push(`${(cx + r * 0.42 * Math.cos(ai)).toFixed(1)},${(cy + r * 0.42 * Math.sin(ai)).toFixed(1)}`);
  }
  return pts.join(' ');
}

export function DragonBallIcon({
  size = 64,
  stars = 4,
  className = '',
  style,
}: {
  size?: number;
  /** 1–7, renders the matching constellation of red stars. */
  stars?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const layout = LAYOUTS[Math.min(7, Math.max(1, stars))] ?? LAYOUTS[4];
  // Sphere centred at (50,50) r40; stars live inside ~r26 of the centre.
  const span = 52; // px of the unit layout mapped across the sphere
  const starR = stars >= 6 ? 4.6 : stars >= 4 ? 5.4 : 6.2;

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
        <filter id="dbShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#ff7a00" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Glow */}
      <circle cx="50" cy="50" r="48" fill="url(#dbGlow)" className="animate-pulse" />
      {/* Sphere */}
      <circle cx="50" cy="50" r="40" fill="url(#dbGrad)" filter="url(#dbShadow)" />
      {/* Shiny reflections */}
      <ellipse cx="40" cy="28" rx="16" ry="8" fill="#ffffff" opacity="0.35" transform="rotate(-30 40 28)" />
      <circle cx="30" cy="20" r="4" fill="#ffffff" opacity="0.45" />
      {/* Stars */}
      {layout.map(([ux, uy], i) => {
        const cx = 50 + (ux - 0.5) * span;
        const cy = 50 + (uy - 0.5) * span;
        return <polygon key={i} points={starPoints(cx, cy, starR)} fill="#d31a1a" />;
      })}
    </svg>
  );
}
