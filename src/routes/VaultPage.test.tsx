// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../lib/auth/useAuth', () => ({ useAuth: () => ({ user: { uid: 'u1' }, loading: false }) }));
vi.mock('../lib/db/hooks', () => ({
  useAccounts: () => ({
    accounts: [{ id: 'a1', name: 'Main', order: 0, createdAt: 0 }],
    loading: false, error: null, reload: vi.fn(),
  }),
  useFriends: () => ({
    friends: [{ id: 'f1', name: 'Goku', friendCode: 'dr85d9jy', createdAt: 0 }],
    loading: false, error: null, reload: vi.fn(),
  }),
}));

import VaultPage from './VaultPage';

describe('VaultPage', () => {
  it('renders the account and its friends', () => {
    render(<VaultPage />);
    expect(screen.getByRole('button', { name: 'Main' })).toBeDefined();
    expect(screen.getByText('Goku')).toBeDefined();
  });
});
