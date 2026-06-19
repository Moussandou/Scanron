// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const listAccounts = vi.fn();
const listFriends = vi.fn();
vi.mock('./accounts', () => ({ listAccounts: (...a: unknown[]) => listAccounts(...a) }));
vi.mock('./friends', () => ({ listFriends: (...a: unknown[]) => listFriends(...a) }));

import { useAccounts, useFriends } from './hooks';

beforeEach(() => { listAccounts.mockReset(); listFriends.mockReset(); });

describe('useAccounts', () => {
  it('loads accounts for a uid', async () => {
    listAccounts.mockResolvedValue([{ id: 'a1', name: 'Main', order: 0, createdAt: 0 }]);
    const { result } = renderHook(() => useAccounts('u1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.accounts).toHaveLength(1);
    expect(listAccounts).toHaveBeenCalledWith('u1');
  });

  it('stays empty when uid is null', async () => {
    const { result } = renderHook(() => useAccounts(null));
    expect(result.current.accounts).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(listAccounts).not.toHaveBeenCalled();
  });
});

describe('useFriends', () => {
  it('does not load when accountId is null', () => {
    const { result } = renderHook(() => useFriends('u1', null));
    expect(result.current.friends).toEqual([]);
    expect(listFriends).not.toHaveBeenCalled();
  });
});
