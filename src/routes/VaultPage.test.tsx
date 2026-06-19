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

import { I18nProvider } from '../lib/i18n/I18nContext';
import VaultPage from './VaultPage';

describe('VaultPage', () => {
  it('renders the account and its friends', () => {
    render(
      <I18nProvider>
        <VaultPage />
      </I18nProvider>
    );
    expect(screen.getByRole('button', { name: 'Main' })).toBeDefined();
    expect(screen.getByText('Goku')).toBeDefined();
  });
});
