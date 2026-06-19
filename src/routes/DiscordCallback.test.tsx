// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockSignInWithDiscord = vi.fn();
vi.mock('../lib/auth/discord', () => ({
  signInWithDiscord: (...args: unknown[]) => mockSignInWithDiscord(...args),
}));

import DiscordCallback from './DiscordCallback';

beforeEach(() => {
  mockSignInWithDiscord.mockReset();
});

afterEach(() => {
  cleanup();
});

describe('DiscordCallback', () => {
  it('shows loading state and calls signInWithDiscord, then redirects to /', async () => {
    mockSignInWithDiscord.mockResolvedValue('user-uid-abc');

    render(
      <MemoryRouter initialEntries={['/auth/discord/callback?code=my-discord-code']}>
        <Routes>
          <Route path="/auth/discord/callback" element={<DiscordCallback />} />
          <Route path="/" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    // Should see loading message
    expect(screen.getByText(/connecting with discord/i)).toBeDefined();

    // Verify it called signInWithDiscord with correct redirect URL (derived from window.location)
    await waitFor(() => {
      expect(mockSignInWithDiscord).toHaveBeenCalledWith(
        'my-discord-code',
        expect.stringContaining('/auth/discord/callback'),
      );
    });

    // Verify redirect to "/"
    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeDefined();
    });
  });

  it('displays error if signInWithDiscord fails', async () => {
    mockSignInWithDiscord.mockRejectedValue(new Error('OAuth error'));

    render(
      <MemoryRouter initialEntries={['/auth/discord/callback?code=bad-code']}>
        <Routes>
          <Route path="/auth/discord/callback" element={<DiscordCallback />} />
          <Route path="/" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/failed to authenticate/i)).toBeDefined();
      expect(screen.getByText(/oauth error/i)).toBeDefined();
    });

    // Verify a link or button to go back exists
    expect(screen.getByRole('link', { name: /go to login/i })).toBeDefined();
  });

  it('immediately redirects to / if no code is present', async () => {
    render(
      <MemoryRouter initialEntries={['/auth/discord/callback']}>
        <Routes>
          <Route path="/auth/discord/callback" element={<DiscordCallback />} />
          <Route path="/" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeDefined();
    });
    expect(mockSignInWithDiscord).not.toHaveBeenCalled();
  });
});
