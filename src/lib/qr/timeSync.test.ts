import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getTimeOffset,
  setTimeOffset,
  getEffectiveTime,
  subscribeToTimeOffset,
  syncTimeWithServer,
} from './timeSync';

// Minimal in-memory localStorage + an EventTarget-backed window so the module
// can run under the default node test environment.
function installBrowserGlobals() {
  const store = new Map<string, string>();
  const localStorageMock = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  };
  vi.stubGlobal('localStorage', localStorageMock);
  vi.stubGlobal('window', new EventTarget());
}

describe('timeSync', () => {
  beforeEach(() => {
    installBrowserGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('defaults to a zero offset when nothing is stored', () => {
    expect(getTimeOffset()).toBe(0);
  });

  it('persists and reads back the offset from localStorage', () => {
    setTimeOffset(90_000);
    expect(getTimeOffset()).toBe(90_000);
    expect(localStorage.getItem('scanron_time_offset')).toBe('90000');
  });

  it('returns 0 for a corrupt stored value', () => {
    localStorage.setItem('scanron_time_offset', 'not-a-number');
    expect(getTimeOffset()).toBe(0);
  });

  it('applies the offset to the effective time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-19T12:00:00Z'));
    setTimeOffset(60_000);
    expect(getEffectiveTime()).toBe(Date.now() + 60_000);
  });

  it('dispatches an event to subscribers when the offset changes', () => {
    const received: number[] = [];
    const unsubscribe = subscribeToTimeOffset((value) => received.push(value));
    setTimeOffset(5_000);
    setTimeOffset(-2_000);
    unsubscribe();
    setTimeOffset(123); // ignored after unsubscribe
    expect(received).toEqual([5_000, -2_000]);
  });

  it('computes a positive offset when the server clock is ahead', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-19T12:00:00.000Z'));
    // Server reports a time two minutes ahead of the device clock.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ utc_datetime: '2026-06-19T12:02:00.000Z' }),
      })) as unknown as typeof fetch,
    );

    const offset = await syncTimeWithServer();
    // Latency is ~0 with fake timers, so the offset is the full 2 minutes.
    expect(offset).toBeGreaterThan(115_000);
    expect(offset).toBeLessThanOrEqual(120_000);
    expect(getTimeOffset()).toBe(offset);
  });

  it('falls back to the secondary API when the primary fails', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-19T12:00:00.000Z'));
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503 }) // primary down
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ dateTime: '2026-06-19T12:00:30.000' }),
      });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const offset = await syncTimeWithServer();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(offset).toBeGreaterThan(25_000);
    expect(offset).toBeLessThanOrEqual(30_000);
  });
});
