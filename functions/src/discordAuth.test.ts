import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exchangeDiscordCode, type DiscordTokenResponse, type DiscordUser } from './discordAuth';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockCreateCustomToken = vi.fn().mockResolvedValue('firebase-custom-token-abc');

vi.mock('firebase-admin', () => ({
  auth: () => ({ createCustomToken: mockCreateCustomToken }),
  firestore: () => ({
    doc: (path: string) => ({ path }),
    FieldValue: { serverTimestamp: () => 'TS' },
  }),
}));

beforeEach(() => {
  mockFetch.mockReset();
  mockCreateCustomToken.mockClear();
});

describe('exchangeDiscordCode', () => {
  it('exchanges the code and returns a custom token + discord user', async () => {
    const tokenResponse: DiscordTokenResponse = {
      access_token: 'discord-access-123',
      token_type: 'Bearer',
      scope: 'identify',
    };
    const discordUser: DiscordUser = {
      id: '123456789',
      username: 'goku_ssj',
      discriminator: '0',
      avatar: null,
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(tokenResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(discordUser),
      });

    const result = await exchangeDiscordCode(
      'auth-code-xyz',
      'http://localhost:5173/auth/discord/callback',
      'client-id',
      'client-secret',
      mockCreateCustomToken,
    );

    expect(result.customToken).toBe('firebase-custom-token-abc');
    expect(result.discordUser.id).toBe('123456789');
    expect(result.discordUser.username).toBe('goku_ssj');

    expect(mockFetch).toHaveBeenCalledTimes(2);

    const tokenCall = mockFetch.mock.calls[0];
    expect(tokenCall[0]).toBe('https://discord.com/api/oauth2/token');

    const userCall = mockFetch.mock.calls[1];
    expect(userCall[0]).toBe('https://discord.com/api/users/@me');
    expect(userCall[1].headers.Authorization).toBe('Bearer discord-access-123');
  });

  it('throws when Discord token exchange fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve('invalid_grant'),
    });

    await expect(
      exchangeDiscordCode('bad-code', 'http://localhost/cb', 'id', 'secret', mockCreateCustomToken),
    ).rejects.toThrow(/Discord token exchange failed/);
  });
});
