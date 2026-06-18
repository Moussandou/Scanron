// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Generate</Button>);
    expect(screen.getByRole('button', { name: 'Generate' })).toBeDefined();
  });
  it('applies the outline variant class', () => {
    render(<Button variant="outline">x</Button>);
    const btn = screen.getByRole('button', { name: 'x' });
    expect(btn.className).toContain('border');
  });
});
