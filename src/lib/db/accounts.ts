import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { getDb } from '../firebase/app';
import { accountsPath, accountPath } from './paths';
import type { AccountDoc } from './types';

export async function createAccount(uid: string, name: string, order: number): Promise<string> {
  const ref = await addDoc(collection(getDb(), accountsPath(uid)), {
    name, order, createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listAccounts(uid: string): Promise<(AccountDoc & { id: string })[]> {
  const snap = await getDocs(query(collection(getDb(), accountsPath(uid)), orderBy('order')));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as AccountDoc) }));
}

export async function renameAccount(uid: string, accountId: string, name: string): Promise<void> {
  await updateDoc(doc(getDb(), accountPath(uid, accountId)), { name });
}

export async function deleteAccount(uid: string, accountId: string): Promise<void> {
  await deleteDoc(doc(getDb(), accountPath(uid, accountId)));
}
