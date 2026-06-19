// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { I18nProvider } from '../../lib/i18n/I18nContext';
import { TimeSyncChip } from './TimeSyncChip';
import { setTimeOffset } from '../../lib/qr/timeSync';

function renderChip() {
  return render(
    <I18nProvider>
      <TimeSyncChip />
    </I18nProvider>,
  );
}

beforeEach(() => {
  setTimeOffset(0);
});

afterEach(cleanup);

describe('TimeSyncChip', () => {
  it('shows the synced state with no drift', () => {
    renderChip();
    expect(screen.getByText(/clock synced/i)).toBeDefined();
  });

  it('shows the drift state when the offset is large', () => {
    renderChip();
    act(() => setTimeOffset(60_000));
    expect(screen.getByText(/clock drift/i)).toBeDefined();
  });

  it('expands the full controls when clicked', () => {
    renderChip();
    // Sync controls are hidden until expanded.
    expect(screen.queryByText(/auto-sync clock/i)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /clock synced|adjust/i }));
    expect(screen.getByText(/auto-sync clock/i)).toBeDefined();
  });
});
