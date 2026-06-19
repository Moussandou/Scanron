import QRCode from 'qrcode';
import { qrPayload } from './shenron';
import { getEffectiveTime } from './timeSync';

/**
 * Render a scannable Shenron QR as a PNG data URL.
 * Error correction level H matches the community generators and tolerates the
 * Dragon Ball Legends logo overlay drawn on top in the UI.
 */
export function qrDataUrl(friendCode: string, at: number = getEffectiveTime()): Promise<string> {
  return QRCode.toDataURL(qrPayload(friendCode, at), {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 360,
  });
}
