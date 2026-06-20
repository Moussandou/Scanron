import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { CapsuleCorpLogo } from '../brand/CapsuleCorpLogo';
import { DragonBallIcon } from '../brand/DragonBallIcon';
import { StormSky } from '../landing/StormSky';
import { useTranslation } from '../../lib/i18n/I18nContext';
import { qrDataUrl } from '../../lib/qr/image';
import { searchCode } from '../../lib/qr/shenron';
import { isValidFriendCode } from '../../lib/db/validation';

const DEMO_CODE = 'dr85d9jy';

// Floating dragon balls + ki orbs, fixed seeds so the composition is stable.
const ORBS = [
  { top: '16%', left: '6%', size: 34, dur: '7s', delay: '0s', ball: true },
  { top: '64%', left: '14%', size: 22, dur: '8.5s', delay: '1.2s', ball: true },
  { top: '24%', left: '90%', size: 8, dur: '6s', delay: '0.5s', tone: 'var(--color-primary)' },
  { top: '78%', left: '84%', size: 6, dur: '7.5s', delay: '2s', tone: 'var(--color-signal)' },
  { top: '46%', left: '50%', size: 5, dur: '9s', delay: '3s', tone: 'var(--color-accent)' },
];

/**
 * Cinematic dark "radar cockpit" hero: an oversized headline over a deep grid,
 * a giant off-axis radar scope, floating Dragon Balls, and a live decoder
 * console that tilts in 3D under the pointer. The console runs the real shenron
 * pipeline — type a friend code and a genuine, scannable QR locks in.
 */
