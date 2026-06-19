// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { I18nProvider } from '../../lib/i18n/I18nContext';

vi.mock('../../lib/auth/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

afterEach(cleanup);

function renderShell() {
  return render(
    <MemoryRouter>
      <I18nProvider>
        <AppShell>
          <p>child content</p>
        </AppShell>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('AppShell', () => {
  it('renders the wordmark and child content', () => {
    renderShell();
    expect(screen.getAllByText('Scanron').length).toBeGreaterThan(0);
    expect(screen.getByText('child content')).toBeDefined();
  });

  it('shows Codes and Settings nav, but not Vault', () => {
    renderShell();
    // Codes/Settings appear in both the header nav and the footer.
    expect(screen.getAllByRole('link', { name: 'Codes' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Settings' }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('link', { name: 'Vault' })).toBeNull();
  });

  it('shows the local-mode banner when signed out', () => {
    renderShell();
    // useAuth is mocked to return user: null
    expect(screen.getByText('Local Mode Active')).toBeDefined();
  });
});
