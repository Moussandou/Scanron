import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { DragonBallIcon } from '../brand/DragonBallIcon';
import { useTranslation } from '../../lib/i18n/I18nContext';

const COUNT = 7;
// Seven balls laid out as a ring on the ground at Shenron's feet (an ellipse so
// it reads in perspective). Star count goes 1..7 around the circle.
const RING = Array.from({ length: COUNT }, (_, i) => {
  const a = (-90 + i * (360 / COUNT)) * (Math.PI / 180);
  return { stars: i + 1, x: 50 + 46 * Math.cos(a), y: 50 + 50 * Math.sin(a) };
});

export function SummonCTA() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);

  const complete = count >= COUNT;

  // Lock the balls one by one; hold on the summoned dragon, then sweep again.
  useEffect(() => {
    const id = setTimeout(
      () => setCount((c) => (c >= COUNT ? 0 : c + 1)),
      complete ? 3200 : 520,
    );
    return () => clearTimeout(id);
  }, [count, complete]);

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mb-8 w-screen overflow-hidden bg-[#04070d] text-white">
      {/* Storm sky */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(16,185,129,0.14),transparent_55%),linear-gradient(rgba(2,6,16,0.6),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.04)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]" />
      {complete && (
        <div className="pointer-events-none absolute inset-0 animate-[sky-flash_2.6s_ease-out_infinite] bg-[radial-gradient(ellipse_at_50%_25%,rgba(180,240,255,0.4),transparent_60%)]" />
      )}

      {/* Shenron rising — ASCII summon */}
      <div
        key={complete ? 'rise' : 'idle'}
        className={`pointer-events-none absolute bottom-24 left-1/2 z-[2] w-[680px] max-w-[94vw] -translate-x-1/2 transition-opacity duration-700 ${
          complete ? 'animate-[shenron-rise_1s_cubic-bezier(0.16,1,0.3,1)_both] opacity-100' : 'opacity-0'
        }`}
        style={{ filter: 'drop-shadow(0 0 26px rgba(16,185,129,0.55))' }}
      >
        <img src="/shenron-ascii.svg" alt="" className="h-auto w-full origin-bottom" />
      </div>

      {/* Vignette to seat the copy */}
      <div className="absolute left-1/2 top-1/2 z-[1] h-[440px] w-[620px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(4,7,13,0.78)_30%,transparent_74%)]" />

      {/* Copy */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-5 px-4 pb-[300px] pt-28 text-center">
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

      {/* The seven Dragon Balls — a ring on the ground at Shenron's feet */}
      <div className="pointer-events-none absolute bottom-16 left-1/2 z-20 h-[150px] w-[360px] max-w-[88vw] -translate-x-1/2">
        {/* faint ground ring */}
        <div className="absolute inset-x-0 top-1/2 h-[100px] -translate-y-1/2 rounded-[50%] border border-primary/15" />
        {RING.map((b, i) => {
          const locked = i < count;
          return (
            <span
              key={b.stars}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                animation: locked ? 'orbit-drift 4s ease-in-out infinite' : undefined,
              }}
            >
              {locked && <span className="absolute -inset-2 animate-pulse rounded-full bg-primary/40 blur-md" />}
              <DragonBallIcon
                size={locked ? 44 : 30}
                stars={b.stars}
                className="relative transition-all duration-500"
                style={{
                  opacity: locked ? 1 : 0.28,
                  filter: locked ? 'drop-shadow(0 0 12px rgba(255,122,0,0.6))' : 'grayscale(0.6)',
                }}
              />
            </span>
          );
        })}
      </div>
    </section>
  );
}
