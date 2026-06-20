import { useCallback, useEffect, useState } from 'react';
import { listAccounts } from './accounts';
import { listFriends } from './friends';

import type { AccountDoc, FriendDoc } from './types';

type WithId<T> = T & { id: string };

export function useAccounts(uid: string | null) {
  const [accounts, setAccounts] = useState<WithId<AccountDoc>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const personalAccounts = await listAccounts(uid);



      setAccounts(personalAccounts);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load accounts'));
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { accounts, loading, error, reload };
}

export function useFriends(uid: string | null, accountId: string | null) {
  const [friends, setFriends] = useState<WithId<FriendDoc>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!accountId) {
      setFriends([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setFriends(await listFriends(uid, accountId));
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load friends'));
    } finally {
      setLoading(false);
    }
  }, [uid, accountId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { friends, loading, error, reload };
}
