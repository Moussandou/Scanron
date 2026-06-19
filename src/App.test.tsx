// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('./lib/auth/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'u1' }, loading: false }),
}));

import { I18nProvider } from './lib/i18n/I18nContext';
import App from './App';

describe('App', () => {
  it('renders the dashboard at the index route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Scanron')).toBeDefined();
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
  });
});
