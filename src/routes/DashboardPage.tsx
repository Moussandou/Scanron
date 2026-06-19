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
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/10 pb-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-widest text-text uppercase">Dashboard</h1>
          <p className="text-xs text-muted mt-1">Real-time DBL Shenron code active sweep panel.</p>
        </div>
        {friends.length > 0 && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownloadAll} disabled={zipping}>
            <Download size={14} /> {zipping ? 'Zipping...' : 'Download All'}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider font-display font-bold text-muted/80 block">Active Stream Account</span>
        <AccountSwitcher
          uid={uid}
          accounts={accounts}
          currentId={currentId}
          onSelect={setCurrentId}
          onCreated={reloadAccounts}
        />
      </div>

      {friends.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface/30 p-12 text-center">
          <p className="text-sm text-muted">
            No friends linked to this channel. Register DBL friend codes in the Vault to generate scanner codes.
          </p>
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
