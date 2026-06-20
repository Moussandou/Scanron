// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { I18nProvider } from '../../lib/i18n/I18nContext';
import { AccountSwitcher } from './AccountSwitcher';

vi.mock('../../lib/db/accounts', () => ({
  createAccount: vi.fn(),
  renameAccount: vi.fn(),
  deleteAccount: vi.fn().mockResolvedValue(undefined),
  LOCAL_DEFAULT_NAME: 'Default Account',
}));
import { deleteAccount } from '../../lib/db/accounts';

const accounts = [
  { id: 'a1', name: 'Main', order: 0, createdAt: 0 },
  { id: 'a2', name: 'Alt', order: 1, createdAt: 0 },
];

afterEach(cleanup);

describe('AccountSwitcher', () => {
  it('with a single profile shows only the add-profile link and no management controls', () => {
    render(
      <I18nProvider>
        <AccountSwitcher uid="u1" accounts={[accounts[0]]} currentId="a1" onSelect={vi.fn()} onChanged={vi.fn()} />
      </I18nProvider>,
    );
    expect(screen.getByRole('button', { name: /add profile/i })).toBeDefined();
    expect(screen.queryByRole('button', { name: /delete account/i })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Main' })).toBeNull();
  });

  it('with multiple profiles shows chips and management controls', () => {
    render(
      <I18nProvider>
        <AccountSwitcher uid="u1" accounts={accounts} currentId="a1" onSelect={vi.fn()} onChanged={vi.fn()} />
      </I18nProvider>,
    );
    expect(screen.getByRole('button', { name: 'Alt' })).toBeDefined();
    expect(screen.getByRole('button', { name: /delete account/i })).toBeDefined();
  });

  it('calls onSelect when a chip is clicked', () => {
    const onSelect = vi.fn();
    render(
      <I18nProvider>
        <AccountSwitcher uid="u1" accounts={accounts} currentId="a1" onSelect={onSelect} onChanged={vi.fn()} />
      </I18nProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Alt' }));
    expect(onSelect).toHaveBeenCalledWith('a2');
  });

  it('deletes the active account after confirmation and resets selection', async () => {
    const onSelect = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(
      <I18nProvider>
        <AccountSwitcher uid="u1" accounts={accounts} currentId="a1" onSelect={onSelect} onChanged={vi.fn()} />
      </I18nProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));
    await Promise.resolve();
    expect(deleteAccount).toHaveBeenCalledWith('u1', 'a1');
    expect(onSelect).toHaveBeenCalledWith(null);
    confirmSpy.mockRestore();
  });
});
