import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { getDb } from '../firebase/app';
import { accountsPath, accountPath } from './paths';
import type { AccountDoc } from './types';

/**
 * Sentinel name for the auto-created local profile. Kept as a stable string (not
 * localized at write time, since this module has no i18n) so the switcher can map it
 * to a translated label at render time. Once the user renames the profile its name no
 * longer matches this sentinel and their custom name is shown verbatim.
 */
export const LOCAL_DEFAULT_NAME = 'Default Account';

function getLocalAccounts(): (AccountDoc & { id: string })[] {
  try {
    const raw = localStorage.getItem('scanron_local_accounts');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalAccounts(accs: (AccountDoc & { id: string })[]) {
  try {
    localStorage.setItem('scanron_local_accounts', JSON.stringify(accs));
  } catch (e) {
    console.error('Failed to save local accounts', e);
  }
}

export async function createAccount(uid: string | null, name: string, order: number): Promise<string> {
  if (!uid) {
    const localId = 'local_' + Math.random().toString(36).substring(2, 11);
    const localAccounts = getLocalAccounts();
    localAccounts.push({ id: localId, name, order, createdAt: Date.now() });
    saveLocalAccounts(localAccounts);
    return localId;
  }
  const ref = await addDoc(collection(getDb(), accountsPath(uid)), {
    name, order, createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listAccounts(uid: string | null): Promise<(AccountDoc & { id: string })[]> {
  if (!uid) {
    const accounts = getLocalAccounts();
    if (accounts.length === 0) {
      const defaultId = 'local_default';
      const defaultAcc = { id: defaultId, name: LOCAL_DEFAULT_NAME, order: 0, createdAt: Date.now() };
      saveLocalAccounts([defaultAcc]);
      return [defaultAcc];
    }
    return accounts.sort((a, b) => a.order - b.order);
  }
  const snap = await getDocs(query(collection(getDb(), accountsPath(uid)), orderBy('order')));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as AccountDoc) }));
}

export async function renameAccount(uid: string | null, accountId: string, name: string): Promise<void> {
  if (!uid) {
    const localAccounts = getLocalAccounts();
    const idx = localAccounts.findIndex(a => a.id === accountId);
    if (idx !== -1) {
      localAccounts[idx].name = name;
      saveLocalAccounts(localAccounts);
    }
    return;
  }
  await updateDoc(doc(getDb(), accountPath(uid, accountId)), { name });
}

export async function deleteAccount(uid: string | null, accountId: string): Promise<void> {
  if (!uid) {
    const localAccounts = getLocalAccounts();
    const filtered = localAccounts.filter(a => a.id !== accountId);
    saveLocalAccounts(filtered);
    localStorage.removeItem('scanron_local_friends_' + accountId);
    return;
  }
  await deleteDoc(doc(getDb(), accountPath(uid, accountId)));
}
