import { listAccounts, createAccount } from './accounts';
import { listFriends, addFriend } from './friends';
import { assertValidFriendCode } from './validation';

export async function exportConfig(uid: string): Promise<string> {
  const accounts = await listAccounts(uid);
  const data = {
    accounts: [] as any[],
  };

  for (const account of accounts) {
    const friends = await listFriends(uid, account.id);
    data.accounts.push({
      name: account.name,
      friends: friends.map((f) => ({
        name: f.name,
        friendCode: f.friendCode,
      })),
    });
  }

  return JSON.stringify(data, null, 2);
}

export async function importConfig(uid: string, jsonString: string): Promise<void> {
  let config: any;
  try {
    config = JSON.parse(jsonString);
  } catch {
    throw new Error('Failed to parse JSON configuration file');
  }

  if (!config || !Array.isArray(config.accounts)) {
    throw new Error('Invalid backup file structure: missing accounts list');
  }

  const existingAccounts = await listAccounts(uid);

  for (const account of config.accounts) {
    if (!account.name || typeof account.name !== 'string') {
      continue;
    }

    let accountId = '';
    const match = existingAccounts.find(
      (a) => a.name.toLowerCase().trim() === account.name.toLowerCase().trim(),
    );

    if (match) {
      accountId = match.id;
    } else {
      const nextOrder = existingAccounts.length;
      accountId = await createAccount(uid, account.name, nextOrder);
      existingAccounts.push({
        id: accountId,
        name: account.name,
        order: nextOrder,
        createdAt: Date.now(),
      });
    }

    if (Array.isArray(account.friends)) {
      const existingFriends = await listFriends(uid, accountId);

      for (const friend of account.friends) {
        if (!friend.name || !friend.friendCode) continue;

        try {
          assertValidFriendCode(friend.friendCode);
        } catch {
          // Skip invalid codes to prevent import crash
          continue;
        }

        const friendMatch = existingFriends.find(
          (f) => f.friendCode.toLowerCase() === friend.friendCode.toLowerCase(),
        );

        if (!friendMatch) {
          await addFriend(uid, accountId, friend.name, friend.friendCode);
          existingFriends.push({
            id: 'imported',
            name: friend.name,
            friendCode: friend.friendCode,
            createdAt: Date.now(),
          });
        }
      }
    }
  }
}
