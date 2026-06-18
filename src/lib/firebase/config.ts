export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const KEYS: Record<keyof FirebaseConfig, string> = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
};

export function readFirebaseConfig(env: Record<string, string | undefined>): FirebaseConfig {
  const missing: string[] = [];
  const out = {} as FirebaseConfig;
  for (const [field, envKey] of Object.entries(KEYS) as [keyof FirebaseConfig, string][]) {
    const value = env[envKey];
    if (!value) missing.push(envKey);
    else out[field] = value;
  }
  if (missing.length) {
    throw new Error(`Missing Firebase env vars: ${missing.join(', ')}`);
  }
  return out;
}
