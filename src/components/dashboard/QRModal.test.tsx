// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../../lib/qr/image', () => ({
  qrDataUrl: vi.fn().mockResolvedValue('data:image/png;base64,iVBORw0KGgo='),
}));

import { I18nProvider } from '../../lib/i18n/I18nContext';
import { QRModal } from './QRModal';

describe('QRModal', () => {
  it('shows the friend name and calls onClose', async () => {
    const onClose = vi.fn();
    render(
      <I18nProvider>
        <QRModal name="Goku" friendCode="dr85d9jy" onClose={onClose} />
      </I18nProvider>,
    );
    expect(screen.getByText('Goku')).toBeDefined();
    await waitFor(() => expect(screen.getByRole('img')).toBeDefined());
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
