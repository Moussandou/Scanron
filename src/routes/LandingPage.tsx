import { NavLink } from 'react-router-dom';
import { Radar, Binary, QrCode, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTranslation } from '../lib/i18n/I18nContext';
import { RadarConsole } from '../components/dashboard/RadarConsole';
import { useAuth } from '../lib/auth/useAuth';
import { useAccounts } from '../lib/db/hooks';
import {
  SeedDecodingVisual,
  ZeroCredentialsVisual,
  MultiAccountVisual,
  DiscordWebhookVisual,
} from '../components/dashboard/FeatureVisuals';

export default function LandingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { accounts } = useAccounts(user?.uid ?? null);

  const activeSeed = new Date().toISOString().split('T')[0];
  const storageMode = user ? 'Firebase Cloud Sync' : 'Browser Local Storage';
  const profileCount = accounts.length;

  const steps = [
    { icon: <Radar size={18} />, text: t('landing.how1') },
    { icon: <Binary size={18} />, text: t('landing.how2') },
    { icon: <QrCode size={18} />, text: t('landing.how3') },
  ];

  return (
    <div className="space-y-20 py-4 animate-in fade-in duration-300">
      {/* Hero */}
      <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] items-center">
        <div className="space-y-7 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[9px] font-bold text-accent uppercase tracking-widest">
              {t('landing.heroStorage')}: {storageMode}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-text leading-[1.05] uppercase">
              {t('landing.title')}
            </h1>
            <p className="text-base sm:text-lg font-display font-bold tracking-wide text-primary">
              {t('landing.tagline')}
            </p>
          </div>

          <p className="text-sm text-muted leading-relaxed max-w-lg">{t('landing.desc')}</p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 w-full">
            <NavLink to="/dashboard">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/95 text-primary-fg font-display uppercase font-black tracking-wider text-xs px-8 py-6 rounded-xl shadow-[0_0_15px_rgba(255,122,0,0.2)] hover:shadow-[0_0_22px_rgba(255,122,0,0.35)] transition-all duration-300"
              >
                {t('landing.launch')}
              </Button>
            </NavLink>
            <NavLink to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-accent/40 text-accent hover:bg-accent/5 font-display uppercase font-black tracking-wider text-xs px-8 py-6 rounded-xl transition-all duration-300"
              >
                {t('landing.sync')}
              </Button>
            </NavLink>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-[10px] font-mono text-muted uppercase tracking-wider">
            <span>SEED {activeSeed}</span>
            <span className="w-1 h-1 rounded-full bg-border/60" />
            <span>{profileCount} profiles</span>
            <span className="w-1 h-1 rounded-full bg-border/60" />
            <span>local JS</span>
          </div>
        </div>

        {/* Signature: radar console over concentric rings */}
        <div className="relative w-full max-w-[420px] mx-auto lg:max-w-none">
          <div
            aria-hidden
            className="absolute inset-0 -m-8 rounded-full opacity-[0.07] pointer-events-none"
            style={{
              background:
                'repeating-radial-gradient(circle at 50% 50%, var(--color-primary) 0 1px, transparent 1px 38px)',
            }}
          />
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-accent/20 to-primary/20 opacity-30 blur-xl animate-pulse" />
          <RadarConsole />
        </div>
      </div>

      {/* How it works — a real sequence, so the numbering carries meaning */}
      <section className="space-y-7">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-display font-semibold uppercase tracking-wider text-muted shrink-0">
            {t('landing.howTitle')}
          </h2>
          <span className="h-px flex-1 bg-border/40" />
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch">
          {steps.map((step, i) => (
            <div key={i} className="contents">
              <div className="group relative rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] p-6 flex flex-col gap-4 transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5">
                <span className="absolute top-4 right-5 font-display text-3xl font-black text-primary/15 leading-none select-none">
                  {i + 1}
                </span>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[inset_0_0_12px_rgba(255,122,0,0.08)]">
                  {step.icon}
                </div>
                <p className="text-[13px] text-text/75 leading-relaxed pr-6">{step.text}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-primary/40">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="space-y-7">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-display font-semibold uppercase tracking-wider text-muted shrink-0">
            {t('landing.features.title')}
          </h2>
          <span className="h-px flex-1 bg-border/40" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 max-w-4xl mx-auto">
          {[
            { title: t('landing.feat1.title'), desc: t('landing.feat1.desc'), visual: <SeedDecodingVisual /> },
            { title: t('landing.feat2.title'), desc: t('landing.feat2.desc'), visual: <ZeroCredentialsVisual /> },
            { title: t('landing.feat3.title'), desc: t('landing.feat3.desc'), visual: <MultiAccountVisual /> },
            { title: t('landing.feat4.title'), desc: t('landing.feat4.desc'), visual: <DiscordWebhookVisual /> },
          ].map((feat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-surface/40 backdrop-blur-sm border border-border space-y-4 flex flex-col justify-between transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5"
            >
              <div className="space-y-2">
                <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text">{feat.title}</h3>
                <p className="text-[11px] text-muted leading-relaxed">{feat.desc}</p>
              </div>
              {feat.visual}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
