import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll via IntersectionObserver (never a scroll listener). Returns a
 * ref to attach and a boolean once the element has entered the viewport. The
 * reveal is one-shot: it stays visible after firing so re-scrolling is calm.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { amount?: number; once?: boolean } = {},
) {
  const { amount = 0.2, once = true } = options;
  const ref = useRef<T>(null);
  // Without IntersectionObserver, render visible from the start (no animation).
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: amount, rootMargin: '0px 0px -8% 0px' },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [amount, once]);

  return { ref, visible };
}
