import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getDb } from '../firebase/app';
import { userPath } from './paths';
import { listAccounts } from './accounts';
import { listFriends } from './friends';
import { getFamily, listFamilyFriends } from './families';
import type { AccountDoc, FriendDoc } from './types';

type WithId<T> = T & { id: string };

export function useAccounts(uid: string | null) {
  const [accounts, setAccounts] = useState<WithId<AccountDoc>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!uid) {
      setAccounts([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const personalAccounts = await listAccounts(uid);

      const db = getDb();
      const userRef = doc(db, userPath(uid));
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.familyId) {
          const family = await getFamily(userData.familyId);
          if (family) {
            personalAccounts.push({
              id: `family:${userData.familyId}`,
              name: `👪 Family: ${family.name}`,
              order: -1,
              createdAt: family.createdAt || Date.now(),
            });
          }
        }
      }

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
    if (!uid || !accountId) {
      setFriends([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (accountId.startsWith('family:')) {
        const familyId = accountId.split(':')[1];
        setFriends(await listFamilyFriends(familyId));
      } else {
        setFriends(await listFriends(uid, accountId));
      }
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
