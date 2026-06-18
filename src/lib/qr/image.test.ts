import { describe, it, expect } from 'vitest';
import { qrDataUrl } from './image';

describe('qrDataUrl', () => {
  it('returns a PNG data URL for a friend code', async () => {
    const url = await qrDataUrl('dr85d9jy', 1781821328537);
    expect(url.startsWith('data:image/png;base64,')).toBe(true);
    expect(url.length).toBeGreaterThan(100);
  });

  it('produces different images for different timestamps', async () => {
    const a = await qrDataUrl('dr85d9jy', 1781821328537);
    const b = await qrDataUrl('dr85d9jy', 1781821328538);
    expect(a).not.toBe(b);
  });
});
