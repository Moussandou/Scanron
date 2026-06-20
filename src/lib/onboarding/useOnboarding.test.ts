// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useOnboarding, ONBOARDING_DONE_KEY } from './useOnboarding';

const store: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = String(v); },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => { for (const k of Object.keys(store)) delete store[k]; },
});

beforeEach(() => localStorage.clear());

describe('useOnboarding', () => {
  it('starts active when the flag is unset', () => {
    const { result } = renderHook(() => useOnboarding(2));
    expect(result.current.active).toBe(true);
    expect(result.current.step).toBe(0);
  });

  it('stays inactive when already completed', () => {
    localStorage.setItem(ONBOARDING_DONE_KEY, '1');
    const { result } = renderHook(() => useOnboarding(2));
    expect(result.current.active).toBe(false);
  });

  it('advances with next until the last step, then finishes and persists', () => {
    const { result } = renderHook(() => useOnboarding(2));
    act(() => result.current.next());
    expect(result.current.step).toBe(1);
    expect(result.current.active).toBe(true);

    act(() => result.current.next());
    expect(result.current.active).toBe(false);
    expect(localStorage.getItem(ONBOARDING_DONE_KEY)).toBe('1');
  });

  it('skip deactivates and persists immediately', () => {
    const { result } = renderHook(() => useOnboarding(2));
    act(() => result.current.skip());
    expect(result.current.active).toBe(false);
    expect(localStorage.getItem(ONBOARDING_DONE_KEY)).toBe('1');
  });
});
