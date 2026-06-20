import type { ReactNode } from 'react';
import { useReveal } from '../../lib/hooks/useReveal';

/**
 * Thin wrapper that fades + lifts its children once they scroll into view.
 * Honors reduced motion (the `.reveal` class is neutralised in CSS).
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li';
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
