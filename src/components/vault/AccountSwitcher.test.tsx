// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from '../../lib/i18n/I18nContext';
import { AccountSwitcher } from './AccountSwitcher';

const accounts = [
  { id: 'a1', name: 'Main', order: 0, createdAt: 0 },
  { id: 'a2', name: 'Alt', order: 1, createdAt: 0 },
];

describe('AccountSwitcher', () => {
  it('calls onSelect when a chip is clicked', () => {
    const onSelect = vi.fn();
    render(
      <I18nProvider>
        <AccountSwitcher uid="u1" accounts={accounts} currentId="a1" onSelect={onSelect} onCreated={vi.fn()} />
      </I18nProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Alt' }));
    expect(onSelect).toHaveBeenCalledWith('a2');
  });
});
