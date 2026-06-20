import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n/I18nContext';
import { qrDataUrl } from '../../lib/qr/image';
import { searchCode } from '../../lib/qr/shenron';
import { isValidFriendCode } from '../../lib/db/validation';

const DEMO_CODE = 'dr85d9jy';

/**
 * Full-bleed dark "radar cockpit" hero with a live decoder: type a friend code
 * and the scope locks on, producing a real, scannable QR. The product is the
 * hero — this is the same shenron logic the app uses, not a mock.
 */
export function LandingHero() {
  const { t } = useTranslation();
  const [code, setCode] = useState(DEMO_CODE);
  const [src, setSrc] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const valid = isValidFriendCode(code);

  // Debounced live generation — real QR via the production pipeline. We don't
  // clear src on invalid input; the render gates on `valid` so a stale QR never
  // shows, and keeping it avoids a flicker while typing a new valid code.
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
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen -mt-8 overflow-hidden bg-[#070c14] text-white">
      {/* Coordinate grid + ambient glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(255,122,0,0.10)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 py-16 lg:py-20 grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center">
        {/* Pitch */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-signal/30 bg-signal/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
            <span className="font-mono text-[9px] font-bold text-signal uppercase tracking-widest">
              {t('landing.liveDecoder')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.02] uppercase">
            {t('landing.title')}
          </h1>
          <p className="text-lg sm:text-xl font-display font-bold tracking-wide text-primary">
            {t('landing.tagline')}
          </p>
          <p className="text-sm text-white/60 leading-relaxed max-w-lg">{t('landing.desc')}</p>

          <div className="flex flex-wrap gap-3 pt-1">
            <NavLink to="/dashboard">
              <Button size="lg" className="px-8 py-6 rounded-xl shadow-[0_0_22px_rgba(255,122,0,0.35)]">
                {t('landing.launch')} <ArrowRight size={15} />
              </Button>
            </NavLink>
            <NavLink to="/login">
              <Button size="lg" variant="ghost" className="px-8 py-6 rounded-xl text-white/80 hover:bg-white/10 hover:text-white">
                {t('landing.sync')}
              </Button>
            </NavLink>
          </div>
        </div>

        {/* Live radar scope */}
        <div className="relative animate-in fade-in zoom-in-95 duration-700">
          <div className="rounded-2xl border border-accent/20 bg-[#090f19]/80 backdrop-blur-sm shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Console header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
              <span className="font-display text-[10px] font-black tracking-widest uppercase text-white/70">
                Live Decoder // Scan
              </span>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Input */}
            <div className="px-4 pt-4">
              <label className="block font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1.5">
                {t('landing.tryLabel')}
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-black/30 px-3 focus-within:border-accent/50 transition-colors">
                <span className="font-mono text-accent text-sm">▸</span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder={t('landing.codePlaceholder')}
                  className="flex-1 bg-transparent py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none tracking-wider"
                />
                <span
                  className={`font-mono text-[9px] font-bold uppercase tracking-wider ${valid ? 'text-signal' : 'text-white/30'}`}
                >
                  {valid ? t('landing.locked') : code ? t('landing.invalid') : t('landing.awaiting')}
                </span>
              </div>
            </div>

            {/* Scope */}
            <div className="relative h-[300px] flex items-center justify-center p-6">
              {/* Rings */}
              <div className="absolute w-[260px] h-[260px] rounded-full border-2 border-accent/15" />
              <div className="absolute w-[180px] h-[180px] rounded-full border border-accent/15" />
              <div className="absolute w-[100px] h-[100px] rounded-full border border-accent/20" />
              <div className="absolute w-[260px] h-[1px] bg-accent/10" />
              <div className="absolute h-[260px] w-[1px] bg-accent/10" />
              {/* Sweep */}
              <div
                className="absolute w-[260px] h-[260px] rounded-full opacity-70 animate-[radar-sweep_6s_linear_infinite]"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(255,122,0,0.22) 0deg, transparent 55deg 360deg)',
                  transformOrigin: 'center',
                }}
              />

              {/* Result: real QR resolves in the scope when locked */}
              {valid && src ? (
                <div className="relative z-10 animate-in fade-in zoom-in-90 duration-300">
                  <div className="relative bg-white rounded-xl p-3 shadow-[0_0_30px_rgba(16,185,129,0.35)] w-[150px] h-[150px]">
                    <span className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-primary rounded-tl-sm" />
                    <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-primary rounded-tr-sm" />
                    <span className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-primary rounded-bl-sm" />
                    <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-primary rounded-br-sm" />
                    <img src={src} alt="Generated Shenron QR" className="w-full h-full object-contain" />
                    <span className="absolute left-0 w-full h-[2px] bg-accent/70 shadow-[0_0_8px_var(--color-accent)] animate-[scan_2.6s_linear_infinite]" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-75 animate-ping" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-signal border-2 border-[#090f19]" />
                  </span>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                  <div className="w-4 h-4 rounded-full bg-accent border-2 border-white/80 shadow-[0_0_12px_var(--color-accent)] animate-ping" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                    {t('landing.awaiting')}
                  </span>
                </div>
              )}
            </div>

            {/* Footer readout */}
            <div className="px-4 py-3 border-t border-white/10 bg-white/[0.03] flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] text-accent/80 truncate">
                {valid ? searchCode(code) : '—'}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-signal/80 shrink-0">
                {valid ? t('landing.realQr') : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fade into the light page below */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-bg pointer-events-none" />
    </section>
  );
}
