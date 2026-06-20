import { Radar, Binary, QrCode, ArrowRight } from 'lucide-react';
import { useTranslation } from '../lib/i18n/I18nContext';
import { LandingHero } from '../components/dashboard/LandingHero';
import {
  SeedDecodingVisual,
  ZeroCredentialsVisual,
  MultiAccountVisual,
  DiscordWebhookVisual,
} from '../components/dashboard/FeatureVisuals';

export default function LandingPage() {
  const { t } = useTranslation();

  const steps = [
    { icon: <Radar size={18} />, text: t('landing.how1') },
    { icon: <Binary size={18} />, text: t('landing.how2') },
    { icon: <QrCode size={18} />, text: t('landing.how3') },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <LandingHero />

      <div className="space-y-20 py-12">
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
    </div>
  );
}
