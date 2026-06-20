import { Radar, Binary, QrCode } from 'lucide-react';
import { useTranslation } from '../lib/i18n/I18nContext';
import { LandingHero } from '../components/dashboard/LandingHero';
import { FeatureSection } from '../components/landing/FeatureSection';
import { DecodeDemo } from '../components/landing/DecodeDemo';
import { LocalDemo } from '../components/landing/LocalDemo';
import { VaultDemo } from '../components/landing/VaultDemo';
import { DiscordDemo } from '../components/landing/DiscordDemo';
import { SummonCTA } from '../components/landing/SummonCTA';
import { Reveal } from '../components/landing/Reveal';
import { ShenronSpine } from '../components/landing/ShenronSpine';

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-primary to-accent" />
      <h2 className="font-display text-2xl font-black uppercase tracking-wide text-text sm:text-3xl">
        {title}
      </h2>
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

  return (
    <div className="animate-in fade-in duration-300">
      <LandingHero />

      {/* The dragon's energy threads through the whole page and resolves into
          Shenron at the summon below. */}
      <div className="relative">
        <ShenronSpine />

        <div className="relative space-y-28 py-16">
          {/* How it works — a connected signal path */}
          <section className="space-y-12">
            <Reveal>
              <SectionHeading title={t('landing.howTitle')} />
            </Reveal>

            <div className="relative grid gap-10 md:grid-cols-3">
              {/* Connecting signal line (desktop) */}
              <div className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-gradient-to-r from-primary/40 via-accent/50 to-primary/40 md:block" />
              {steps.map((step, i) => (
                <Reveal key={i} delay={i * 110}>
                  <div className="relative flex flex-col items-center gap-3 text-center">
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/30 bg-surface text-primary shadow-[var(--shadow-card)] transition-transform duration-300 hover:scale-105">
                      {step.icon}
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary font-display text-[11px] font-black text-primary-fg shadow-[0_2px_8px_rgba(255,122,0,0.4)]">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text">{step.title}</h3>
                    <p className="max-w-[28ch] text-[13px] leading-relaxed text-muted">{step.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Features — live mini-demos, one section each */}
          <section className="space-y-14">
            <Reveal>
              <SectionHeading title={t('landing.features.title')} />
            </Reveal>

            <div className="space-y-24 lg:space-y-32">
              <Reveal>
                <FeatureSection
                  index="01"
                  eyebrow={t('landing.feat1.tag')}
                  title={t('landing.feat1.title')}
                  desc={t('landing.feat1.desc')}
                  points={[t('landing.feat1.p1'), t('landing.feat1.p2'), t('landing.feat1.p3')]}
                  media={<DecodeDemo />}
                />
              </Reveal>
              <Reveal>
                <FeatureSection
                  index="02"
                  reversed
                  eyebrow={t('landing.feat2.tag')}
                  title={t('landing.feat2.title')}
                  desc={t('landing.feat2.desc')}
                  points={[t('landing.feat2.p1'), t('landing.feat2.p2'), t('landing.feat2.p3')]}
                  media={<LocalDemo />}
                />
              </Reveal>
              <Reveal>
                <FeatureSection
                  index="03"
                  eyebrow={t('landing.feat3.tag')}
                  title={t('landing.feat3.title')}
                  desc={t('landing.feat3.desc')}
                  points={[t('landing.feat3.p1'), t('landing.feat3.p2'), t('landing.feat3.p3')]}
                  media={<VaultDemo />}
                />
              </Reveal>
              <Reveal>
                <FeatureSection
                  index="04"
                  reversed
                  eyebrow={t('landing.feat4.tag')}
                  title={t('landing.feat4.title')}
                  desc={t('landing.feat4.desc')}
                  points={[t('landing.feat4.p1'), t('landing.feat4.p2'), t('landing.feat4.p3')]}
                  media={<DiscordDemo />}
                />
              </Reveal>
            </div>
          </section>
        </div>
      </div>

      {/* Closing CTA — the storm breaks and Shenron is summoned */}
      <SummonCTA />
    </div>
  );
}
