import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from '../../lib/i18n/I18nContext';

export interface TourStep {
  /** value of the target element's `data-tour` attribute */
  anchor: string;
  title: string;
  body: string;
}

interface Props {
  steps: TourStep[];
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

const PADDING = 8;

/**
 * Lightweight first-run spotlight. Dims the screen and cuts a hole around the current
 * step's target element (found via `[data-tour=...]`), then floats a themed bubble near
 * it. Falls back to a centered bubble when the target isn't in the DOM. No layout in
 * jsdom, so positioning is best-effort and exercised manually.
 */
export function OnboardingTour({ steps, step, onNext, onSkip }: Props) {
  const { t } = useTranslation();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  // Lock body scroll while the tour is visible.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Track the anchor's rect. On step change the target may not be mounted yet
  // (tab switch), so retry for up to ~500ms before giving up.
  const frameRef = useRef(0);
  useLayoutEffect(() => {
    if (!current) return;
    let tries = 0;
    const maxTries = 30;

    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${current.anchor}"]`);
      if (el) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setRect(el.getBoundingClientRect());
      } else if (tries < maxTries) {
        tries += 1;
        frameRef.current = requestAnimationFrame(measure);
      } else {
        setRect(null);
      }
    };

    measure();

    // Re-measure after a short delay to account for CSS animations on newly
    // mounted tab content.
    const settle = setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${current.anchor}"]`);
      if (el) setRect(el.getBoundingClientRect());
    }, 350);

    const onLayout = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${current.anchor}"]`);
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener('resize', onLayout);
    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(settle);
      window.removeEventListener('resize', onLayout);
    };
  }, [current]);

  if (!current) return null;

  // Spotlight hole: a box matching the target padded a little, with a massive shadow
  // spread that dims everything outside it.
  const holeStyle: React.CSSProperties | undefined = rect
    ? {
        position: 'fixed',
        top: rect.top - PADDING,
        left: rect.left - PADDING,
        width: rect.width + PADDING * 2,
        height: rect.height + PADDING * 2,
        borderRadius: 16,
        boxShadow: '0 0 0 9999px rgba(2,6,12,0.72)',
        pointerEvents: 'none',
      }
    : undefined;

  // Bubble: prefer just below the target, else just above, else pinned within the
  // viewport. Always clamped so the whole bubble (title included) stays on screen even
  // when the target is taller than the viewport. BUBBLE_H is an over-estimate so the
  // bottom never clips; HEADER keeps it clear of the fixed top bar.
  const bubbleStyle: React.CSSProperties = (() => {
    if (!rect) {
      return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const BUBBLE_H = 260;
    const MARGIN = 16;
    const HEADER = 84;
    const maxTop = Math.max(HEADER, vh - BUBBLE_H - MARGIN);

    const below = rect.bottom + 12;
    const above = rect.top - 12 - BUBBLE_H;
    let top: number;
    if (below + BUBBLE_H + MARGIN <= vh) top = below;
    else if (above >= HEADER) top = above;
    else top = maxTop;
    top = Math.min(Math.max(top, HEADER), maxTop);

    const left = Math.min(Math.max(rect.left, MARGIN), Math.max(MARGIN, vw - 336));
    return { position: 'fixed', top, left };
  })();

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={current.title}>
      {/* Click-blocker over the whole viewport */}
      <div className="absolute inset-0" onClick={(e) => e.stopPropagation()} />
      {rect ? (
        <div style={holeStyle} className="ring-2 ring-primary/60 transition-all duration-300" />
      ) : (
        <div className="absolute inset-0 bg-[rgba(2,6,12,0.72)]" />
      )}

      <div
        style={bubbleStyle}
        className="w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-primary/30 bg-surface/95 backdrop-blur-md p-5 shadow-[0_0_30px_rgba(255,143,0,0.15)] animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {step + 1} / {steps.length}
          </span>
          <button
            onClick={onSkip}
            className="text-[11px] font-display font-semibold uppercase tracking-wider text-muted/70 hover:text-text cursor-pointer transition-colors"
          >
            {t('onboarding.skip')}
          </button>
        </div>
        <h3 className="text-sm font-semibold text-text mb-1.5">{current.title}</h3>
        <p className="text-xs text-muted leading-relaxed mb-4">{current.body}</p>
        <button
          onClick={onNext}
          className="w-full h-9 rounded-lg bg-primary text-primary-fg text-xs font-display font-bold uppercase tracking-wider hover:bg-primary/90 cursor-pointer transition-colors"
        >
          {isLast ? t('onboarding.finish') : t('onboarding.next')}
        </button>
      </div>
    </div>
  );
}
