import { describe, it, expect, vi, beforeEach } from 'vitest';

const signInWithPopup = vi.fn().mockResolvedValue({ user: { uid: 'u1' } });
const signInWithEmailAndPassword = vi.fn().mockResolvedValue({ user: { uid: 'u1' } });
const createUserWithEmailAndPassword = vi.fn().mockResolvedValue({ user: { uid: 'u9' } });
const updateProfile = vi.fn().mockResolvedValue(undefined);
const signOut = vi.fn().mockResolvedValue(undefined);
const setDoc = vi.fn().mockResolvedValue(undefined);
const docFn = vi.fn().mockReturnValue({ __type: 'docref' });

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class {},
  signInWithPopup: (...a: unknown[]) => signInWithPopup(...a),
  signInWithEmailAndPassword: (...a: unknown[]) => signInWithEmailAndPassword(...a),
  createUserWithEmailAndPassword: (...a: unknown[]) => createUserWithEmailAndPassword(...a),
  updateProfile: (...a: unknown[]) => updateProfile(...a),
  signOut: (...a: unknown[]) => signOut(...a),
}));
vi.mock('firebase/firestore', () => ({
  doc: (...a: unknown[]) => docFn(...a),
  setDoc: (...a: unknown[]) => setDoc(...a),
  serverTimestamp: () => 'TS',
}));
vi.mock('../firebase/app', () => ({
  getFirebaseAuth: () => ({ __type: 'auth' }),
  getDb: () => ({ __type: 'db' }),
}));

import { registerWithEmail, signOutUser } from './methods';

beforeEach(() => {
  createUserWithEmailAndPassword.mockClear();
  updateProfile.mockClear();
  setDoc.mockClear();
});

describe('registerWithEmail', () => {
  it('creates the user, sets the display name, and writes the user doc', async () => {
    const uid = await registerWithEmail('a@b.co', 'pw123456', 'Goku');
    expect(uid).toBe('u9');
    expect(updateProfile).toHaveBeenCalled();
    const written = setDoc.mock.calls[0][1] as Record<string, unknown>;
    expect(written.email).toBe('a@b.co');
    expect(written.displayName).toBe('Goku');
    expect(written.fcmTokens).toEqual([]);
    const settings = written.notificationSettings as Record<string, unknown>;
    expect(settings.discord).toBe(false);
    expect(settings.push).toBe(false);
  });
});

describe('signOutUser', () => {
  it('delegates to firebase signOut', async () => {
    await signOutUser();
    expect(signOut).toHaveBeenCalled();
  });
});
