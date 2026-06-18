import { describe, it, expect } from 'vitest';
import { isValidFriendCode, assertValidFriendCode } from './validation';

describe('friend code validation', () => {
  it('accepts 6-12 alphanumerics', () => {
    expect(isValidFriendCode('dr85d9jy')).toBe(true);
    expect(isValidFriendCode('umd74s5q8')).toBe(true);
    expect(isValidFriendCode('abc123')).toBe(true);
  });
  it('rejects bad codes', () => {
    expect(isValidFriendCode('abc')).toBe(false);
    expect(isValidFriendCode('has space')).toBe(false);
    expect(isValidFriendCode('toolongcode1234')).toBe(false);
    expect(isValidFriendCode('dash-dash')).toBe(false);
  });
  it('assert throws on invalid', () => {
    expect(() => assertValidFriendCode('abc')).toThrowError(/friend code/i);
    expect(() => assertValidFriendCode('dr85d9jy')).not.toThrow();
  });
});
