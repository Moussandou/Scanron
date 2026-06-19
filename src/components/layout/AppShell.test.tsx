// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { I18nProvider } from '../../lib/i18n/I18nContext';

vi.mock('../../lib/auth/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

describe('AppShell', () => {
  it('renders the wordmark and child content', () => {
    render(
      <MemoryRouter>
        <I18nProvider>
          <AppShell>
            <p>child content</p>
          </AppShell>
        </I18nProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Scanron')).toBeDefined();
    expect(screen.getByText('child content')).toBeDefined();
  });
});
