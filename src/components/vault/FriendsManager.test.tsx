// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

vi.mock('../../lib/db/friends');

import { FriendsManager } from './FriendsManager';
import { addFriend, removeFriend } from '../../lib/db/friends';

const mockAddFriend = vi.mocked(addFriend);
const mockRemoveFriend = vi.mocked(removeFriend);

mockAddFriend.mockResolvedValue('f1');
mockRemoveFriend.mockResolvedValue(undefined);

const friends = [{ id: 'f1', name: 'Goku', friendCode: 'dr85d9jy', createdAt: 0 }];

beforeEach(() => { mockAddFriend.mockClear(); });
afterEach(() => { cleanup(); });

describe('FriendsManager', () => {
  it('blocks an invalid friend code', () => {
    render(<FriendsManager uid="u1" accountId="a1" friends={friends} onChanged={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Friend name'), { target: { value: 'Vegeta' } });
    fireEvent.change(screen.getByLabelText('Friend code'), { target: { value: 'bad' } });
    fireEvent.click(screen.getByRole('button', { name: /add friend/i }));
    expect(mockAddFriend).not.toHaveBeenCalled();
    expect(screen.getByText(/6-12/)).toBeDefined();
  });

  it('adds a valid friend', () => {
    render(<FriendsManager uid="u1" accountId="a1" friends={friends} onChanged={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Friend name'), { target: { value: 'Vegeta' } });
    fireEvent.change(screen.getByLabelText('Friend code'), { target: { value: 'abc123' } });
    fireEvent.click(screen.getByRole('button', { name: /add friend/i }));
    expect(mockAddFriend).toHaveBeenCalledWith('u1', 'a1', 'Vegeta', 'abc123');
  });
});
