// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

const { signInWithEmail, signInWithGoogle, registerWithEmail, getDiscordAuthUrl } = vi.hoisted(() => ({
  signInWithEmail: vi.fn().mockResolvedValue('u1'),
  signInWithGoogle: vi.fn().mockResolvedValue('u1'),
  registerWithEmail: vi.fn().mockResolvedValue('u1'),
  getDiscordAuthUrl: vi.fn().mockReturnValue('https://discord.com/mock-auth'),
}));
vi.mock('../lib/auth/methods', () => ({ signInWithEmail, signInWithGoogle, registerWithEmail }));
vi.mock('../lib/auth/discord', () => ({ getDiscordAuthUrl }));

import { I18nProvider } from '../lib/i18n/I18nContext';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

beforeEach(() => {
  signInWithEmail.mockClear();
  getDiscordAuthUrl.mockClear();
});

afterEach(() => {
  cleanup();
});

describe('LoginPage', () => {
  it('signs in with email and password', async () => {
    render(
      <MemoryRouter>
        <I18nProvider>
          <LoginPage />
        </I18nProvider>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.co' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pw123456' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(signInWithEmail).toHaveBeenCalledWith('a@b.co', 'pw123456');
  });

  it('redirects to discord auth URL on click', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    let hrefValue = '';
    window.location = {
      origin: 'http://localhost:3000',
      get href() { return hrefValue; },
      set href(v) { hrefValue = v; },
    } as any;

    render(
      <MemoryRouter>
        <I18nProvider>
          <LoginPage />
        </I18nProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /continue with discord/i }));

    expect(getDiscordAuthUrl).toHaveBeenCalledWith('http://localhost:3000/auth/discord/callback');
    expect(hrefValue).toBe('https://discord.com/mock-auth');

    (window as any).location = originalLocation;
  });
});
