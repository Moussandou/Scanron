// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../lib/qr/image', () => ({
  qrDataUrl: vi.fn().mockResolvedValue('data:image/png;base64,iVBORw0KGgo='),
}));

import { QRCard } from './QRCard';

describe('QRCard', () => {
  it('renders the friend name and a QR image', async () => {
    render(<QRCard name="Goku" friendCode="dr85d9jy" onExpand={vi.fn()} />);
    expect(screen.getByText('Goku')).toBeDefined();
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeDefined();
    });
  });
});
