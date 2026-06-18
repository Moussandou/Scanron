import { describe, it, expect } from 'vitest';
import { searchCode, qrPayload, decodeTimestamp } from './shenron';

const GOLDEN_TS = 1781821328537; // 2026-06-18T22:22:08Z, from a real in-game QR
const GOLDEN_FRIEND = 'dr85d9jy';
const GOLDEN_SEARCH = 'dr85d9jyCMSRQREQQMM';
const GOLDEN_PAYLOAD = '4,dr85d9jyCMSRQREQQMM';

describe('shenron QR core', () => {
  it('reproduces the real in-game search code (golden vector)', () => {
    expect(searchCode(GOLDEN_FRIEND, GOLDEN_TS)).toBe(GOLDEN_SEARCH);
  });

  it('builds the full QR payload with the 4, prefix', () => {
    expect(qrPayload(GOLDEN_FRIEND, GOLDEN_TS)).toBe(GOLDEN_PAYLOAD);
  });

  it('round-trips the timestamp back out of the encoded part', () => {
    const code = searchCode(GOLDEN_FRIEND, GOLDEN_TS);
    expect(decodeTimestamp(code, GOLDEN_FRIEND.length)).toBe(GOLDEN_TS);
  });

  it('defaults to the current time when no timestamp is given', () => {
    const before = Date.now();
    const code = searchCode(GOLDEN_FRIEND);
    const after = Date.now();
    const ts = decodeTimestamp(code, GOLDEN_FRIEND.length);
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it('handles a 9-character friend code', () => {
    const ts = 1718800000000;
    const code = searchCode('umd74s5q8', ts);
    expect(code.startsWith('umd74s5q8')).toBe(true);
    expect(decodeTimestamp(code, 'umd74s5q8'.length)).toBe(ts);
  });
});
