import {
  GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, updateProfile, signOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getDb } from '../firebase/app';
import { userPath } from '../db/paths';

export async function signInWithGoogle(): Promise<string> {
  const cred = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
  return cred.user.uid;
}

export async function signInWithEmail(email: string, password: string): Promise<string> {
  const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  return cred.user.uid;
}

export async function registerWithEmail(
  email: string, password: string, displayName: string,
): Promise<string> {
  const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  await updateProfile(cred.user, { displayName });
  await setDoc(doc(getDb(), userPath(cred.user.uid)), {
    email,
    displayName,
    fcmTokens: [],
    notificationSettings: { discord: false, push: false, sendAtHour: 9, timezone: 'UTC' },
    createdAt: serverTimestamp(),
  });
  return cred.user.uid;
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}
