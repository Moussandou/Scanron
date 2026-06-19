import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { getDb } from '../firebase/app';
import { friendsPath, friendPath } from './paths';
import { assertValidFriendCode } from './validation';
import { addFamilyFriend, removeFamilyFriend } from './families';
import type { FriendDoc } from './types';

function getLocalFriends(accountId: string): (FriendDoc & { id: string })[] {
  try {
    const raw = localStorage.getItem('scanron_local_friends_' + accountId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalFriends(accountId: string, friends: (FriendDoc & { id: string })[]) {
  try {
    localStorage.setItem('scanron_local_friends_' + accountId, JSON.stringify(friends));
  } catch (e) {
    console.error('Failed to save local friends', e);
  }
}

export async function addFriend(
  uid: string | null, accountId: string, name: string, friendCode: string,
): Promise<string> {
  assertValidFriendCode(friendCode);
  if (!uid) {
    const friendId = 'local_f_' + Math.random().toString(36).substring(2, 11);
    const localFriends = getLocalFriends(accountId);
    localFriends.push({ id: friendId, name, friendCode, createdAt: Date.now() });
    saveLocalFriends(accountId, localFriends);
    return friendId;
  }
  if (accountId.startsWith('family:')) {
    const familyId = accountId.split(':')[1];
    return addFamilyFriend(familyId, name, friendCode);
  }
  const ref = await addDoc(collection(getDb(), friendsPath(uid, accountId)), {
    name, friendCode, createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listFriends(
  uid: string | null, accountId: string,
): Promise<(FriendDoc & { id: string })[]> {
  if (!uid) {
    const localFriends = getLocalFriends(accountId);
    return localFriends.sort((a, b) => a.createdAt - b.createdAt);
  }
  const snap = await getDocs(query(collection(getDb(), friendsPath(uid, accountId)), orderBy('createdAt')));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as FriendDoc) }));
}

export async function updateFriend(
  uid: string | null, accountId: string, friendId: string, patch: Partial<Pick<FriendDoc, 'name' | 'friendCode'>>,
): Promise<void> {
  if (patch.friendCode !== undefined) assertValidFriendCode(patch.friendCode);
  if (!uid) {
    const localFriends = getLocalFriends(accountId);
    const idx = localFriends.findIndex(f => f.id === friendId);
    if (idx !== -1) {
      if (patch.name !== undefined) localFriends[idx].name = patch.name;
      if (patch.friendCode !== undefined) localFriends[idx].friendCode = patch.friendCode;
      saveLocalFriends(accountId, localFriends);
    }
    return;
  }
  await updateDoc(doc(getDb(), friendPath(uid, accountId, friendId)), patch);
}

export async function removeFriend(
  uid: string | null, accountId: string, friendId: string,
): Promise<void> {
  if (!uid) {
    const localFriends = getLocalFriends(accountId);
    const filtered = localFriends.filter(f => f.id !== friendId);
    saveLocalFriends(accountId, filtered);
    return;
  }
  if (accountId.startsWith('family:')) {
    const familyId = accountId.split(':')[1];
    return removeFamilyFriend(familyId, friendId);
  }
  await deleteDoc(doc(getDb(), friendPath(uid, accountId, friendId)));
}
