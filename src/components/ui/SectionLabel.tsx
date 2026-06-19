import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface Props {
  icon?: ReactNode;
  children: ReactNode;
  tone?: 'muted' | 'text';
  className?: string;
}

/**
 * Calm section heading. Deliberately quieter than the page title: no glow, no
 * black weight — so a screen has hierarchy instead of every block shouting.
 */
export function SectionLabel({ icon, children, tone = 'muted', className }: Props) {
  return (
    <h2
      className={cn(
        'text-xs font-display font-semibold uppercase tracking-wider flex items-center gap-2',
        tone === 'muted' ? 'text-muted' : 'text-text',
        className,
      )}
    >
      {icon}
      {children}
    </h2>
  );
}
