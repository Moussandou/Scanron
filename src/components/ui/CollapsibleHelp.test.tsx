// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CollapsibleHelp } from './CollapsibleHelp';

afterEach(cleanup);

describe('CollapsibleHelp', () => {
  it('hides its body by default', () => {
    render(
      <CollapsibleHelp title="How to scan">
        <p>scan instructions</p>
      </CollapsibleHelp>,
    );
    expect(screen.queryByText('scan instructions')).toBeNull();
    expect(screen.getByRole('button', { name: /how to scan/i }).getAttribute('aria-expanded')).toBe('false');
  });

  it('reveals its body when the title is clicked', () => {
    render(
      <CollapsibleHelp title="How to scan">
        <p>scan instructions</p>
      </CollapsibleHelp>,
    );
    fireEvent.click(screen.getByRole('button', { name: /how to scan/i }));
    expect(screen.getByText('scan instructions')).toBeDefined();
    expect(screen.getByRole('button', { name: /how to scan/i }).getAttribute('aria-expanded')).toBe('true');
  });

  it('respects defaultOpen', () => {
    render(
      <CollapsibleHelp title="How to scan" defaultOpen>
        <p>scan instructions</p>
      </CollapsibleHelp>,
    );
    expect(screen.getByText('scan instructions')).toBeDefined();
  });
});
