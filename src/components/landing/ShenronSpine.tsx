import { useId } from 'react';

/**
 * Shenron's energy trail: a serpentine green stroke that draws itself down the
 * page as the user scrolls (CSS scroll-driven animation — no scroll listener).
 * It threads the sections together and resolves into the dragon at the summon.
 * `vector-effect: non-scaling-stroke` keeps the line crisp while the SVG is
 * stretched to the full content height with preserveAspectRatio="none".
 */
export function ShenronSpine() {
  const grad = useId();
  const d =
    'M 50 0 C 78 70 80 130 50 200 C 20 270 18 330 50 400 ' +
    'C 82 470 84 530 50 600 C 18 670 16 730 50 800 ' +
    'C 80 870 82 930 55 1000';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[min(680px,80vw)] -translate-x-1/2 lg:block"
      style={{ filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.45))' }}
    >
      <svg
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        className="h-full w-full"
        fill="none"
      >
        <defs>
          <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
            <stop offset="18%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="82%" stopColor="#059669" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Soft underglow */}
        <path
          d={d}
          className="dragon-draw"
          stroke={`url(#${grad})`}
          strokeWidth={9}
          strokeLinecap="round"
          opacity={0.28}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
        {/* Core scale line */}
        <path
          d={d}
          className="dragon-draw"
          stroke={`url(#${grad})`}
          strokeWidth={2.5}
          strokeLinecap="round"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
