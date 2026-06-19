import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../lib/auth/useAuth';
import { useAccounts, useFriends } from '../lib/db/hooks';
import { AccountSwitcher } from '../components/vault/AccountSwitcher';
import { FriendsManager } from '../components/vault/FriendsManager';
import { Button } from '../components/ui/button';

export default function VaultPage() {
  const { user } = useAuth();
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
              Local Mode Active
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Your codes are stored safely in local storage. Connect to cloud to back up, share codes with your family, and schedule automated reminders!
            </p>
          </div>
          <NavLink to="/login" className="shrink-0">
            <Button variant="outline" size="sm" className="border-accent/25 text-accent hover:bg-accent/10 whitespace-nowrap">
              Cloud Sync
            </Button>
          </NavLink>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-display font-black tracking-widest text-text uppercase">Vault</h1>
          <p className="text-xs text-muted mt-1">Manage DBL accounts and sync friend code listings.</p>
        </div>
        <AccountSwitcher
          uid={uid}
          accounts={accounts}
          currentId={currentId}
          onSelect={setCurrentId}
          onCreated={reloadAccounts}
        />
      </div>
      {currentId ? (
        <FriendsManager uid={uid} accountId={currentId} friends={friends} onChanged={reloadFriends} />
      ) : (
        <div className="rounded-2xl border border-border bg-surface/30 p-8 text-center">
          <p className="text-sm text-muted">Create an account above to start registering friend codes.</p>
        </div>
      )}
    </div>
  );
}
