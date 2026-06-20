import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { CapsuleCorpLogo } from '../brand/CapsuleCorpLogo';
import { useTranslation } from '../../lib/i18n/I18nContext';
import { qrDataUrl } from '../../lib/qr/image';
import { searchCode } from '../../lib/qr/shenron';
import { isValidFriendCode } from '../../lib/db/validation';

const DEMO_CODE = 'dr85d9jy';

// Rising ki orbs — fixed seeds so the layout is stable, staggered like energy.
const EMBERS = [
  { left: '8%', delay: '0s', dur: '5.5s', size: 6, tone: 'var(--color-primary)', op: 0.5 },
  { left: '22%', delay: '1.4s', dur: '6.5s', size: 4, tone: 'var(--color-signal)', op: 0.45 },
  { left: '70%', delay: '0.8s', dur: '7s', size: 5, tone: 'var(--color-accent)', op: 0.4 },
  { left: '86%', delay: '2.2s', dur: '6s', size: 7, tone: 'var(--color-primary)', op: 0.4 },
  { left: '54%', delay: '3s', dur: '8s', size: 3, tone: 'var(--color-signal)', op: 0.5 },
];

/**
 * Light "Capsule Corp lab" hero with a live decoder: type a friend code and the
 * scope locks on, producing a real, scannable QR. The product is the hero — this
 * is the same shenron logic the app uses, not a mock.
 */
export function LandingHero() {
  const { t } = useTranslation();
  const [code, setCode] = useState(DEMO_CODE);
  const [src, setSrc] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const valid = isValidFriendCode(code);

  // Debounced live generation — real QR via the production pipeline.
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

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden border-b border-border bg-bg">
      {/* Capsule Corp blueprint grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      {/* Ambient energy auras */}
      <div className="pointer-events-none absolute -top-48 left-[60%] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,122,0,0.13)_0%,transparent_62%)]" />
      <div className="pointer-events-none absolute top-1/3 left-[10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.10)_0%,transparent_65%)]" />

      {/* Rising ki embers */}
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="pointer-events-none absolute bottom-24 rounded-full"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            background: e.tone,
            ['--ember-opacity' as string]: e.op,
            boxShadow: `0 0 10px ${e.tone}`,
            animation: `ember-rise ${e.dur} ease-in ${e.delay} infinite`,
          }}
        />
      ))}

      <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        {/* Pitch */}
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 shadow-[var(--shadow-card)] backdrop-blur-sm">
            <CapsuleCorpLogo size={16} />
            <span className="h-3.5 w-px bg-border" />
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
              {t('landing.liveDecoder')}
            </span>
          </div>

          <h1 className="font-display text-4xl font-black uppercase leading-[1.02] tracking-tight text-text sm:text-5xl lg:text-6xl">
            {t('landing.title')}
          </h1>
          <p className="max-w-md font-display text-lg font-bold tracking-wide text-primary sm:text-xl">
            {t('landing.tagline')}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <NavLink to="/dashboard">
              <Button size="lg" className="rounded-xl px-8 py-6 shadow-[0_8px_28px_-6px_rgba(255,122,0,0.5)] transition-transform active:translate-y-px">
                {t('landing.launch')} <ArrowRight size={15} />
              </Button>
            </NavLink>
            <NavLink to="/login">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-border px-8 py-6 text-text hover:border-accent/40 hover:bg-accent/5"
              >
                {t('landing.sync')}
              </Button>
            </NavLink>
          </div>
        </div>

        {/* Live radar scope — light Capsule Corp console */}
        <div className="animate-in fade-in zoom-in-95 relative duration-700">
          {/* Energy aura behind the console */}
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgba(255,122,0,0.16),transparent_70%)] animate-[aura-pulse_5s_ease-in-out_infinite]" />

          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-pop)]">
            {/* Console header */}
            <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-4 py-2.5">
              <span className="font-display text-[10px] font-black uppercase tracking-widest text-muted">
                Capsule Corp // Scope
              </span>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="h-2 w-2 rounded-full bg-border" />
              </div>
            </div>

            {/* Input */}
            <div className="px-4 pt-4">
              <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-muted">
                {t('landing.tryLabel')}
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/50 px-3 transition-colors focus-within:border-accent/60">
                <span className="font-mono text-sm text-accent">&#9656;</span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder={t('landing.codePlaceholder')}
                  className="flex-1 bg-transparent py-2.5 font-mono text-sm tracking-wider text-text placeholder:text-muted/60 focus:outline-none"
                />
                <span
                  className={`font-mono text-[9px] font-bold uppercase tracking-wider ${valid ? 'text-signal' : 'text-muted'}`}
                >
                  {valid ? t('landing.locked') : code ? t('landing.invalid') : t('landing.awaiting')}
                </span>
              </div>
            </div>

            {/* Scope */}
            <div className="relative flex h-[300px] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_70%)] p-6">
              {/* Rings */}
              <div className="absolute h-[260px] w-[260px] rounded-full border-2 border-accent/15" />
              <div className="absolute h-[180px] w-[180px] rounded-full border border-accent/15" />
              <div className="absolute h-[100px] w-[100px] rounded-full border border-accent/20" />
              <div className="absolute h-px w-[260px] bg-accent/10" />
              <div className="absolute h-[260px] w-px bg-accent/10" />
              {/* Sweep */}
              <div
                className="absolute h-[260px] w-[260px] animate-[radar-sweep_6s_linear_infinite] rounded-full opacity-70"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(255,122,0,0.20) 0deg, transparent 55deg 360deg)',
                  transformOrigin: 'center',
                }}
              />

              {/* Result: real QR resolves in the scope when locked */}
              {valid && src ? (
                <div className="animate-in fade-in zoom-in-90 relative z-10 duration-300">
                  <div className="relative h-[150px] w-[150px] rounded-xl bg-white p-3 shadow-[0_0_30px_rgba(16,185,129,0.35)] ring-1 ring-border">
                    <span className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-tl-sm border-l-2 border-t-2 border-primary" />
                    <span className="absolute right-1.5 top-1.5 h-3.5 w-3.5 rounded-tr-sm border-r-2 border-t-2 border-primary" />
                    <span className="absolute bottom-1.5 left-1.5 h-3.5 w-3.5 rounded-bl-sm border-b-2 border-l-2 border-primary" />
                    <span className="absolute bottom-1.5 right-1.5 h-3.5 w-3.5 rounded-br-sm border-b-2 border-r-2 border-primary" />
                    <img src={src} alt="Generated Shenron QR" className="h-full w-full object-contain" />
                    <span className="absolute left-0 h-[2px] w-full animate-[scan_2.6s_linear_infinite] bg-accent/70 shadow-[0_0_8px_var(--color-accent)]" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-surface bg-signal" />
                  </span>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                  <div className="h-4 w-4 animate-ping rounded-full border-2 border-surface bg-accent shadow-[0_0_12px_var(--color-accent)]" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
                    {t('landing.awaiting')}
                  </span>
                </div>
              )}
            </div>

            {/* Footer readout */}
            <div className="flex items-center justify-between gap-3 border-t border-border bg-surface-2/60 px-4 py-3">
              <span className="truncate font-mono text-[10px] text-accent">
                {valid ? searchCode(code) : '—'}
              </span>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-signal">
                {valid ? t('landing.realQr') : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
