import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runDailyReminders } from './reminders';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock admin
const mockLogGet = vi.fn().mockResolvedValue({ exists: false });
const mockLogSet = vi.fn().mockResolvedValue(undefined);
const mockAccountsGet = vi.fn();
const mockFriendsGet = vi.fn();

const mockSendMulticast = vi.fn().mockResolvedValue({ successCount: 1 });

const mockFirestore: any = {
  collection: (col: string) => {
    if (col === 'users') {
      return {
        get: async () => ({
          docs: [
            {
              id: 'u1',
              data: () => ({
                displayName: 'Goku',
                discordWebhook: 'https://discord.com/api/webhooks/123',
                fcmTokens: ['token-abc'],
                notificationSettings: {
                  discord: true,
                  push: true,
                  sendAtHour: 9,
                  timezone: 'America/New_York',
                },
              }),
            },
            {
              id: 'u2',
              data: () => ({
                displayName: 'Vegeta',
                notificationSettings: {
                  discord: true,
                  push: false,
                  sendAtHour: 15,
                  timezone: 'UTC',
                },
              }),
            },
          ],
        }),
      };
    }
    // Subcollections
    if (col.endsWith('/accounts')) {
      return {
        orderBy: () => ({
          get: mockAccountsGet,
        }),
      };
    }
    if (col.endsWith('/friends')) {
      return {
        get: mockFriendsGet,
      };
    }
    return {};
  },
  doc: (path: string) => {
    if (path.includes('/reminderLog/')) {
      return {
        get: mockLogGet,
        set: mockLogSet,
      };
    }
    return {};
  },
};

const mockMessaging: any = {
  sendEachForMulticast: mockSendMulticast,
};

beforeEach(() => {
  mockFetch.mockReset();
  mockLogGet.mockReset().mockResolvedValue({ exists: false });
  mockLogSet.mockClear();
  mockAccountsGet.mockReset();
  mockFriendsGet.mockReset();
  mockSendMulticast.mockClear();
});

describe('runDailyReminders', () => {
  it('sends Discord and FCM notifications when user hour matches and logs success', async () => {
    // Current time: 2026-06-19 13:00:00 UTC
    // America/New_York is 4 hours behind UTC in June (EDT), so it's 09:00:00 local time!
    // Goku's sendAtHour is 9, so Goku matches.
    // Vegeta is UTC, sendAtHour is 15. The current UTC hour is 13, so Vegeta does NOT match.
    const now = new Date(Date.UTC(2026, 5, 19, 13, 0, 0)); // June 19 (month index 5)

    // Accounts response for Goku (u1)
    mockAccountsGet.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: 'acc1',
          data: () => ({ name: 'Primary Account' }),
        },
      ],
    });

    // Friends response for acc1
    mockFriendsGet.mockResolvedValueOnce({
      docs: [
        {
          id: 'f1',
          data: () => ({ name: 'Krillin', friendCode: 'kr123456' }),
        },
      ],
    });

    mockFetch.mockResolvedValueOnce({ ok: true });

    await runDailyReminders(mockFirestore, mockMessaging, now);

    // Goku matched, so active account and friends are loaded
    expect(mockAccountsGet).toHaveBeenCalled();
    expect(mockFriendsGet).toHaveBeenCalled();

    // Verify Discord webhook post
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[0]).toBe('https://discord.com/api/webhooks/123');
    expect(callArgs[1].method).toBe('POST');
    expect(callArgs[1].body).toBeInstanceOf(FormData);

    // Verify FCM push sent
    expect(mockSendMulticast).toHaveBeenCalledTimes(1);
    const pushArgs = mockSendMulticast.mock.calls[0][0];
    expect(pushArgs.tokens).toEqual(['token-abc']);
    expect(pushArgs.notification.title).toContain('Dragon Radar Scan Complete');

    // Verify success log written for America/New_York local date: '2026-06-19'
    expect(mockLogSet).toHaveBeenCalled();
    const logged = mockLogSet.mock.calls[0][0];
    expect(logged.status).toBe('success');
    expect(logged.channels).toEqual({ discord: true, push: true });
  });

  it('skips already sent reminders (idempotency)', async () => {
    const now = new Date(Date.UTC(2026, 5, 19, 13, 0, 0)); // 09:00:00 EDT
    mockLogGet.mockResolvedValueOnce({ exists: true }); // Log document already exists for today

    await runDailyReminders(mockFirestore, mockMessaging, now);

    expect(mockAccountsGet).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockSendMulticast).not.toHaveBeenCalled();
  });
});
