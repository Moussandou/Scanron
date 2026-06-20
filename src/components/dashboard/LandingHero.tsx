import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { CapsuleCorpLogo } from '../brand/CapsuleCorpLogo';
import { StormSky } from '../landing/StormSky';
import { useTranslation } from '../../lib/i18n/I18nContext';
import { qrDataUrl } from '../../lib/qr/image';
import { searchCode } from '../../lib/qr/shenron';
import { isValidFriendCode } from '../../lib/db/validation';

const DEMO_CODE = 'dr85d9jy';

// Radar graticule: 60 tick marks, every 5th major. Bearings and a few blips
// give the scope a real instrument feel.
const TICKS = Array.from({ length: 60 }, (_, i) => i * 6);
const BLIPS = [
  { a: 34, r: 96, tone: 'var(--color-primary)' },
  { a: 168, r: 58, tone: 'var(--color-accent)' },
  { a: 286, r: 112, tone: 'var(--color-signal)' },
];

// Drifting ki orbs (energy motes), fixed seeds so the composition is stable.
const ORBS = [
  { top: '24%', left: '90%', size: 8, dur: '6s', delay: '0.5s', tone: 'var(--color-primary)' },
  { top: '78%', left: '84%', size: 6, dur: '7.5s', delay: '2s', tone: 'var(--color-signal)' },
  { top: '46%', left: '50%', size: 5, dur: '9s', delay: '3s', tone: 'var(--color-accent)' },
  { top: '18%', left: '40%', size: 4, dur: '8s', delay: '1.5s', tone: 'var(--color-signal)' },
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

      {/* Shenron looming in the storm, behind the console */}
      <img
        src="/shenron-ascii.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[min(880px,80vw)] max-w-none -translate-x-[62%] -translate-y-1/2 animate-[floaty_9s_ease-in-out_infinite] opacity-[0.55] [filter:drop-shadow(0_0_30px_rgba(16,185,129,0.5))] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_85%)]"
      />

      {/* Drifting ki orbs */}
      {ORBS.map((o, i) => (
        <span
          key={i}
          className="pointer-events-none absolute block -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            top: o.top,
            left: o.left,
            width: o.size,
            height: o.size,
            background: o.tone,
            boxShadow: `0 0 12px ${o.tone}`,
            animation: `floaty ${o.dur} ease-in-out ${o.delay} infinite`,
          }}
        />
      ))}

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 lg:grid-cols-12">
        {/* Pitch */}
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500 lg:col-span-6 xl:col-span-7">
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

              <div className="relative rounded-[1.6rem] bg-[linear-gradient(140deg,rgba(255,122,0,0.55),rgba(14,165,233,0.18)_45%,rgba(16,185,129,0.5))] p-[1.5px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)]">
                <div className="relative overflow-hidden rounded-[1.55rem] bg-[#070d15]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
                  {/* Holographic scanlines + corner brackets */}
                  <div className="pointer-events-none absolute inset-0 z-30 opacity-[0.05] [background:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_3px)]" />
                  <span className="pointer-events-none absolute left-2.5 top-2.5 z-30 h-4 w-4 rounded-tl border-l border-t border-white/25" />
                  <span className="pointer-events-none absolute right-2.5 top-2.5 z-30 h-4 w-4 rounded-tr border-r border-t border-white/25" />
                  <span className="pointer-events-none absolute bottom-2.5 left-2.5 z-30 h-4 w-4 rounded-bl border-b border-l border-white/25" />
                  <span className="pointer-events-none absolute bottom-2.5 right-2.5 z-30 h-4 w-4 rounded-br border-b border-r border-white/25" />

                  {/* Brand bar */}
                  <div className="relative flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <CapsuleCorpLogo size={18} />
                      <div className="leading-none">
                        <div className="font-display text-[11px] font-black uppercase tracking-[0.18em] text-white">Dragon Radar</div>
                        <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.25em] text-white/40">Capsule Corp · MK II</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-3.5 items-end gap-0.5">
                        {[4, 7, 10, 13].map((h, i) => (
                          <span key={i} className="w-0.5 rounded-sm bg-signal" style={{ height: h, opacity: 0.4 + i * 0.14 }} />
                        ))}
                      </div>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
                      </span>
                      <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-signal">Online</span>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="relative px-4 pt-4">
                    <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-black/40 px-2 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition focus-within:border-accent/60 focus-within:shadow-[0_0_0_1px_rgba(14,165,233,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <span className="rounded-md bg-accent/15 px-2 py-1.5 font-mono text-[8px] font-bold uppercase tracking-wider text-accent">Code</span>
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value.trim())}
                        spellCheck={false}
                        autoComplete="off"
                        placeholder={t('landing.codePlaceholder')}
                        className="flex-1 bg-transparent py-2 font-mono text-sm tracking-[0.18em] text-white placeholder:text-white/25 focus:outline-none"
                      />
                      <span className={`rounded-md px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider ${valid ? 'bg-signal/15 text-signal' : 'bg-white/5 text-white/40'}`}>
                        {valid ? t('landing.locked') : code ? t('landing.invalid') : t('landing.awaiting')}
                      </span>
                    </div>
                  </div>

                  {/* Scope */}
                  <div className="relative flex h-[300px] items-center justify-center">
                    {/* Graticule ticks */}
                    <div className="absolute h-[250px] w-[250px]">
                      {TICKS.map((a) => {
                        const major = a % 30 === 0;
                        return (
                          <span key={a} className="absolute left-1/2 top-0 origin-[center_125px] -translate-x-1/2" style={{ transform: `rotate(${a}deg)` }}>
                            <span className={`block w-px ${major ? 'h-3 bg-accent/55' : 'h-1.5 bg-accent/25'}`} />
                          </span>
                        );
                      })}
                    </div>
                    {/* Rings + crosshair */}
                    <div className="absolute h-[250px] w-[250px] rounded-full border border-accent/15" />
                    <div className="absolute h-[172px] w-[172px] rounded-full border border-accent/12" />
                    <div className="absolute h-[96px] w-[96px] rounded-full border border-accent/15" />
                    <div className="absolute h-px w-[250px] bg-accent/10" />
                    <div className="absolute h-[250px] w-px bg-accent/10" />
                    {/* Bearings */}
                    <div className="pointer-events-none absolute h-[250px] w-[250px] font-mono text-[7px] tracking-widest text-white/30">
                      <span className="absolute left-1/2 top-0.5 -translate-x-1/2">N</span>
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2">S</span>
                      <span className="absolute left-0.5 top-1/2 -translate-y-1/2">W</span>
                      <span className="absolute right-0.5 top-1/2 -translate-y-1/2">E</span>
                    </div>
                    {/* Sweep */}
                    <div
                      className="absolute h-[250px] w-[250px] animate-[radar-sweep_6s_linear_infinite] rounded-full"
                      style={{ background: 'conic-gradient(from 0deg, rgba(255,122,0,0.30) 0deg, rgba(255,122,0,0.05) 42deg, transparent 72deg 360deg)', transformOrigin: 'center' }}
                    />
                    {/* Blips — fade out once a target is locked */}
                    {!(valid && src) &&
                      BLIPS.map((b, i) => (
                        <span key={i} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${b.a}deg) translateY(-${b.r}px)` }}>
                          <span className="block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full" style={{ background: b.tone, boxShadow: `0 0 8px ${b.tone}` }} />
                        </span>
                      ))}

                    {/* Center result */}
                    {valid && src ? (
                      <div className="animate-in fade-in zoom-in-90 relative z-20 duration-300">
                        <div className="relative h-[152px] w-[152px] rounded-2xl bg-white p-3 shadow-[0_0_44px_rgba(16,185,129,0.45)] ring-1 ring-white/40">
                          <span className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-tl-sm border-l-2 border-t-2 border-primary" />
                          <span className="absolute right-1.5 top-1.5 h-3.5 w-3.5 rounded-tr-sm border-r-2 border-t-2 border-primary" />
                          <span className="absolute bottom-1.5 left-1.5 h-3.5 w-3.5 rounded-bl-sm border-b-2 border-l-2 border-primary" />
                          <span className="absolute bottom-1.5 right-1.5 h-3.5 w-3.5 rounded-br-sm border-b-2 border-r-2 border-primary" />
                          <img src={src} alt="Generated Shenron QR" className="h-full w-full object-contain" />
                          <span className="absolute left-0 h-[2px] w-full animate-[scan_2.6s_linear_infinite] bg-accent/70 shadow-[0_0_8px_var(--color-accent)]" />
                        </div>
                        <span className="absolute -right-2 -top-2 flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#070d15] bg-signal" />
                        </span>
                      </div>
                    ) : (
                      <div className="relative z-20 flex flex-col items-center gap-3 text-center">
                        <div className="h-4 w-4 animate-ping rounded-full border-2 border-white/80 bg-accent shadow-[0_0_12px_var(--color-accent)]" />
                        <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                          {t('landing.awaiting')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Telemetry strip */}
                  <div className="grid grid-cols-[1.5fr_1fr_1fr] divide-x divide-white/10 border-t border-white/10 bg-white/[0.02]">
                    <div className="px-3 py-2.5">
                      <div className="font-mono text-[7px] uppercase tracking-widest text-white/35">Seed</div>
                      <div className="mt-0.5 truncate font-mono text-[10px] text-accent">{valid ? searchCode(code) : '—'}</div>
                    </div>
                    <div className="px-3 py-2.5">
                      <div className="font-mono text-[7px] uppercase tracking-widest text-white/35">Range</div>
                      <div className="mt-0.5 font-mono text-[10px] text-white/70">On-device</div>
                    </div>
                    <div className="px-3 py-2.5">
                      <div className="font-mono text-[7px] uppercase tracking-widest text-white/35">Output</div>
                      <div className={`mt-0.5 font-mono text-[10px] ${valid ? 'text-signal' : 'text-white/40'}`}>{valid ? 'Real QR' : 'Idle'}</div>
                    </div>
                  </div>
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
