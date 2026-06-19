import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
  type Firestore,
} from 'firebase/firestore';
import { getDb } from '../firebase/app';
import { userPath } from './paths';
import type { FamilyDoc, FriendDoc } from './types';

type WithId<T> = T & { id: string };

function getCollectionRef(db: Firestore, familyId: string) {
  return collection(db, `families/${familyId}/friends`);
}

export async function createFamily(name: string, ownerUid: string): Promise<string> {
  const db = getDb();
  // Generate random id
  const familyRef = doc(collection(db, 'families'));
  const familyId = familyRef.id;

  const familyData: FamilyDoc = {
    name,
    ownerUid,
    memberUids: [ownerUid],
    createdAt: Date.now(),
  };

  await setDoc(familyRef, familyData);

  const userRef = doc(db, userPath(ownerUid));
  await updateDoc(userRef, { familyId });

  return familyId;
}

export async function getFamily(familyId: string): Promise<FamilyDoc | null> {
  const db = getDb();
  const docRef = doc(db, 'families', familyId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as FamilyDoc;
}

export async function joinFamily(familyId: string, uid: string): Promise<void> {
  const db = getDb();
  const familyRef = doc(db, 'families', familyId);
  const snap = await getDoc(familyRef);
  if (!snap.exists()) {
    throw new Error('Family not found');
  }

  await updateDoc(familyRef, {
    memberUids: arrayUnion(uid),
  });

  const userRef = doc(db, userPath(uid));
  await updateDoc(userRef, { familyId });
}

export async function leaveFamily(familyId: string, uid: string): Promise<void> {
  const db = getDb();
  const familyRef = doc(db, 'families', familyId);
  const snap = await getDoc(familyRef);

  if (snap.exists()) {
    const data = snap.data() as FamilyDoc;
    if (data.ownerUid === uid) {
      // Disband family
      // Remove familyId for all members first
      for (const memberUid of data.memberUids) {
        try {
          const mRef = doc(db, userPath(memberUid));
          await updateDoc(mRef, { familyId: deleteField() });
        } catch {
          // ignore if user doc does not exist
        }
      }
      // Delete the friends subcollection docs
      const friends = await listFamilyFriends(familyId);
      for (const friend of friends) {
        await removeFamilyFriend(familyId, friend.id);
      }
      // Delete main family doc
      await deleteDoc(familyRef);
    } else {
      // Just leave
      await updateDoc(familyRef, {
        memberUids: arrayRemove(uid),
      });
    }
  }

  const userRef = doc(db, userPath(uid));
  // Set familyId to undefined / delete in Firestore
  await updateDoc(userRef, { familyId: deleteField() });
}

export async function listFamilyFriends(familyId: string): Promise<WithId<FriendDoc>[]> {
  const db = getDb();
  const colRef = getCollectionRef(db, familyId);
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({
    ...(d.data() as FriendDoc),
    id: d.id,
  }));
}

export async function addFamilyFriend(
  familyId: string,
  name: string,
  friendCode: string,
): Promise<string> {
  const db = getDb();
  const colRef = getCollectionRef(db, familyId);
  const friendRef = doc(colRef);
  const friendId = friendRef.id;

  const friendData: FriendDoc = {
    name,
    friendCode,
    createdAt: Date.now(),
  };

  await setDoc(friendRef, friendData);
  return friendId;
}

export async function removeFamilyFriend(familyId: string, friendId: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, `families/${familyId}/friends`, friendId);
  await deleteDoc(docRef);
}
