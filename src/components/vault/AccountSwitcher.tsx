import { useState } from 'react';
import { Plus } from 'lucide-react';
import { createAccount } from '../../lib/db/accounts';
import { cn } from '../../lib/utils';
import type { AccountDoc } from '../../lib/db/types';

interface Props {
  uid: string | null;
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
      {accounts.map((a) => {
        const isActive = a.id === currentId;
        return (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className={cn(
              'flex items-center justify-center rounded-lg border px-4 py-2 text-xs font-semibold font-display tracking-wider uppercase transition-all duration-200 cursor-pointer',
              isActive
                ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(54,226,123,0.12)]'
                : 'border-border text-muted hover:text-text hover:border-muted/30 hover:bg-surface-2/30',
            )}
          >
            {isActive && (
              <span className="relative flex h-1.5 w-1.5 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary shadow-[0_0_6px_var(--color-primary)]" />
              </span>
            )}
            {a.name}
          </button>
        );
      })}
      {creating ? (
        <span className="flex items-center gap-2 animate-in fade-in duration-200">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && create()}
            placeholder="Account name"
            className="h-8 w-36 rounded-lg border border-border bg-surface-2 px-3 text-xs text-text placeholder:text-muted/60 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20"
          />
          <button
            onClick={create}
            className="text-xs font-display font-semibold uppercase tracking-wider text-primary hover:text-primary/85 cursor-pointer px-1 py-1"
          >
            Add
          </button>
        </span>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-2 text-xs font-semibold font-display tracking-wider uppercase text-muted hover:text-text hover:border-muted/40 hover:bg-surface-2/20 cursor-pointer transition-all duration-200"
        >
          <Plus size={12} /> New account
        </button>
      )}
    </div>
  );
}
