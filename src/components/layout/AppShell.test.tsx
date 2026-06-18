// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('renders the wordmark and child content', () => {
    render(
      <MemoryRouter>
        <AppShell>
          <p>child content</p>
        </AppShell>
      </MemoryRouter>,
    );
    expect(screen.getByText('Scanron')).toBeDefined();
    expect(screen.getByText('child content')).toBeDefined();
  });
});
