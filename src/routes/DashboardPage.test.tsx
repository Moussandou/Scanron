// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

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

import { I18nProvider } from '../lib/i18n/I18nContext';
import DashboardPage from './DashboardPage';

function renderPage(initialPath = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <I18nProvider>
        <DashboardPage />
      </I18nProvider>
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe('DashboardPage', () => {
  it('renders both tabs', () => {
    renderPage();
    expect(screen.getByRole('tab', { name: 'Scan' })).toBeDefined();
    expect(screen.getByRole('tab', { name: 'Manage' })).toBeDefined();
  });

  it('shows QR cards on the Scan tab by default', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Goku')).toBeDefined());
  });

  it('shows the friends manager when the Manage tab is selected', () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: 'Manage' }));
    expect(screen.getByText('Add Friend')).toBeDefined();
  });

  it('opens the Manage tab directly from ?tab=manage', () => {
    renderPage('/dashboard?tab=manage');
    expect(screen.getByText('Add Friend')).toBeDefined();
  });
});
