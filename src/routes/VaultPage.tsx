import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth/useAuth';
import { useAccounts, useFriends } from '../lib/db/hooks';
import { AccountSwitcher } from '../components/vault/AccountSwitcher';
import { FriendsManager } from '../components/vault/FriendsManager';

export default function VaultPage() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { accounts, reload: reloadAccounts } = useAccounts(uid);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { friends, reload: reloadFriends } = useFriends(uid, currentId);

  useEffect(() => {
    if (!currentId && accounts.length > 0) setCurrentId(accounts[0].id);
  }, [accounts, currentId]);

  if (!uid) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
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
