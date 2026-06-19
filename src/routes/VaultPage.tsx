import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HelpCircle, Shield, Users } from 'lucide-react';
import { useAuth } from '../lib/auth/useAuth';
import { useAccounts, useFriends } from '../lib/db/hooks';
import { AccountSwitcher } from '../components/vault/AccountSwitcher';
import { FriendsManager } from '../components/vault/FriendsManager';
import { Button } from '../components/ui/button';
import { useTranslation } from '../lib/i18n/I18nContext';

export default function VaultPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const uid = user?.uid ?? null;
  const { accounts, reload: reloadAccounts } = useAccounts(uid);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { friends, reload: reloadFriends } = useFriends(uid, currentId);

  useEffect(() => {
    if (!currentId && accounts.length > 0) setCurrentId(accounts[0].id);
  }, [accounts, currentId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {!uid && (
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300 shadow-[0_4px_20px_rgba(245,166,35,0.04)]">
          <div className="space-y-1">
            <h3 className="text-xs font-display font-black tracking-wider text-accent uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_6px_var(--color-accent)]" />
              {t('settings.localActive')}
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              {t('settings.localActiveDesc')}
            </p>
          </div>
          <NavLink to="/login" className="shrink-0">
            <Button variant="outline" size="sm" className="border-accent/25 text-accent hover:bg-accent/10 whitespace-nowrap">
              {t('settings.cloudSync')}
            </Button>
          </NavLink>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-display font-black tracking-widest text-text uppercase">{t('vault.title')}</h1>
          <p className="text-xs text-muted mt-1">{t('vault.subtitle')}</p>
        </div>
        <AccountSwitcher
          uid={uid}
          accounts={accounts}
          currentId={currentId}
          onSelect={setCurrentId}
          onCreated={reloadAccounts}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr] items-start">
        <div className="space-y-6">
          {currentId ? (
            <FriendsManager uid={uid} accountId={currentId} friends={friends} onChanged={reloadFriends} />
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-surface/20 p-10 text-center space-y-4 shadow-inner">
              <div className="w-12 h-12 rounded-full bg-border/40 flex items-center justify-center mx-auto text-muted">
                <Users size={24} className="text-primary animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-text">{t('vault.noAccount')}</h3>
                <p className="text-xs text-muted leading-relaxed">
                  {t('vault.noAccountDesc')}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur-sm p-5 space-y-4">
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              {t('vault.statsTitle')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-border/40 bg-surface-2/20 text-center">
                <span className="text-[10px] text-muted block uppercase tracking-wider font-display font-bold">{t('vault.totalAccounts')}</span>
                <span className="text-2xl font-display font-black text-text mt-1 block">{accounts.length}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-border/40 bg-surface-2/20 text-center">
                <span className="text-[10px] text-muted block uppercase tracking-wider font-display font-bold">{t('vault.activeCodes')}</span>
                <span className="text-2xl font-display font-black text-primary mt-1 block">{friends.length}</span>
              </div>
            </div>
            <div className="text-[10px] text-muted text-center pt-3.5 border-t border-border/20 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {uid ? t('vault.syncActive') : t('vault.syncLocal')}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur-sm p-5 space-y-3.5">
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text flex items-center gap-2">
              <HelpCircle size={16} className="text-accent" />
              {t('vault.howToFind')}
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              {t('vault.howToFindDesc')}
            </p>
            <ol className="text-xs text-muted space-y-2 list-decimal pl-4 leading-relaxed">
              <li>{t('vault.howToFindStep1')}</li>
              <li>{t('vault.howToFindStep2')}</li>
              <li>{t('vault.howToFindStep3')}</li>
              <li>{t('vault.howToFindStep4')}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
