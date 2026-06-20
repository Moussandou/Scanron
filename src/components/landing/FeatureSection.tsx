import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface Props {
  index: string;
  eyebrow: string;
  title: string;
  desc: string;
  points?: string[];
  media: ReactNode;
  reversed?: boolean;
}

/** Alternating media + copy row for a feature's live mini-demo. */
export function FeatureSection({ index, eyebrow, title, desc, points, media, reversed }: Props) {
  return (
    <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className={reversed ? 'lg:order-2' : ''}>{media}</div>
      <div className={`space-y-5 ${reversed ? 'lg:order-1' : ''}`}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-black text-primary/40">{index}</span>
          <span className="h-px w-8 bg-primary/40" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-wide text-text leading-tight">
          {title}
        </h3>
        <p className="text-sm text-muted leading-relaxed max-w-md">{desc}</p>
        {points && (
          <ul className="space-y-2.5 pt-1">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[13px] text-text/75">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-signal/15 text-signal flex items-center justify-center shrink-0">
                  <Check size={11} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
