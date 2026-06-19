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
    expect(screen.getByText('Scanron')).toBeDefined();
    expect(screen.getByText('Launch Radar')).toBeDefined();
  });

  it('renders the dashboard at the /dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Scanron')).toBeDefined();
    expect(screen.getByText('Active Stream Account')).toBeDefined();
  });
});