export function LandingHero() {
  const { t } = useTranslation();
  const [code, setCode] = useState(DEMO_CODE);
  const [src, setSrc] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 3D tilt driven straight to the DOM (no React state, no rAF loop) so the
  // console reacts to the pointer without re-rendering the live decoder.
  const tiltRef = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const valid = isValidFriendCode(code);

  useEffect(() => {
    if (!valid) return;
    if (timer.current) clearTimeout(timer.current);
    let stale = false;
    timer.current = setTimeout(() => {
      qrDataUrl(code).then((url) => { if (!stale) setSrc(url); });
    }, 220);
    return () => {
      stale = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [code, valid]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = tiltRef.current;
    if (!el || reduce.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${px * 12}deg`);
    el.style.setProperty('--rx', `${-py * 9}deg`);
  };
  const onLeave = () => {
    const el = tiltRef.current;
    if (el) {
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--rx', '0deg');
    }
  };

  return (
    <section
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 flex w-screen items-center overflow-hidden bg-[#03080b] py-20 text-white lg:min-h-[90vh] lg:py-0"
    >
      {/* The summoning storm */}
      <StormSky />

      {/* Warm orange aura so the energy reads against the green storm */}
      <div className="pointer-events-none absolute -top-32 right-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,122,0,0.14)_0%,transparent_62%)]" />

      {/* Floating Dragon Balls + ki orbs */}
      {ORBS.map((o, i) => (
        <span
          key={i}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: o.top, left: o.left, animation: `floaty ${o.dur} ease-in-out ${o.delay} infinite` }}
        >
          {o.ball ? (
            <DragonBallIcon size={o.size} style={{ filter: 'drop-shadow(0 0 14px rgba(255,122,0,0.4))', opacity: 0.85 }} />
          ) : (
            <span
              className="block rounded-full"
              style={{ width: o.size, height: o.size, background: o.tone, boxShadow: `0 0 12px ${o.tone}` }}
            />
          )}
        </span>
      ))}

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 lg:grid-cols-12">
        {/* Pitch */}
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500 lg:col-span-6 xl:col-span-7">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 backdrop-blur-sm">
            <CapsuleCorpLogo size={16} />
            <span className="h-3.5 w-px bg-white/15" />
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-white/70">
              {t('landing.liveDecoder')}
            </span>
          </div>

          <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight [text-shadow:0_0_40px_rgba(255,122,0,0.25)] sm:text-6xl xl:text-7xl">
            {t('landing.title')}
          </h1>
          <p className="max-w-md font-display text-lg font-bold tracking-wide text-primary sm:text-xl">
            {t('landing.tagline')}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <NavLink to="/dashboard">
              <Button size="lg" className="rounded-xl px-8 py-6 shadow-[0_0_28px_rgba(255,122,0,0.45)] transition-transform active:translate-y-px">
                {t('landing.launch')} <ArrowRight size={15} />
              </Button>
            </NavLink>
            <NavLink to="/login">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-xl px-8 py-6 text-white/80 hover:bg-white/10 hover:text-white"
              >
                {t('landing.sync')}
              </Button>
            </NavLink>
          </div>
        </div>

        {/* Live radar scope — floats and tilts in 3D under the pointer */}
        <div className="lg:col-span-6 xl:col-span-5 lg:[perspective:1200px]">
          <div className="animate-[floaty_6s_ease-in-out_infinite] lg:-mr-8 xl:-mr-16">
            <div
              ref={tiltRef}
              className="relative transition-transform duration-300 ease-out [transform:perspective(1200px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d]"
            >
              {/* Aura behind the console */}
              <div className="pointer-events-none absolute -inset-6 animate-[aura-pulse_5s_ease-in-out_infinite] rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgba(255,122,0,0.22),transparent_70%)]" />

              <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-[#090f19]/85 shadow-[0_40px_100px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm">
                {/* Console header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                  <span className="font-display text-[10px] font-black uppercase tracking-widest text-white/70">
                    Capsule Corp // Scope
                  </span>
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                  </div>
                </div>

                {/* Input */}
                <div className="px-4 pt-4">
                  <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-white/40">
                    {t('landing.tryLabel')}
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-black/30 px-3 transition-colors focus-within:border-accent/50">
                    <span className="font-mono text-sm text-accent">&#9656;</span>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.trim())}
                      spellCheck={false}
                      autoComplete="off"
                      placeholder={t('landing.codePlaceholder')}
                      className="flex-1 bg-transparent py-2.5 font-mono text-sm tracking-wider text-white placeholder:text-white/30 focus:outline-none"
                    />
                    <span
                      className={`font-mono text-[9px] font-bold uppercase tracking-wider ${valid ? 'text-signal' : 'text-white/30'}`}
                    >
                      {valid ? t('landing.locked') : code ? t('landing.invalid') : t('landing.awaiting')}
                    </span>
                  </div>
                </div>

                {/* Scope */}
                <div className="relative flex h-[300px] items-center justify-center p-6">
                  <div className="absolute h-[260px] w-[260px] rounded-full border-2 border-accent/15" />
                  <div className="absolute h-[180px] w-[180px] rounded-full border border-accent/15" />
                  <div className="absolute h-[100px] w-[100px] rounded-full border border-accent/20" />
                  <div className="absolute h-px w-[260px] bg-accent/10" />
                  <div className="absolute h-[260px] w-px bg-accent/10" />
                  <div
                    className="absolute h-[260px] w-[260px] animate-[radar-sweep_6s_linear_infinite] rounded-full opacity-70"
                    style={{
                      background: 'conic-gradient(from 0deg, rgba(255,122,0,0.22) 0deg, transparent 55deg 360deg)',
                      transformOrigin: 'center',
                    }}
                  />

                  {valid && src ? (
                    <div className="animate-in fade-in zoom-in-90 relative z-10 duration-300">
                      <div className="relative h-[150px] w-[150px] rounded-xl bg-white p-3 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                        <span className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-tl-sm border-l-2 border-t-2 border-primary" />
                        <span className="absolute right-1.5 top-1.5 h-3.5 w-3.5 rounded-tr-sm border-r-2 border-t-2 border-primary" />
                        <span className="absolute bottom-1.5 left-1.5 h-3.5 w-3.5 rounded-bl-sm border-b-2 border-l-2 border-primary" />
                        <span className="absolute bottom-1.5 right-1.5 h-3.5 w-3.5 rounded-br-sm border-b-2 border-r-2 border-primary" />
                        <img src={src} alt="Generated Shenron QR" className="h-full w-full object-contain" />
                        <span className="absolute left-0 h-[2px] w-full animate-[scan_2.6s_linear_infinite] bg-accent/70 shadow-[0_0_8px_var(--color-accent)]" />
                      </div>
                      <span className="absolute -right-2 -top-2 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#090f19] bg-signal" />
                      </span>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                      <div className="h-4 w-4 animate-ping rounded-full border-2 border-white/80 bg-accent shadow-[0_0_12px_var(--color-accent)]" />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                        {t('landing.awaiting')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer readout */}
                <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="truncate font-mono text-[10px] text-accent/80">
                    {valid ? searchCode(code) : '—'}
                  </span>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-signal/80">
                    {valid ? t('landing.realQr') : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fade into the light page below */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-bg" />
    </section>
  );
}
