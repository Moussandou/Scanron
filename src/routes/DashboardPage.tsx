import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { useAuth } from '../lib/auth/useAuth';
import { useAccounts, useFriends } from '../lib/db/hooks';
import { AccountSwitcher } from '../components/vault/AccountSwitcher';
import { QRCard } from '../components/dashboard/QRCard';
import { QRModal } from '../components/dashboard/QRModal';
import { downloadFriendsZip } from '../lib/qr/zip';
import { Button } from '../components/ui/button';
import type { FriendDoc } from '../lib/db/types';

type FriendWithId = FriendDoc & { id: string };

export default function DashboardPage() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { accounts, reload: reloadAccounts } = useAccounts(uid);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { friends } = useFriends(uid, currentId);
  const [expanded, setExpanded] = useState<FriendWithId | null>(null);
  const [zipping, setZipping] = useState(false);

  useEffect(() => {
    if (!currentId && accounts.length > 0) setCurrentId(accounts[0].id);
  }, [accounts, currentId]);

  if (!uid) return null;

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        {friends.length > 0 && (
          <Button variant="outline" className="gap-1.5" onClick={handleDownloadAll} disabled={zipping}>
            <Download size={14} /> {zipping ? 'Zipping...' : 'Download All'}
          </Button>
        )}
      </div>

      <AccountSwitcher
        uid={uid}
        accounts={accounts}
        currentId={currentId}
        onSelect={setCurrentId}
        onCreated={reloadAccounts}
      />

      {friends.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">
          No friends in this account. Add friend codes in the Vault to generate QR codes.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
