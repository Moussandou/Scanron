import { useState } from 'react';
import { Plus } from 'lucide-react';
import { createAccount } from '../../lib/db/accounts';
import { cn } from '../../lib/utils';
import type { AccountDoc } from '../../lib/db/types';

interface Props {
  uid: string;
  accounts: (AccountDoc & { id: string })[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onCreated: () => void;
}

export function AccountSwitcher({ uid, accounts, currentId, onSelect, onCreated }: Props) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  async function create() {
    if (!name.trim()) return;
    await createAccount(uid, name.trim(), accounts.length);
    setName('');
    setCreating(false);
    onCreated();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {accounts.map((a) => (
        <button
          key={a.id}
          onClick={() => onSelect(a.id)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition-colors',
            a.id === currentId
              ? 'border-primary bg-primary/15 text-primary'
              : 'border-border text-muted hover:text-text',
          )}
        >
          {a.name}
        </button>
      ))}
      {creating ? (
        <span className="flex items-center gap-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && create()}
            placeholder="Account name"
            className="h-8 rounded-md border border-border bg-surface-2 px-2 text-sm"
          />
          <button onClick={create} className="text-sm text-primary">Add</button>
        </span>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-sm text-muted hover:text-text"
        >
          <Plus size={14} /> New account
        </button>
      )}
    </div>
  );
}
