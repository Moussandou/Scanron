import { useState } from 'react';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import { createAccount, renameAccount, deleteAccount, LOCAL_DEFAULT_NAME } from '../../lib/db/accounts';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../lib/i18n/I18nContext';
import type { AccountDoc } from '../../lib/db/types';

interface Props {
  uid: string | null;
  accounts: (AccountDoc & { id: string })[];
  currentId: string | null;
  onSelect: (id: string | null) => void;
  onChanged: () => void;
}

export function AccountSwitcher({ uid, accounts, currentId, onSelect, onChanged }: Props) {
  const { t } = useTranslation();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // The game-account concept is a power feature: with a single (implicit) profile we
  // hide the chips and management controls entirely and only offer a discreet way to
  // add a second one. The full switcher reappears once there are 2+ profiles.
  const multi = accounts.length >= 2;

  // The auto-created local profile carries a stable sentinel name; show it localized.
  const displayName = (a: AccountDoc & { id: string }) =>
    a.name === LOCAL_DEFAULT_NAME ? t('switcher.defaultName') : a.name;

  async function create() {
    if (!name.trim()) return;
    await createAccount(uid, name.trim(), accounts.length);
    setName('');
    setCreating(false);
    onChanged();
  }

  async function saveRename(id: string) {
    const next = editName.trim();
    setEditingId(null);
    if (next) {
      await renameAccount(uid, id, next);
      onChanged();
    }
  }

  async function remove(id: string) {
    if (!window.confirm(t('switcher.confirmDelete'))) return;
    await deleteAccount(uid, id);
    if (id === currentId) onSelect(null);
    onChanged();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {multi && accounts.map((a) => {
        const isActive = a.id === currentId;

        if (editingId === a.id) {
          return (
            <span key={a.id} className="flex items-center gap-1.5 animate-in fade-in duration-150">
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveRename(a.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                onBlur={() => saveRename(a.id)}
                className="h-9 w-36 rounded-lg border border-primary/40 bg-surface-2 px-3 text-xs text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
              />
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => saveRename(a.id)}
                aria-label={t('switcher.save')}
                className="text-primary hover:text-primary/80 cursor-pointer p-1.5"
              >
                <Check size={14} />
              </button>
            </span>
          );
        }

        return (
          <span
            key={a.id}
            className={cn(
              'group flex items-center rounded-lg border text-xs font-semibold font-display tracking-wider uppercase transition-all duration-200',
              isActive
                ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(255,143,0,0.12)]'
                : 'border-border text-muted hover:text-text hover:border-muted/30 hover:bg-surface-2/30',
            )}
          >
            <button onClick={() => onSelect(a.id)} className="flex items-center pl-4 pr-2 py-2 cursor-pointer">
              {isActive && (
                <span className="relative flex h-1.5 w-1.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary shadow-[0_0_6px_var(--color-primary)]" />
                </span>
              )}
              {displayName(a)}
            </button>
            {isActive && (
              <span className="flex items-center pr-2 gap-0.5">
                <button
                  onClick={() => { setEditingId(a.id); setEditName(a.name); }}
                  aria-label={t('switcher.rename')}
                  className="text-primary/60 hover:text-primary p-1 cursor-pointer"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => remove(a.id)}
                  aria-label={t('switcher.delete')}
                  className="text-primary/60 hover:text-red-500 p-1 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            )}
          </span>
        );
      })}

      {creating ? (
        <span className="flex items-center gap-2 animate-in fade-in duration-200">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && create()}
            placeholder={t('switcher.accountName')}
            className="h-9 w-36 rounded-lg border border-border bg-surface-2 px-3 text-xs text-text placeholder:text-muted/60 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20"
          />
          <button
            onClick={create}
            className="text-xs font-display font-semibold uppercase tracking-wider text-primary hover:text-primary/85 cursor-pointer px-1 py-1"
          >
            {t('switcher.add')}
          </button>
        </span>
      ) : multi ? (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-2 text-xs font-semibold font-display tracking-wider uppercase text-muted hover:text-text hover:border-muted/40 hover:bg-surface-2/20 cursor-pointer transition-all duration-200"
        >
          <Plus size={12} /> {t('switcher.newAccount')}
        </button>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="text-xs font-display font-semibold uppercase tracking-wider text-muted/70 hover:text-primary cursor-pointer transition-colors duration-200"
        >
          {t('switcher.addProfile')}
        </button>
      )}
    </div>
  );
}
