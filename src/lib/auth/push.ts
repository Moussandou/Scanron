import { getMessaging, getToken, deleteToken, isSupported } from 'firebase/messaging';
import { getFirebaseApp, getFirebaseAuth, getDb } from '../firebase/app';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { userPath } from '../db/paths';

export async function requestPushPermission(vapidKey?: string): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notifications not supported in this browser');
    return null;
  }

  const supported = await isSupported();
  if (!supported) {
    console.warn('FCM is not supported in this environment');
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const messaging = getMessaging(getFirebaseApp());
  const token = await getToken(messaging, { vapidKey });

  const auth = getFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (uid && token) {
    const db = getDb();
    const userRef = doc(db, userPath(uid));
    await updateDoc(userRef, {
      fcmTokens: arrayUnion(token),
    });
  }

  return token;
}

export async function disablePushNotifications(): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  const supported = await isSupported();
  if (!supported) {
    return;
  }

  const auth = getFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  try {
    const messaging = getMessaging(getFirebaseApp());
    const token = await getToken(messaging);
    if (token) {
      await deleteToken(messaging);
      const db = getDb();
      const userRef = doc(db, userPath(uid));
      await updateDoc(userRef, {
        fcmTokens: arrayRemove(token),
      });
    }
  } catch (err) {
    console.error('Failed to disable push notifications:', err);
  }
}
