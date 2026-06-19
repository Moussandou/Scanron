import JSZip from 'jszip';
import { qrDataUrl } from './image';

function dataUrlToUint8(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

export async function buildFriendsZipBlob(
  friends: { name: string; friendCode: string }[],
): Promise<Blob> {
  const zip = new JSZip();
  const now = Date.now();
  await Promise.all(
    friends.map(async (f, i) => {
      const url = await qrDataUrl(f.friendCode, now);
      zip.file(`${String(i + 1).padStart(2, '0')}_${f.name}.png`, dataUrlToUint8(url));
    }),
  );
  return zip.generateAsync({ type: 'blob' });
}

export async function downloadFriendsZip(
  friends: { name: string; friendCode: string }[],
): Promise<void> {
  const blob = await buildFriendsZipBlob(friends);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `scanron-qr-${new Date().toISOString().slice(0, 10)}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
}
