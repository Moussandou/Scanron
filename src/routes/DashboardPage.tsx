import { useEffect, useState } from 'react';
import { Download, Compass, UserPlus, QrCode, HelpCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../lib/auth/useAuth';
import { useAccounts, useFriends } from '../lib/db/hooks';
import { AccountSwitcher } from '../components/vault/AccountSwitcher';
import { QRCard } from '../components/dashboard/QRCard';
import { QRModal } from '../components/dashboard/QRModal';
import { downloadFriendsZip } from '../lib/qr/zip';
import { Button } from '../components/ui/button';
import { useTranslation } from '../lib/i18n/I18nContext';
import type { FriendDoc } from '../lib/db/types';

type FriendWithId = FriendDoc & { id: string };

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const uid = user?.uid ?? null;
  const { accounts, reload: reloadAccounts } = useAccounts(uid);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { friends } = useFriends(uid, currentId);
  const [expanded, setExpanded] = useState<FriendWithId | null>(null);
  const [zipping, setZipping] = useState(false);

  useEffect(() => {
    if (!currentId && accounts.length > 0) setCurrentId(accounts[0].id);
  }, [accounts, currentId]);

  async function handleDownloadAll() {
    if (friends.length === 0) return;
    setZipping(true);
    try {
      await downloadFriendsZip(friends);
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {!uid && (
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300 shadow-[0_4px_20px_rgba(255,143,0,0.04)]">
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

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/10 pb-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-widest text-text uppercase">{t('dashboard.title')}</h1>
          <p className="text-xs text-muted mt-1">{t('dashboard.subtitle')}</p>
        </div>
        {friends.length > 0 && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownloadAll} disabled={zipping}>
            <Download size={14} /> {zipping ? 'Zipping...' : 'Download All'}
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur-sm p-6 space-y-4">
        <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text flex items-center gap-2">
          <Compass size={16} className="text-primary" />
          {t('dashboard.quickstart')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-xl border border-border/40 bg-surface-2/20 flex flex-col gap-2 relative">
            <div className="absolute top-3 right-3 text-xs font-mono font-bold text-border/60">01</div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Compass size={16} />
            </div>
            <h3 className="text-xs font-semibold text-text">{t('dashboard.step1.title')}</h3>
            <p className="text-[11px] text-muted leading-normal">
              {t('dashboard.step1.desc')}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-surface-2/20 flex flex-col gap-2 relative">
            <div className="absolute top-3 right-3 text-xs font-mono font-bold text-border/60">02</div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <UserPlus size={16} />
            </div>
            <h3 className="text-xs font-semibold text-text">{t('dashboard.step2.title')}</h3>
            <p className="text-[11px] text-muted leading-normal">
              {t('dashboard.step2.desc')}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-surface-2/20 flex flex-col gap-2 relative">
            <div className="absolute top-3 right-3 text-xs font-mono font-bold text-border/60">03</div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <QrCode size={16} />
            </div>
            <h3 className="text-xs font-semibold text-text">{t('dashboard.step3.title')}</h3>
            <p className="text-[11px] text-muted leading-normal">
              {t('dashboard.step3.desc')}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider font-display font-bold text-muted/80 block">{t('dashboard.activeAccount')}</span>
        <AccountSwitcher
          uid={uid}
          accounts={accounts}
          currentId={currentId}
          onSelect={setCurrentId}
          onCreated={reloadAccounts}
        />
      </div>

      {friends.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-surface/20 p-12 text-center space-y-4 max-w-xl mx-auto shadow-inner">
          <div className="w-12 h-12 rounded-full bg-border/40 flex items-center justify-center mx-auto text-muted">
            <Compass size={24} className="animate-pulse text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-text">{t('dashboard.noFriends')}</h3>
            <p className="text-xs text-muted leading-relaxed">
              {t('dashboard.noFriendsDesc')}
            </p>
          </div>
          <NavLink to="/vault" className="inline-block">
            <Button size="sm" className="bg-primary hover:bg-primary/95 text-primary-fg font-semibold shadow-[0_0_10px_rgba(255,143,0,0.2)]">
              {t('dashboard.goToVault')}
            </Button>
          </NavLink>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((f) => (
            <QRCard
              key={f.id}
              name={f.name}
              friendCode={f.friendCode}
              onExpand={() => setExpanded(f)}
            />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface/30 p-6 space-y-4">
        <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text flex items-center gap-2">
          <HelpCircle size={16} className="text-accent" />
          {t('dashboard.manualTitle')}
        </h2>
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1.2fr] items-center text-xs text-muted leading-relaxed">
          <div className="space-y-2">
            <p>
              {t('dashboard.manualP1')}
            </p>
            <p>
              {t('dashboard.manualP2')}
            </p>
          </div>
          <div className="hidden md:block w-px h-16 bg-border/40" />
          <div className="space-y-2">
            <p>
              {t('dashboard.manualP3')}
            </p>
            <p>
              {t('dashboard.manualP4')}
            </p>
          </div>
        </div>
      </div>

      {expanded && (
        <QRModal
          name={expanded.name}
          friendCode={expanded.friendCode}
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  );
}
