import { useEffect, useState } from 'react';
import { X, Download, Copy, Share2 } from 'lucide-react';
import { qrDataUrl } from '../../lib/qr/image';
import { searchCode } from '../../lib/qr/shenron';
import { Button } from '../ui/button';

interface Props {
  name: string;
  friendCode: string;
  onClose: () => void;
}

export function QRModal({ name, friendCode, onClose }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const code = searchCode(friendCode);

  useEffect(() => {
    let stale = false;
    qrDataUrl(friendCode).then((url) => { if (!stale) setSrc(url); });
    return () => { stale = true; };
  }, [friendCode]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function share() {
    if (!navigator.share) return;
    await navigator.share({ title: `Shenron QR - ${name}`, text: code });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-text"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="mb-4 text-lg font-semibold">{name}</h2>
        <p className="mb-4 font-mono text-xs text-muted break-all">{code}</p>

        <div className="mx-auto aspect-square max-w-xs overflow-hidden rounded-lg bg-white flex items-center justify-center">
          {src ? (
            <img src={src} alt={`QR for ${name}`} className="w-full h-full object-contain" />
          ) : (
            <span className="text-xs text-muted">Generating...</span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {src && (
            <a href={src} download={`${name}-shenron.png`}>
              <Button variant="outline" className="gap-1.5">
                <Download size={14} /> Download
              </Button>
            </a>
          )}
          <Button variant="outline" className="gap-1.5" onClick={copyCode}>
            <Copy size={14} /> {copied ? 'Copied' : 'Copy code'}
          </Button>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button variant="outline" className="gap-1.5" onClick={share}>
              <Share2 size={14} /> Share
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
