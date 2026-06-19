import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { addFriend, removeFriend } from '../../lib/db/friends';
import { isValidFriendCode } from '../../lib/db/validation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useTranslation } from '../../lib/i18n/I18nContext';
import type { FriendDoc } from '../../lib/db/types';

interface Props {
  uid: string | null;
  accountId: string;
  friends: (FriendDoc & { id: string })[];
  onChanged: () => void;
}

export function FriendsManager({ uid, accountId, friends, onChanged }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function add() {
    if (!isValidFriendCode(code)) {
      setError(t('friends.validationError'));
      return;
    }
    setError(null);
    await addFriend(uid, accountId, name.trim() || 'Friend', code);
    setName('');
    setCode('');
    onChanged();
  }

  async function remove(id: string) {
    await removeFriend(uid, accountId, id);
    onChanged();
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end bg-surface/30 border border-border/60 p-5 rounded-2xl">
        <div className="space-y-1.5">
          <Label htmlFor="fname" className="text-xs uppercase tracking-wider font-display font-semibold">{t('friends.name')}</Label>
          <Input id="fname" placeholder="Vegeta" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fcode" className="text-xs uppercase tracking-wider font-display font-semibold">{t('friends.code')}</Label>
          <Input id="fcode" placeholder="e.g. 7q8s9t2b" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <Button onClick={add} className="h-10 sm:w-32">{t('friends.add')}</Button>
      </div>
      {error && (
        <p className="text-xs text-accent font-medium bg-accent/10 border border-accent/25 rounded-md p-2.5 animate-in fade-in duration-200">
          {error}
        </p>
      )}
      <div className="rounded-xl border border-border/70 bg-surface/20 backdrop-blur-sm overflow-hidden">
        <ul className="divide-y divide-border/65">
          {friends.map((f) => (
            <li key={f.id} className="flex items-center justify-between px-5 py-4 transition-all duration-300 hover:bg-surface-2/30 hover:pl-6 group">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm text-text group-hover:text-primary transition-colors">{f.name}</span>
                <span className="font-mono text-xs text-primary bg-primary/5 border border-primary/10 rounded px-2 py-0.5 tracking-wider">
                  {f.friendCode}
                </span>
              </div>
              <button
                onClick={() => remove(f.id)}
                className="text-muted hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 p-1 cursor-pointer"
                aria-label={`${t('friends.remove')} — ${f.name}`}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
          {friends.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-muted">
              {t('friends.empty')}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
