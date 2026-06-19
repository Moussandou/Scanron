import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockHttpsCallable = vi.fn();
const mockSignInWithCustomToken = vi.fn().mockResolvedValue({ user: { uid: 'discord-user-uid' } });

vi.mock('firebase/functions', () => ({
  getFunctions: () => ({ __type: 'functions' }),
  httpsCallable: () => mockHttpsCallable,
}));

vi.mock('firebase/auth', () => ({
  signInWithCustomToken: (...args: unknown[]) => mockSignInWithCustomToken(...args),
}));

vi.mock('../firebase/app', () => ({
  getFirebaseAuth: () => ({ __type: 'auth' }),
  getFirebaseFunctions: () => ({ __type: 'functions' }),
}));

vi.stubEnv('VITE_DISCORD_CLIENT_ID', 'test-discord-client-id');

import { getDiscordAuthUrl, signInWithDiscord } from './discord';

beforeEach(() => {
  mockHttpsCallable.mockReset();
  mockSignInWithCustomToken.mockClear();
});

describe('getDiscordAuthUrl', () => {
  it('constructs correct auth URL', () => {
    const url = getDiscordAuthUrl('http://localhost/callback');
    expect(url).toContain('client_id=test-discord-client-id');
    expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%2Fcallback');
    expect(url).toContain('response_type=code');
    expect(url).toContain('scope=identify');
  });
});

describe('signInWithDiscord', () => {
  it('calls HTTPS callable and signs in with the custom token', async () => {
    mockHttpsCallable.mockResolvedValueOnce({
      data: { customToken: 'custom-token-123' },
    });

    const uid = await signInWithDiscord('code-xyz', 'http://localhost/callback');

    expect(uid).toBe('discord-user-uid');
    expect(mockHttpsCallable).toHaveBeenCalledWith({
      code: 'code-xyz',
      redirectUri: 'http://localhost/callback',
    });
    expect(mockSignInWithCustomToken).toHaveBeenCalledWith(
      { __type: 'auth' },
      'custom-token-123',
    );
  });
});
