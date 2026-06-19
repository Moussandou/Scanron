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
      className="group relative rounded-2xl border border-border bg-surface/40 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_8px_25px_-8px_rgba(54,226,123,0.25)] cursor-pointer select-none"
      onClick={onExpand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onExpand()}
    >
      <div className="mb-4.5 flex items-center justify-between">
        <span className="font-bold text-sm text-text group-hover:text-primary transition-colors">{name}</span>
        <span className="font-mono text-[10px] text-muted bg-surface-2/80 px-2 py-0.5 rounded border border-border/60 truncate max-w-[50%]">
          {friendCode}
        </span>
      </div>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white flex items-center justify-center border border-border/50 p-2 shadow-inner transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.45)]">
        {src ? (
          <img src={src} alt={`QR for ${name}`} className="w-full h-full object-contain" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-[9px] uppercase tracking-widest font-display font-bold text-primary">Scanning...</span>
          </div>
        )}
      </div>
      <div className="mt-4.5 flex items-center justify-between text-xs text-muted">
        <span className="font-mono text-[10px] bg-surface-2/60 px-2 py-1 rounded truncate max-w-[65%] text-muted/80">{code}</span>
        <div className="flex gap-2.5">
          {src && (
            <a
              href={src}
              download={`${name}-shenron.png`}
              onClick={(e) => e.stopPropagation()}
              className="text-muted hover:text-primary hover:scale-110 active:scale-95 transition-all duration-200 p-1"
              aria-label={`Download ${name} QR`}
            >
              <Download size={15} />
            </a>
          )}
          <button
            className="text-muted hover:text-primary hover:scale-110 active:scale-95 transition-all duration-200 p-1 cursor-pointer"
            aria-label={`Expand ${name} QR`}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
