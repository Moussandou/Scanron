import { type ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

/**
 * Shared page header. The title keeps the strong Dragon Radar treatment — it is
 * the single "loud" element per screen; everything else stays calm.
 */
export function PageHeader({ title, subtitle, right }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/10 pb-4">
      <div>
        <h1 className="text-2xl font-display font-black tracking-widest text-text uppercase">{title}</h1>
        {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
