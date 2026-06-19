import { useEffect, useState } from 'react';
import { Clock, AlertTriangle, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../lib/i18n/I18nContext';
import { getTimeOffset, subscribeToTimeOffset } from '../../lib/qr/timeSync';
import { TimeSyncControls } from './TimeSyncControls';

// Matches TimeSyncControls' threshold: drift past this needs attention.
const DRIFT_THRESHOLD = 10_000;

/**
 * Compact clock-status chip for the Codes page. Calm green when synced, amber
 * when the clock drifts. Clicking expands the full TimeSyncControls inline so
 * the heavy panel only appears when the player actually needs it.
 */
export function TimeSyncChip() {
  const { t } = useTranslation();
  const [offset, setOffset] = useState(() => getTimeOffset());
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeToTimeOffset((value) => setOffset(value)), []);

  const drifting = Math.abs(offset) > DRIFT_THRESHOLD;

  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer',
          drifting
            ? 'border-accent/30 bg-accent/10 text-accent'
            : 'border-signal/30 bg-signal/5 text-signal hover:bg-signal/10',
        )}
      >
        {drifting ? <AlertTriangle size={14} /> : <Clock size={14} />}
        <span>{drifting ? t('timeSync.chipDrift') : t('timeSync.chipOk')}</span>
        <span className="text-muted font-normal">· {t('timeSync.chipAdjust')}</span>
        <ChevronDown size={13} className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          <TimeSyncControls />
        </div>
      )}
    </div>
  );
}
