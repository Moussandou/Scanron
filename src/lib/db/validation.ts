const FRIEND_CODE_RE = /^[a-zA-Z0-9]{6,12}$/;

export function isValidFriendCode(code: string): boolean {
  return FRIEND_CODE_RE.test(code);
}

export function assertValidFriendCode(code: string): void {
  if (!isValidFriendCode(code)) {
    throw new Error(`Invalid friend code: must be 6-12 letters or digits`);
  }
}
