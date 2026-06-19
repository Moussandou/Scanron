// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Tabs } from './Tabs';

afterEach(cleanup);

const tabs = [
  { id: 'scan', label: 'Scanner' },
  { id: 'manage', label: 'Manage' },
];

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs tabs={tabs} current="scan" onChange={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Scanner' })).toBeDefined();
    expect(screen.getByRole('tab', { name: 'Manage' })).toBeDefined();
  });

  it('marks the current tab as selected', () => {
    render(<Tabs tabs={tabs} current="manage" onChange={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Manage' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tab', { name: 'Scanner' }).getAttribute('aria-selected')).toBe('false');
  });

  it('calls onChange with the tab id when clicked', () => {
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} current="scan" onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Manage' }));
    expect(onChange).toHaveBeenCalledWith('manage');
  });
});
