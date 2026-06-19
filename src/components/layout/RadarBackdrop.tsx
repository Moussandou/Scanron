/**
 * Ambient Dragon Radar atmosphere behind every page: faint concentric range
 * rings and a very slow orange sweep, anchored top-centre to continue the
 * body's radial motif. Purely decorative and reduced-motion safe.
 */
export function RadarBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Range rings */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] rounded-full"
        style={{
          background:
            'repeating-radial-gradient(circle, rgba(100,116,139,0.13) 0 1px, transparent 1px 80px)',
          maskImage: 'radial-gradient(circle, #000 0%, transparent 62%)',
          WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 62%)',
        }}
      />
      {/* Slow sweep */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] rounded-full opacity-[0.07] animate-[radar-sweep_16s_linear_infinite]"
        style={{
          background: 'conic-gradient(from 0deg, var(--color-primary) 0deg, transparent 45deg 360deg)',
          maskImage: 'radial-gradient(circle, #000 0%, transparent 60%)',
          WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
