import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ShenronDragon } from '../brand/ShenronDragon';
import { useTranslation } from '../../lib/i18n/I18nContext';

// Seven Dragon Ball positions around the scope, leaving the centre clear for copy.
const BALLS = [
  { top: '14%', left: '30%', stars: 1 },
  { top: '12%', left: '64%', stars: 2 },
  { top: '38%', left: '83%', stars: 3 },
  { top: '70%', left: '74%', stars: 4 },
  { top: '84%', left: '46%', stars: 5 },
  { top: '66%', left: '17%', stars: 6 },
  { top: '36%', left: '13%', stars: 7 },
];

export function SummonCTA() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);

  const complete = count >= BALLS.length;

  // Lock the balls one by one; once all seven are in, hold on the summoned
  // dragon for a beat, then the storm clears and the sweep restarts. The next
  // step is scheduled from `count` (a pure updater) so it stays StrictMode-safe.
  useEffect(() => {
    const id = setTimeout(
      () => setCount((c) => (c >= BALLS.length ? 0 : c + 1)),
      complete ? 2800 : 520,
    );
    return () => clearTimeout(id);
  }, [count, complete]);

  return (
    <section
      className={`relative left-1/2 right-1/2 -mx-[50vw] -mb-8 w-screen overflow-hidden text-white transition-colors duration-700 ${
        complete ? 'bg-[#04070d]' : 'bg-[#070c14]'
      }`}
    >
      {/* Storm sky */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(rgba(2,6,16,0.6),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      {/* Lightning flicker — only crackles once the dragon is summoned */}
      {complete && (
        <div className="pointer-events-none absolute inset-0 animate-[storm-flicker_2.4s_ease-out_infinite] bg-[radial-gradient(ellipse_at_50%_30%,rgba(110,231,183,0.35),transparent_60%)]" />
      )}

      {/* Radar scope backdrop */}
      <div className="absolute left-1/2 top-1/2 h-[520px] max-h-[92vw] w-[520px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full border border-accent/15" />
        <div className="absolute inset-[14%] rounded-full border border-accent/15" />
        <div className="absolute inset-[30%] rounded-full border border-accent/20" />
        <div className="absolute inset-[46%] rounded-full border border-accent/25" />
        <div className="absolute bottom-0 left-1/2 top-0 w-px bg-accent/10" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-accent/10" />
        {/* sweep */}
        <div
          className="absolute inset-0 animate-[radar-sweep_6s_linear_infinite] rounded-full opacity-60"
          style={{ background: 'conic-gradient(from 0deg, rgba(255,122,0,0.18) 0deg, transparent 60deg 360deg)' }}
        />
        {/* Dragon Balls */}
        {BALLS.map((ball, i) => {
          const locked = i < count;
          return (
            <span
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ top: ball.top, left: ball.left, animation: locked ? 'orbit-drift 4s ease-in-out infinite' : undefined }}
            >
              {locked && <span className="absolute -inset-2 animate-pulse rounded-full bg-primary/40 blur-md" />}
              <span
                className={`relative block rounded-full transition-all duration-500 ${
                  locked ? 'h-3.5 w-3.5 bg-primary shadow-[0_0_12px_#ff7a00]' : 'h-2 w-2 bg-white/15'
                }`}
              />
            </span>
          );
        })}
        {/* core */}
        <span
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ${
            complete ? 'h-6 w-6 bg-signal shadow-[0_0_30px_var(--color-signal)]' : 'h-3 w-3 bg-accent shadow-[0_0_12px_var(--color-accent)]'
          }`}
        />
      </div>

      {/* Vignette so copy stays legible over the scope (under the dragon) */}
      <div className="absolute left-1/2 top-1/2 z-[1] h-[400px] w-[560px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(4,7,13,0.7)_28%,transparent_72%)]" />

      {/* Shenron erupts from the core when the seven are gathered. Keyed on the
          summon count so the rise animation replays on every completion. Coils
          up the right so it reads clearly behind the copy. */}
      <div
        className={`pointer-events-none absolute bottom-0 left-[62%] z-[2] transition-opacity duration-500 ${
          complete ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ filter: 'drop-shadow(0 0 30px rgba(16,185,129,0.6))' }}
      >
        <ShenronDragon
          key={complete ? 'rise' : 'idle'}
          className="h-[560px] w-[330px] origin-bottom animate-[shenron-rise_0.9s_cubic-bezier(0.16,1,0.3,1)_both]"
        />
      </div>

      {/* Copy */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-5 px-4 py-28 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${complete ? 'bg-signal' : 'bg-primary'}`} />
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${complete ? 'bg-signal' : 'bg-primary'}`} />
          </span>
          <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ${complete ? 'text-signal' : 'text-primary'}`}>
            {complete ? t('landing.ctaReady') : `${count}/7 ${t('landing.ctaSignal')}`}
          </span>
        </div>

        <h2 className="font-display text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl">
          {t('landing.ctaTitle')}
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-white/60">{t('landing.ctaDesc')}</p>

        <NavLink to="/dashboard" className="pt-2">
          <Button size="lg" className="rounded-xl px-10 py-6 shadow-[0_0_28px_rgba(255,122,0,0.45)] transition-transform active:translate-y-px">
            {t('landing.launch')} <ArrowRight size={16} />
          </Button>
        </NavLink>
      </div>
    </section>
  );
}
