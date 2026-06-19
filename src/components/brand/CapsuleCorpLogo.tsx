export function CapsuleCorpLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size * 2} height={size} viewBox="0 0 80 40" fill="none" className={className} aria-hidden="true">
      {/* Capsule container */}
      <rect x="4" y="6" width="72" height="28" rx="14" stroke="var(--color-accent)" strokeWidth="3" fill="var(--color-surface-2)" opacity="0.9" />
      <rect x="4" y="6" width="36" height="28" rx="14" fill="var(--color-accent)" opacity="0.15" />
      {/* Double nested C characters */}
      <path d="M 48 13 A 7 7 0 1 0 48 27" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      <path d="M 38 15 A 5 5 0 1 0 38 25" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
