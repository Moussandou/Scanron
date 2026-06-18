import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { getDb } from '../firebase/app';
import { friendsPath, friendPath } from './paths';
import { assertValidFriendCode } from './validation';
import type { FriendDoc } from './types';

export async function addFriend(
  uid: string, accountId: string, name: string, friendCode: string,
): Promise<string> {
  assertValidFriendCode(friendCode);
  const ref = await addDoc(collection(getDb(), friendsPath(uid, accountId)), {
    name, friendCode, createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listFriends(
  uid: string, accountId: string,
): Promise<(FriendDoc & { id: string })[]> {
  const snap = await getDocs(query(collection(getDb(), friendsPath(uid, accountId)), orderBy('createdAt')));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as FriendDoc) }));
}

export async function updateFriend(
  uid: string, accountId: string, friendId: string, patch: Partial<Pick<FriendDoc, 'name' | 'friendCode'>>,
): Promise<void> {
  if (patch.friendCode !== undefined) assertValidFriendCode(patch.friendCode);
  await updateDoc(doc(getDb(), friendPath(uid, accountId, friendId)), patch);
}

export async function removeFriend(
  uid: string, accountId: string, friendId: string,
): Promise<void> {
  await deleteDoc(doc(getDb(), friendPath(uid, accountId, friendId)));
}
