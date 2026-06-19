import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { addFriend, removeFriend } from '../../lib/db/friends';
import { isValidFriendCode } from '../../lib/db/validation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { FriendDoc } from '../../lib/db/types';

interface Props {
  uid: string;
  accountId: string;
  friends: (FriendDoc & { id: string })[];
  onChanged: () => void;
}

export function FriendsManager({ uid, accountId, friends, onChanged }: Props) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function add() {
    if (!isValidFriendCode(code)) {
      setError('Friend code must be 6-12 letters or digits');
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
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-1">
          <Label htmlFor="fname">Friend name</Label>
          <Input id="fname" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fcode">Friend code</Label>
          <Input id="fcode" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <Button onClick={add}>Add friend</Button>
      </div>
      {error && <p className="text-sm text-accent">{error}</p>}
      <ul className="divide-y divide-border rounded-lg border border-border">
        {friends.map((f) => (
          <li key={f.id} className="flex items-center justify-between px-4 py-3">
            <span>
              <span className="font-medium">{f.name}</span>
              <span className="ml-2 font-mono text-sm text-muted">{f.friendCode}</span>
            </span>
            <button onClick={() => remove(f.id)} className="text-muted hover:text-accent" aria-label={`Remove ${f.name}`}>
              <Trash2 size={16} />
            </button>
          </li>
        ))}
        {friends.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted">No friends yet.</li>}
      </ul>
    </div>
  );
}
