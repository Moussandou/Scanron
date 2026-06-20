import { useLayoutEffect, useState } from 'react';
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

  useLayoutEffect(() => {
    if (!current) return;
    let frame = 0;
    let tries = 0;

    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${current.anchor}"]`);
      if (el) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setRect(el.getBoundingClientRect());
      } else if (tries < 10) {
        // Target may not be mounted yet (e.g. a tab just switched) — retry briefly.
        tries += 1;
        frame = requestAnimationFrame(measure);
      } else {
        setRect(null);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
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

  // Bubble: under the target when there's room, otherwise above; centered if no target.
  const bubbleStyle: React.CSSProperties = (() => {
    if (!rect) {
      return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const below = rect.bottom + 12;
    const placeAbove = below + 200 > vh;
    const left = Math.min(Math.max(rect.left, 16), Math.max(16, vw - 336));
    return placeAbove
      ? { position: 'fixed', bottom: vh - rect.top + 12, left }
      : { position: 'fixed', top: below, left };
  })();

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={current.title}>
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
