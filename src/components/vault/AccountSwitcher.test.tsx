// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccountSwitcher } from './AccountSwitcher';

const accounts = [
  { id: 'a1', name: 'Main', order: 0, createdAt: 0 },
  { id: 'a2', name: 'Alt', order: 1, createdAt: 0 },
];

describe('AccountSwitcher', () => {
  it('calls onSelect when a chip is clicked', () => {
    const onSelect = vi.fn();
    render(<AccountSwitcher uid="u1" accounts={accounts} currentId="a1" onSelect={onSelect} onCreated={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Alt' }));
    expect(onSelect).toHaveBeenCalledWith('a2');
  });
});
