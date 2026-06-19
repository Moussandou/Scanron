import { CapsuleCorpLogo } from '../brand/CapsuleCorpLogo';
import { useTranslation } from '../../lib/i18n/I18nContext';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-8 border-t border-border/60 bg-surface/30 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <CapsuleCorpLogo size={18} />
          <span className="font-display font-black tracking-widest text-text uppercase text-xs">Scanron</span>
          <span className="text-[10px] text-muted/70 font-mono">© {year}</span>
        </div>
        <p className="text-[10px] text-muted/70 leading-relaxed max-w-md">{t('footer.disclaimer')}</p>
      </div>
    </footer>
  );
}
