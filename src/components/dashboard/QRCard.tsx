import { useEffect, useState } from 'react';
import { Download, Maximize2 } from 'lucide-react';
import { qrDataUrl } from '../../lib/qr/image';
import { searchCode } from '../../lib/qr/shenron';
import { subscribeToTimeOffset } from '../../lib/qr/timeSync';
import { useTranslation } from '../../lib/i18n/I18nContext';

interface Props {
  name: string;
  friendCode: string;
  onExpand: () => void;
}

export function QRCard({ name, friendCode, onExpand }: Props) {
  const { t } = useTranslation();
  const [src, setSrc] = useState<string | null>(null);
  // Bump on offset change so the QR + search code regenerate with the new time.
  const [offsetVersion, setOffsetVersion] = useState(0);
  const code = searchCode(friendCode);

  useEffect(() => subscribeToTimeOffset(() => setOffsetVersion((v) => v + 1)), []);

  useEffect(() => {
    let stale = false;
    qrDataUrl(friendCode).then((url) => { if (!stale) setSrc(url); });
    return () => { stale = true; };
  }, [friendCode, offsetVersion]);

  return (
    <div
      className="group relative rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[var(--shadow-pop)] cursor-pointer select-none"
      onClick={onExpand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onExpand()}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-bold text-sm text-text group-hover:text-primary transition-colors">{name}</span>
        <span className="font-mono text-[10px] text-muted bg-surface-2/80 px-2 py-0.5 rounded border border-border/60 truncate max-w-[50%]">
          {friendCode}
        </span>
      </div>
      <div className="relative aspect-square w-full rounded-xl bg-white flex items-center justify-center border border-border/50 p-3 shadow-inner overflow-hidden">
        {/* Scanner corner brackets */}
        <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/70 rounded-tl-sm" />
        <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/70 rounded-tr-sm" />
        <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/70 rounded-bl-sm" />
        <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/70 rounded-br-sm" />
        {/* Live signal */}
        <span className="absolute top-2.5 right-7 flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-75 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
        </span>
        {src ? (
          <>
            <img src={src} alt={`QR for ${name}`} className="w-full h-full object-contain" />
            {/* Scan sweep on hover */}
            <span className="absolute left-0 w-full h-[2px] bg-accent/60 shadow-[0_0_8px_var(--color-accent)] opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2.4s_linear_infinite] pointer-events-none" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-[9px] uppercase tracking-widest font-display font-bold text-primary">{t('qr.generating')}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span className="font-mono text-[10px] bg-surface-2/60 px-2 py-1 rounded truncate max-w-[65%] text-muted/80">{code}</span>
        <div className="flex gap-2.5">
          {src && (
            <a
              href={src}
              download={`${name}-shenron.png`}
              onClick={(e) => e.stopPropagation()}
              className="text-muted hover:text-primary hover:scale-110 active:scale-95 transition-all duration-200 p-1"
              aria-label={`${t('qr.download')} — ${name}`}
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
