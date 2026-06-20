import { NavLink } from 'react-router-dom';
import { Radar, Binary, QrCode, ShieldCheck, Layers, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTranslation } from '../lib/i18n/I18nContext';
import { LandingHero } from '../components/dashboard/LandingHero';
import { ScanronMark } from '../components/brand/ScanronMark';
import {
  SeedDecodingVisual,
  ZeroCredentialsVisual,
  MultiAccountVisual,
  DiscordWebhookVisual,
} from '../components/dashboard/FeatureVisuals';

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="space-y-2">
      <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
        {eyebrow}
      </span>
      <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-wide text-text">{title}</h2>
    </div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();

  const steps = [
    { icon: <Radar size={20} />, title: t('landing.step1'), text: t('landing.how1') },
    { icon: <Binary size={20} />, title: t('landing.step2'), text: t('landing.how2') },
    { icon: <QrCode size={20} />, title: t('landing.step3'), text: t('landing.how3') },
  ];

  const features = [
    { icon: <Binary size={16} />, title: t('landing.feat1.title'), desc: t('landing.feat1.desc'), visual: <SeedDecodingVisual /> },
    { icon: <ShieldCheck size={16} />, title: t('landing.feat2.title'), desc: t('landing.feat2.desc'), visual: <ZeroCredentialsVisual /> },
    { icon: <Layers size={16} />, title: t('landing.feat3.title'), desc: t('landing.feat3.desc'), visual: <MultiAccountVisual /> },
    { icon: <MessageSquare size={16} />, title: t('landing.feat4.title'), desc: t('landing.feat4.desc'), visual: <DiscordWebhookVisual /> },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <LandingHero />

      <div className="space-y-24 py-16">
        {/* How it works — a connected signal path */}
        <section className="space-y-12">
          <SectionHeading eyebrow={t('landing.howEyebrow')} title={t('landing.howTitle')} />

          <div className="relative grid gap-10 md:grid-cols-3">
            {/* Connecting signal line (desktop) */}
            <div className="hidden md:block absolute top-7 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-primary/40 via-accent/50 to-primary/40" />
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center gap-3">
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-surface border-2 border-primary/30 flex items-center justify-center text-primary shadow-[var(--shadow-card)]">
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-fg text-[11px] font-display font-black flex items-center justify-center shadow-[0_2px_8px_rgba(255,122,0,0.4)]">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-bold uppercase text-sm tracking-wider text-text">{step.title}</h3>
                <p className="text-[13px] text-muted leading-relaxed max-w-[28ch]">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="space-y-10">
          <SectionHeading eyebrow={t('landing.featEyebrow')} title={t('landing.features.title')} />

          <div className="grid gap-6 lg:grid-cols-2">
            {features.map((feat, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] overflow-hidden transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]"
              >
                <div className="flex items-start gap-3 p-5 pb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    {feat.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-display font-bold uppercase tracking-wide text-text">{feat.title}</h3>
                    <p className="text-[11px] text-muted leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
                <div className="px-5 pb-5">{feat.visual}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Closing CTA — dark band echoing the hero */}
      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen -mb-8 overflow-hidden bg-[#070c14] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.10] animate-[radar-sweep_16s_linear_infinite] pointer-events-none"
          style={{ background: 'conic-gradient(from 0deg, var(--color-primary) 0deg, transparent 50deg 360deg)' }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 flex flex-col items-center text-center gap-6">
          <ScanronMark size={48} animated />
          <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight leading-tight">
            {t('landing.ctaTitle')}
          </h2>
          <p className="text-sm text-white/60 leading-relaxed max-w-md">{t('landing.ctaDesc')}</p>
          <NavLink to="/dashboard" className="pt-1">
            <Button size="lg" className="px-10 py-6 rounded-xl shadow-[0_0_22px_rgba(255,122,0,0.4)]">
              {t('landing.launch')} <ArrowRight size={15} />
            </Button>
          </NavLink>
        </div>
      </section>
    </div>
  );
}
