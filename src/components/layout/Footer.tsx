import { NavLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ScanronMark } from '../brand/ScanronMark';
import { useTranslation } from '../../lib/i18n/I18nContext';
import { AUTHOR, PORTFOLIO_URL } from '../../routes/legal/legalContent';

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink to={to} className="text-xs text-muted hover:text-primary transition-colors w-fit">
      {children}
    </NavLink>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-12 border-t border-border/60 bg-surface/40 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <ScanronMark size={26} />
            <span className="font-display font-black tracking-[0.2em] text-text uppercase text-sm">Scanron</span>
          </div>
          <p className="text-xs text-muted leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          <p className="text-xs text-muted pt-1">
            {t('footer.builtBy')}{' '}
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {AUTHOR}
              <ArrowUpRight size={12} />
            </a>
          </p>
        </div>

        {/* Navigate */}
        <nav className="flex flex-col gap-2.5">
          <span className="text-[10px] font-display font-bold uppercase tracking-wider text-muted/70">
            {t('footer.navigate')}
          </span>
          <FooterLink to="/dashboard">{t('shell.codes')}</FooterLink>
          <FooterLink to="/settings">{t('shell.settings')}</FooterLink>
        </nav>

        {/* Legal */}
        <nav className="flex flex-col gap-2.5">
          <span className="text-[10px] font-display font-bold uppercase tracking-wider text-muted/70">
            {t('footer.legal')}
          </span>
          <FooterLink to="/legal/privacy">{t('footer.privacy')}</FooterLink>
          <FooterLink to="/legal/terms">{t('footer.terms')}</FooterLink>
          <FooterLink to="/legal/notice">{t('footer.notice')}</FooterLink>
        </nav>
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto max-w-5xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span className="text-[10px] text-muted/70 font-mono">© {year} Scanron</span>
          <p className="text-[10px] text-muted/70 leading-relaxed max-w-lg">{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
