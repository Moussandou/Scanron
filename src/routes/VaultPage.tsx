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
    <div className="space-y-6">
      <div>
        <h1 className="mb-3 text-xl font-semibold tracking-tight">Vault</h1>
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
        <p className="text-sm text-muted">Create an account to start adding friend codes.</p>
      )}
    </div>
  );
}
