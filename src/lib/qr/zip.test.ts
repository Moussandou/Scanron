import { describe, it, expect, vi } from 'vitest';

vi.mock('./image', () => ({
  qrDataUrl: vi.fn().mockResolvedValue('data:image/png;base64,iVBORw0KGgo='),
}));

import { buildFriendsZipBlob } from './zip';

describe('buildFriendsZipBlob', () => {
  it('returns a zip blob containing one file per friend', async () => {
    const blob = await buildFriendsZipBlob([
      { name: 'Goku', friendCode: 'dr85d9jy' },
      { name: 'Vegeta', friendCode: 'abc12345' },
    ]);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/zip');
  });
});
