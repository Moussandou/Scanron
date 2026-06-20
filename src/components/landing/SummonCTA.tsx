import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
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

  // Lock the balls one by one, hold at 7, then sweep again.
  useEffect(() => {
    const id = setInterval(() => setCount((c) => (c >= BALLS.length ? 0 : c + 1)), 520);
    return () => clearInterval(id);
  }, []);

  const complete = count >= BALLS.length;

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen -mb-8 overflow-hidden bg-[#070c14] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Radar scope backdrop */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] max-w-[92vw] max-h-[92vw]">
        <div className="absolute inset-0 rounded-full border border-accent/15" />
        <div className="absolute inset-[14%] rounded-full border border-accent/15" />
        <div className="absolute inset-[30%] rounded-full border border-accent/20" />
        <div className="absolute inset-[46%] rounded-full border border-accent/25" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-accent/10" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-accent/10" />
        {/* sweep */}
        <div
          className="absolute inset-0 rounded-full opacity-60 animate-[radar-sweep_6s_linear_infinite]"
          style={{ background: 'conic-gradient(from 0deg, rgba(255,122,0,0.18) 0deg, transparent 60deg 360deg)' }}
        />
        {/* Dragon Balls */}
        {BALLS.map((ball, i) => {
          const locked = i < count;
          return (
            <span
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ top: ball.top, left: ball.left }}
            >
              {locked && (
                <span className="absolute -inset-2 rounded-full bg-primary/40 blur-md animate-pulse" />
              )}
              <span
                className={`relative block rounded-full transition-all duration-500 ${
                  locked
                    ? 'w-3.5 h-3.5 bg-primary shadow-[0_0_12px_#ff7a00]'
                    : 'w-2 h-2 bg-white/15'
                }`}
              />
            </span>
          );
        })}
        {/* core */}
        <span
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ${
            complete ? 'w-6 h-6 bg-signal shadow-[0_0_30px_var(--color-signal)]' : 'w-3 h-3 bg-accent shadow-[0_0_12px_var(--color-accent)]'
          }`}
        />
      </div>

      {/* Vignette so copy stays legible over the scope */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[400px] bg-[radial-gradient(ellipse,rgba(7,12,20,0.85)_30%,transparent_75%)]" />

      {/* Copy */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-24 flex flex-col items-center text-center gap-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04]">
          <span className="relative flex h-1.5 w-1.5">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${complete ? 'bg-signal' : 'bg-primary'}`} />
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${complete ? 'bg-signal' : 'bg-primary'}`} />
          </span>
          <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ${complete ? 'text-signal' : 'text-primary'}`}>
            {complete ? t('landing.ctaReady') : `${count}/7 ${t('landing.ctaSignal')}`}
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight leading-[1.05]">
          {t('landing.ctaTitle')}
        </h2>
        <p className="text-sm text-white/60 leading-relaxed max-w-md">{t('landing.ctaDesc')}</p>

        <NavLink to="/dashboard" className="pt-2">
          <Button size="lg" className="px-10 py-6 rounded-xl shadow-[0_0_28px_rgba(255,122,0,0.45)]">
            {t('landing.launch')} <ArrowRight size={16} />
          </Button>
        </NavLink>
      </div>
    </section>
  );
}
