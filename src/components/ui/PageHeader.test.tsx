// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';
import { SectionLabel } from './SectionLabel';

describe('PageHeader', () => {
  it('renders the title', () => {
    render(<PageHeader title="Codes" />);
    expect(screen.getByRole('heading', { name: 'Codes' })).toBeDefined();
  });

  it('renders the subtitle when provided', () => {
    render(<PageHeader title="Codes" subtitle="Scan and manage" />);
    expect(screen.getByText('Scan and manage')).toBeDefined();
  });

  it('renders the right slot', () => {
    render(<PageHeader title="Codes" right={<button>switcher</button>} />);
    expect(screen.getByRole('button', { name: 'switcher' })).toBeDefined();
  });
});

describe('SectionLabel', () => {
  it('renders its children', () => {
    render(<SectionLabel>Statistics</SectionLabel>);
    expect(screen.getByText('Statistics')).toBeDefined();
  });
});
