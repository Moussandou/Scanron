import { describe, it, expect } from 'vitest';
import { readFirebaseConfig } from './config';

const full = {
  VITE_FIREBASE_API_KEY: 'k',
  VITE_FIREBASE_AUTH_DOMAIN: 'd',
  VITE_FIREBASE_PROJECT_ID: 'p',
  VITE_FIREBASE_STORAGE_BUCKET: 's',
  VITE_FIREBASE_MESSAGING_SENDER_ID: 'm',
  VITE_FIREBASE_APP_ID: 'a',
};

describe('readFirebaseConfig', () => {
  it('maps env vars to a config object', () => {
    expect(readFirebaseConfig(full)).toEqual({
      apiKey: 'k', authDomain: 'd', projectId: 'p',
      storageBucket: 's', messagingSenderId: 'm', appId: 'a',
    });
  });
  it('throws listing every missing key', () => {
    expect(() => readFirebaseConfig({})).toThrowError(/VITE_FIREBASE_API_KEY/);
  });
});
