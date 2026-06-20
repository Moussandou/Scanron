import { useId } from 'react';

/**
 * The summoning storm behind the hero: a brooding green-black sky built from
 * fractal-noise clouds, two drifting cloud banks, forked lightning that strikes
 * on a long loop, and Shenron's energy swaying through it. Pure CSS/SVG — no
 * images. Motion freezes calmly under prefers-reduced-motion (global rule).
 */
export function StormSky() {
  const clouds = useId();
  const energy = useId();
  const serpentPath =
    'M -40 380 C 160 300 220 540 420 460 C 600 388 660 600 880 520 ' +
    'C 1060 452 1140 250 1320 320';

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Base storm gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_60%_-10%,#103b30_0%,#0a1f1a_38%,#05100d_70%,#03080b_100%)]" />

      {/* Fractal-noise cloud texture (two banks drifting opposite ways) */}
      <svg className="absolute -inset-[20%] h-[140%] w-[140%]">
        <defs>
          <filter id={clouds} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.018" numOctaves="3" seed="11" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.20  0 0 0 0 0.15  0 0 0 0.65 0" />
          </filter>
          <filter id={`${clouds}2`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.013 0.025" numOctaves="2" seed="4" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.02  0 0 0 0 0.08  0 0 0 0 0.07  0 0 0 0.55 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${clouds})`} className="origin-center animate-[cloud-drift_42s_ease-in-out_infinite_alternate]" />
        <rect width="100%" height="100%" filter={`url(#${clouds}2)`} className="origin-center animate-[cloud-drift-rev_58s_ease-in-out_infinite_alternate]" />
      </svg>

      {/* Shenron's energy — a green serpent swaying through the storm */}
      <svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full animate-[serpent-sway_14s_ease-in-out_infinite]">
        <defs>
          <linearGradient id={energy} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* soft underglow */}
        <path d={serpentPath} stroke={`url(#${energy})`} strokeWidth="46" strokeLinecap="round" fill="none" opacity="0.18" style={{ filter: 'blur(18px)' }} />
        {/* core filament */}
        <path d={serpentPath} stroke={`url(#${energy})`} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" style={{ filter: 'drop-shadow(0 0 8px rgba(52,211,153,0.7))' }} />
      </svg>

      {/* Forked lightning */}
      <svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <path
          d="M340 -20 L300 200 L350 210 L290 430"
          stroke="#d7faff"
          strokeWidth="2.5"
          fill="none"
          className="animate-[bolt_8s_linear_infinite]"
          style={{ filter: 'drop-shadow(0 0 6px rgba(160,230,255,0.9))' }}
        />
        <path
          d="M980 -20 L1030 240 L985 250 L1040 470"
          stroke="#cdeafe"
          strokeWidth="2"
          fill="none"
          className="animate-[bolt_11s_linear_infinite]"
          style={{ animationDelay: '3.5s', filter: 'drop-shadow(0 0 6px rgba(160,230,255,0.9))' }}
        />
      </svg>

      {/* Ambient lightning wash */}
      <div className="absolute inset-0 animate-[sky-flash_8s_linear_infinite] bg-[radial-gradient(ellipse_at_50%_15%,rgba(180,240,255,0.5),transparent_55%)]" />

      {/* Vignette to seat the copy */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_42%_50%,transparent_30%,rgba(3,8,11,0.55)_75%,rgba(3,8,11,0.85)_100%)]" />
    </div>
  );
}
