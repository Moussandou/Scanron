import { describe, it, expect } from 'vitest';
import { userPath, accountsPath, accountPath, friendsPath, friendPath } from './paths';

describe('firestore paths', () => {
  it('builds nested paths', () => {
    expect(userPath('u1')).toBe('users/u1');
    expect(accountsPath('u1')).toBe('users/u1/accounts');
    expect(accountPath('u1', 'a1')).toBe('users/u1/accounts/a1');
    expect(friendsPath('u1', 'a1')).toBe('users/u1/accounts/a1/friends');
    expect(friendPath('u1', 'a1', 'f1')).toBe('users/u1/accounts/a1/friends/f1');
  });
});
