// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('./lib/auth/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'u1' }, loading: false }),
}));

import { I18nProvider } from './lib/i18n/I18nContext';
import App from './App';

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('renders the landing page at the root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </MemoryRouter>,
    );
    expect(screen.getAllByText('Scanron').length).toBeGreaterThan(0);
    expect(screen.getByText('Launch Radar')).toBeDefined();
  });

  it('renders the Codes page at the /dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </MemoryRouter>,
    );
    expect(screen.getAllByText('Scanron').length).toBeGreaterThan(0);
    expect(screen.getByRole('tab', { name: 'Scan' })).toBeDefined();
  });

  it('redirects /vault to the Manage tab of the Codes page', () => {
    render(
      <MemoryRouter initialEntries={['/vault']}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('tab', { name: 'Manage' }).getAttribute('aria-selected')).toBe('true');
  });
});
