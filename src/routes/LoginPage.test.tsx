// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { signInWithEmail, signInWithGoogle, registerWithEmail } = vi.hoisted(() => ({
  signInWithEmail: vi.fn().mockResolvedValue('u1'),
  signInWithGoogle: vi.fn().mockResolvedValue('u1'),
  registerWithEmail: vi.fn().mockResolvedValue('u1'),
}));
vi.mock('../lib/auth/methods', () => ({ signInWithEmail, signInWithGoogle, registerWithEmail }));

import LoginPage from './LoginPage';

beforeEach(() => { signInWithEmail.mockClear(); });

describe('LoginPage', () => {
  it('signs in with email and password', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.co' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pw123456' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(signInWithEmail).toHaveBeenCalledWith('a@b.co', 'pw123456');
  });
});
