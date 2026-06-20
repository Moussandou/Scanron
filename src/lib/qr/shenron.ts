// DBL Shenron QR encoding (LeCitronVert format). Validated against real
// in-game data: qrPayload('dr85d9jy', 1781821328537) === '4,dr85d9jyCMSRQREQQMM'.
// Do not change WHEEL or the payload shape without re-validating the golden vector.

import { getEffectiveTime } from './timeSync';

const WHEEL = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T'] as const;

/** The 16-letter substitution wheel, exposed for the landing decoder demo. */
export const DECODE_WHEEL = WHEEL;

/**
 * Break the timestamp encoding into its visible steps, for the landing demo:
 * the hex form of the epoch ms and the per-digit letter substitution.
 */
export function encodeSteps(ms: number): { hex: string; letters: string } {
  const hex = ms.toString(16);
  const letters = hex
    .split('')
    .map((c) => WHEEL[parseInt(c, 16)])
    .join('');
  return { hex, letters };
}

/** Encode an epoch-millisecond timestamp into its DBL letter form. */
function encodeTimestamp(ms: number): string {
  return ms
    .toString(16)
    .split('')
    .map((c) => WHEEL[parseInt(c, 16)])
    .join('');
}

/** Decode the DBL letter form back to epoch milliseconds. */
function decodeEncodedTimestamp(encoded: string): number {
  let hex = '';
  for (const ch of encoded) {
    hex += WHEEL.indexOf(ch as (typeof WHEEL)[number]).toString(16);
  }
  return parseInt(hex, 16);
}

/**
 * "Code de recherche": friend code followed by the encoded timestamp.
 * Defaults to the clock-offset-corrected time so codes match the game servers.
 */
export function searchCode(friendCode: string, at: number = getEffectiveTime()): string {
  return `${friendCode}${encodeTimestamp(at)}`;
}

/** The exact string encoded inside the scannable QR image. */
export function qrPayload(friendCode: string, at: number = getEffectiveTime()): string {
  return `4,${searchCode(friendCode, at)}`;
}

/**
 * Recover the generation timestamp from a search code or QR payload.
 * Pass the friend code length so we know where the encoded timestamp starts.
 */
export function decodeTimestamp(searchOrEncoded: string, friendCodeLength: number): number {
  const withoutPrefix = searchOrEncoded.startsWith('4,')
    ? searchOrEncoded.slice(2)
    : searchOrEncoded;
  const encoded = withoutPrefix.slice(friendCodeLength);
  return decodeEncodedTimestamp(encoded);
}
