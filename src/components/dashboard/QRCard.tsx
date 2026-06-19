import { useEffect, useState } from 'react';
import { Download, Maximize2 } from 'lucide-react';
import { qrDataUrl } from '../../lib/qr/image';
import { searchCode } from '../../lib/qr/shenron';

interface Props {
  name: string;
  friendCode: string;
  onExpand: () => void;
}

export function QRCard({ name, friendCode, onExpand }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const code = searchCode(friendCode);

  useEffect(() => {
    let stale = false;
    qrDataUrl(friendCode).then((url) => { if (!stale) setSrc(url); });
    return () => { stale = true; };
  }, [friendCode]);

  return (
    <div
      className="group relative rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40 cursor-pointer"
      onClick={onExpand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onExpand()}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <span className="font-mono text-xs text-muted truncate ml-2">{friendCode}</span>
      </div>
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white flex items-center justify-center">
        {src ? (
          <img src={src} alt={`QR for ${name}`} className="w-full h-full object-contain" />
        ) : (
          <span className="text-xs text-muted">Generating...</span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span className="truncate max-w-[70%]">{code}</span>
        <div className="flex gap-2">
          {src && (
            <a
              href={src}
              download={`${name}-shenron.png`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-primary transition-colors"
              aria-label={`Download ${name} QR`}
            >
              <Download size={16} />
            </a>
          )}
          <button className="hover:text-primary transition-colors" aria-label={`Expand ${name} QR`}>
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
