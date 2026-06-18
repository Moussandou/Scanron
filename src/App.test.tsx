// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('./lib/auth/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'u1' }, loading: false }),
}));

import App from './App';

describe('App', () => {
  it('renders the dashboard at the index route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Scanron')).toBeDefined();
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
  });
});
