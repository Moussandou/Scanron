export function RadarMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" stroke="var(--color-primary)" strokeWidth="2" opacity="0.4" />
      <circle cx="24" cy="24" r="13" stroke="var(--color-primary)" strokeWidth="2" opacity="0.6" />
      <circle cx="24" cy="24" r="4" fill="var(--color-accent)" />
      <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '24px 24px' }}>
        <path d="M24 24 L24 3 A21 21 0 0 1 41 14 Z" fill="var(--color-primary)" opacity="0.25" />
      </g>
    </svg>
  );
}
