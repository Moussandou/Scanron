// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

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
vi.mock('../lib/qr/image', () => ({
  qrDataUrl: vi.fn().mockResolvedValue('data:image/png;base64,iVBORw0KGgo='),
}));

import DashboardPage from './DashboardPage';

describe('DashboardPage', () => {
  it('renders QR cards for each friend', async () => {
    render(<DashboardPage />);
    await waitFor(() => expect(screen.getByText('Goku')).toBeDefined());
  });
});
