import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockListAccounts = vi.fn();
const mockCreateAccount = vi.fn();
const mockListFriends = vi.fn();
const mockAddFriend = vi.fn();

vi.mock('./accounts', () => ({
  listAccounts: (...args: any[]) => mockListAccounts(...args),
  createAccount: (...args: any[]) => mockCreateAccount(...args),
}));

vi.mock('./friends', () => ({
  listFriends: (...args: any[]) => mockListFriends(...args),
  addFriend: (...args: any[]) => mockAddFriend(...args),
}));

import { exportConfig, importConfig } from './importExport';

beforeEach(() => {
  mockListAccounts.mockReset();
  mockCreateAccount.mockReset();
  mockListFriends.mockReset();
  mockAddFriend.mockReset();
});

describe('import/export JSON configurations', () => {
  it('exports accounts and friends to JSON string', async () => {
    mockListAccounts.mockResolvedValueOnce([
      { id: 'acc1', name: 'Primary', order: 0 },
    ]);
    mockListFriends.mockResolvedValueOnce([
      { id: 'f1', name: 'Goku', friendCode: 'dr85d9jy' },
    ]);

    const json = await exportConfig('u1');
    const parsed = JSON.parse(json);

    expect(mockListAccounts).toHaveBeenCalledWith('u1');
    expect(mockListFriends).toHaveBeenCalledWith('u1', 'acc1');
    expect(parsed.accounts).toHaveLength(1);
    expect(parsed.accounts[0].name).toBe('Primary');
    expect(parsed.accounts[0].friends).toEqual([
      { name: 'Goku', friendCode: 'dr85d9jy' },
    ]);
  });

  it('imports and merges accounts and friends from JSON', async () => {
    // Existing accounts: only "Primary"
    mockListAccounts.mockResolvedValueOnce([
      { id: 'acc1', name: 'Primary', order: 0 },
    ]);
    // Existing friends in "Primary": none
    mockListFriends.mockResolvedValueOnce([]); // For Primary check

    // JSON contains:
    // 1. "Primary" with Goku (should add Goku to existing acc1)
    // 2. "Secondary" with Vegeta (should create Secondary account and add Vegeta)
    const backup = {
      accounts: [
        {
          name: 'Primary',
          friends: [{ name: 'Goku', friendCode: 'dr85d9jy' }],
        },
        {
          name: 'Secondary',
          friends: [{ name: 'Vegeta', friendCode: 'vg123456' }],
        },
      ],
    };

    mockCreateAccount.mockResolvedValueOnce('acc2'); // Returns ID for Secondary
    mockListFriends.mockResolvedValueOnce([]); // Mock listFriends for newly created Secondary (acc2)

    await importConfig('u1', JSON.stringify(backup));

    // Should NOT recreate "Primary"
    expect(mockCreateAccount).toHaveBeenCalledTimes(1);
    expect(mockCreateAccount).toHaveBeenCalledWith('u1', 'Secondary', 1);

    // Should add Goku to acc1, and Vegeta to acc2
    expect(mockAddFriend).toHaveBeenCalledTimes(2);
    expect(mockAddFriend).toHaveBeenNthCalledWith(1, 'u1', 'acc1', 'Goku', 'dr85d9jy');
    expect(mockAddFriend).toHaveBeenNthCalledWith(2, 'u1', 'acc2', 'Vegeta', 'vg123456');
  });

  it('skips duplicates and invalid friend codes on import', async () => {
    // Existing accounts: "Primary"
    mockListAccounts.mockResolvedValueOnce([
      { id: 'acc1', name: 'Primary', order: 0 },
    ]);
    // Goku is already in "Primary"
    mockListFriends.mockResolvedValueOnce([
      { id: 'f1', name: 'Goku', friendCode: 'dr85d9jy' },
    ]);

    // Backup contains:
    // 1. Goku (already exists in Primary -> should skip)
    // 2. Krillin with invalid code (should skip)
    const backup = {
      accounts: [
        {
          name: 'Primary',
          friends: [
            { name: 'Goku', friendCode: 'dr85d9jy' },
            { name: 'Krillin', friendCode: 'invalid-code-here' },
          ],
        },
      ],
    };

    await importConfig('u1', JSON.stringify(backup));

    expect(mockCreateAccount).not.toHaveBeenCalled();
    expect(mockAddFriend).not.toHaveBeenCalled();
  });
});
