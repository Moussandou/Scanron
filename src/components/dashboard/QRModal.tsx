import { useEffect, useState } from 'react';
import { X, Download, Copy, Share2, Check } from 'lucide-react';
import { qrDataUrl } from '../../lib/qr/image';
import { searchCode } from '../../lib/qr/shenron';
import { subscribeToTimeOffset } from '../../lib/qr/timeSync';
import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n/I18nContext';

interface Props {
  name: string;
  friendCode: string;
  onClose: () => void;
}

export function QRModal({ name, friendCode, onClose }: Props) {
  const { t } = useTranslation();
  const [src, setSrc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Bump on offset change so the QR + search code regenerate with the new time.
  const [offsetVersion, setOffsetVersion] = useState(0);
  const code = searchCode(friendCode);

  useEffect(() => subscribeToTimeOffset(() => setOffsetVersion((v) => v + 1)), []);

  useEffect(() => {
    let stale = false;
    qrDataUrl(friendCode).then((url) => { if (!stale) setSrc(url); });
    return () => { stale = true; };
  }, [friendCode, offsetVersion]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl border border-primary/10 bg-surface/90 backdrop-blur-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4.5 top-4.5 text-muted hover:text-primary hover:rotate-90 transition-all duration-300 p-1 cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="mb-1 text-lg font-display font-black tracking-wider text-text uppercase">{name}</h2>
        
        <div className="mb-5 flex flex-col gap-1 bg-surface-2/60 p-3 rounded-lg border border-border/50">
          <span className="text-[9px] uppercase tracking-wider font-display font-bold text-muted">{t('qr.searchCode')}</span>
          <span className="font-mono text-[10px] text-primary/85 break-all select-all tracking-wider">{code}</span>
        </div>

        <div className="relative mx-auto aspect-square max-w-xs overflow-hidden rounded-xl bg-white border border-border/40 p-4 shadow-inner">
          {/* Scanner corner brackets */}
          <span className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-primary/70 rounded-tl-sm" />
          <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-primary/70 rounded-tr-sm" />
          <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-primary/70 rounded-bl-sm" />
          <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-primary/70 rounded-br-sm" />
          <span className="absolute top-3 right-9 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          {src ? (
            <>
              <img src={src} alt={`QR for ${name}`} className="w-full h-full object-contain" />
              <span className="absolute left-0 w-full h-[2px] bg-accent/50 shadow-[0_0_8px_var(--color-accent)] animate-[scan_3s_linear_infinite] pointer-events-none" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 h-full">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-[9px] uppercase tracking-widest font-display font-bold text-primary">{t('qr.generating')}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {src && (
            <a href={src} download={`${name}-shenron.png`}>
              <Button variant="outline" size="sm" className="gap-1.5 h-9">
                <Download size={14} /> {t('qr.download')}
              </Button>
            </a>
          )}
          <Button variant="outline" size="sm" className="gap-1.5 h-9" onClick={copyCode}>
            {copied ? (
              <>
                <Check className="text-primary animate-bounce" size={14} /> {t('qr.copied')}
              </>
            ) : (
              <>
                <Copy size={14} /> {t('qr.copy')}
              </>
            )}
          </Button>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button variant="outline" size="sm" className="gap-1.5 h-9" onClick={share}>
              <Share2 size={14} /> {t('qr.share')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
