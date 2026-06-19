import { NavLink } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useTranslation } from '../../lib/i18n/I18nContext';
import { legalContent, type LegalDoc } from './legalContent';

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const { t, language } = useTranslation();
  const content = legalContent[doc][language] ?? legalContent[doc].en;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      <NavLink
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wider text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft size={14} /> {t('legal.back')}
      </NavLink>

      <div className="space-y-2">
        <PageHeader title={content.title} />
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted/70">
          {t('legal.updated')}: {content.updated}
        </p>
      </div>

      <p className="text-sm text-text/80 leading-relaxed">{content.intro}</p>

      <div className="space-y-6">
        {content.sections.map((section, i) => (
          <section key={i} className="space-y-2">
            <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text flex items-center gap-2">
              <span className="font-mono text-primary/60">{String(i + 1).padStart(2, '0')}</span>
              {section.heading}
            </h2>
            {section.body.map((p, j) => (
              <p key={j} className="text-[13px] text-muted leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
