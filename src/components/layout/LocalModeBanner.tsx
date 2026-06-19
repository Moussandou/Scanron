import { NavLink } from 'react-router-dom';
import { useAuth } from '../../lib/auth/useAuth';
import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n/I18nContext';

/**
 * Single global "you're in local mode, sign in to sync" bar. Replaces the three
 * duplicated banners that used to live on Dashboard, Vault and Settings.
 */
export function LocalModeBanner() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user) return null;

  return (
    <div className="border-b border-accent/15 bg-accent/5">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_6px_var(--color-accent)] shrink-0" />
        <span className="font-display font-bold uppercase tracking-wider text-accent shrink-0">
          {t('settings.localActive')}
        </span>
        <span className="text-muted truncate hidden sm:block">{t('settings.localActiveDesc')}</span>
        <NavLink to="/login" className="ml-auto shrink-0">
          <Button variant="outline" size="sm" className="h-7 border-accent/25 text-accent hover:bg-accent/10 whitespace-nowrap">
            {t('settings.cloudSync')}
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
