// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const listAccounts = vi.fn();
const listFriends = vi.fn();
vi.mock('./accounts', () => ({ listAccounts: (...a: unknown[]) => listAccounts(...a) }));
vi.mock('./friends', () => ({ listFriends: (...a: unknown[]) => listFriends(...a) }));

const mockGetDoc = vi.fn().mockResolvedValue({ exists: () => false });
const mockGetFamily = vi.fn().mockResolvedValue(null);
const mockListFamilyFriends = vi.fn().mockResolvedValue([]);

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: (...args: any[]) => mockGetDoc(...args),
}));

vi.mock('../firebase/app', () => ({
  getDb: () => ({ __type: 'db' }),
}));

vi.mock('./families', () => ({
  getFamily: (...args: any[]) => mockGetFamily(...args),
  listFamilyFriends: (...args: any[]) => mockListFamilyFriends(...args),
}));

import { useAccounts, useFriends } from './hooks';

beforeEach(() => {
  listAccounts.mockReset();
  listFriends.mockReset();
  mockGetDoc.mockReset().mockResolvedValue({ exists: () => false });
  mockGetFamily.mockReset().mockResolvedValue(null);
  mockListFamilyFriends.mockReset().mockResolvedValue([]);
});

describe('useAccounts', () => {
  it('loads accounts for a uid', async () => {
    listAccounts.mockResolvedValue([{ id: 'a1', name: 'Main', order: 0, createdAt: 0 }]);
    const { result } = renderHook(() => useAccounts('u1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.accounts).toHaveLength(1);
    expect(listAccounts).toHaveBeenCalledWith('u1');
  });

  it('loads local accounts when uid is null', async () => {
    listAccounts.mockResolvedValue([{ id: 'local_default', name: 'Default Account', order: 0, createdAt: 0 }]);
    const { result } = renderHook(() => useAccounts(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.accounts).toHaveLength(1);
    expect(listAccounts).toHaveBeenCalledWith(null);
  });
});

describe('useFriends', () => {
  it('does not load when accountId is null', () => {
    const { result } = renderHook(() => useFriends('u1', null));
    expect(result.current.friends).toEqual([]);
    expect(listFriends).not.toHaveBeenCalled();
  });

  it('loads regular account friends', async () => {
    listFriends.mockResolvedValue([{ id: 'f1', name: 'Krillin', friendCode: 'kr123456' }]);

    const { result } = renderHook(() => useFriends('u1', 'a1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.friends).toHaveLength(1);
    expect(listFriends).toHaveBeenCalledWith('u1', 'a1');
    expect(mockListFamilyFriends).not.toHaveBeenCalled();
  });
});
