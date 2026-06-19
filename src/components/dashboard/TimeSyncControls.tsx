import { useEffect, useState } from 'react';
import { Clock, RefreshCw, Minus, Plus, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n/I18nContext';
import {
  getTimeOffset,
  setTimeOffset,
  syncTimeWithServer,
  subscribeToTimeOffset,
} from '../../lib/qr/timeSync';

// Drift above this (in ms) is flagged — DBL codes have a short validity window.
const DRIFT_THRESHOLD = 10_000;
const MINUTE = 60_000;

function formatClock(ms: number): string {
  return new Date(ms).toLocaleTimeString(undefined, { hour12: false });
}

function formatOffset(offset: number, ahead: string, behind: string): string {
  const abs = Math.abs(offset);
  const totalSeconds = Math.round(abs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const parts = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  if (totalSeconds === 0) return '0s';
  return `${parts} ${offset > 0 ? ahead : behind}`;
}

export function TimeSyncControls() {
  const { t } = useTranslation();
  const [offset, setOffset] = useState(() => getTimeOffset());
  const [now, setNow] = useState(() => Date.now());
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  // Live ticking clocks.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Keep in sync if the offset is changed elsewhere.
  useEffect(() => subscribeToTimeOffset((value) => setOffset(value)), []);

  const drifting = Math.abs(offset) > DRIFT_THRESHOLD;

  async function handleSync() {
    setSyncing(true);
    setStatus(null);
    try {
      await syncTimeWithServer();
      setStatus({ ok: true, msg: t('timeSync.syncSuccess') });
    } catch {
      setStatus({ ok: false, msg: t('timeSync.syncError') });
    } finally {
      setSyncing(false);
    }
  }

  function adjust(deltaMs: number) {
    setStatus(null);
    setTimeOffset(getTimeOffset() + deltaMs);
  }

  function reset() {
    setStatus(null);
    setTimeOffset(0);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur-sm p-6 space-y-5">
      <div className="flex items-start gap-2.5">
        <Clock size={18} className="text-primary mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text">
            {t('timeSync.title')}
          </h2>
          <p className="text-[11px] text-muted leading-relaxed max-w-prose">{t('timeSync.desc')}</p>
        </div>
      </div>

      {/* Clock readouts */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-display font-bold text-primary/80 block">
            {t('timeSync.radarTime')}
          </span>
          <span className="font-mono text-lg font-bold text-primary tabular-nums">
            {formatClock(now + offset)}
          </span>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface-2/20 p-4 space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-display font-bold text-muted block">
            {t('timeSync.systemTime')}
          </span>
          <span className="font-mono text-lg font-bold text-text/80 tabular-nums">
            {formatClock(now)}
          </span>
        </div>
      </div>

      {/* Drift status */}
      {drifting ? (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-accent/10 border border-accent/25 animate-in fade-in duration-200">
          <AlertTriangle size={16} className="text-accent mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-accent">
              {t('timeSync.driftTitle')} — {formatOffset(offset, t('timeSync.ahead'), t('timeSync.behind'))}
            </p>
            <p className="text-[11px] text-accent/85 leading-relaxed">{t('timeSync.driftDesc')}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-primary font-semibold">
          <CheckCircle2 size={15} />
          {t('timeSync.inSync')}
          {offset !== 0 && (
            <span className="text-muted font-normal font-mono">
              ({formatOffset(offset, t('timeSync.ahead'), t('timeSync.behind'))})
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="w-full sm:w-fit gap-1.5"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? t('timeSync.syncing') : t('timeSync.syncNow')}
        </Button>

        {status && (
          <p
            className={`text-xs font-semibold px-3 py-2 rounded-lg border ${
              status.ok
                ? 'bg-primary/10 border-primary/25 text-primary'
                : 'bg-accent/10 border-accent/25 text-accent'
            }`}
          >
            {status.msg}
          </p>
        )}

        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider font-display font-bold text-muted/80 block">
            {t('timeSync.manualHint')}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1 h-8" onClick={() => adjust(-5 * MINUTE)}>
              <Minus size={12} /> 5m
            </Button>
            <Button variant="outline" size="sm" className="gap-1 h-8" onClick={() => adjust(-MINUTE)}>
              <Minus size={12} /> 1m
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={reset}>
              <RotateCcw size={12} /> {t('timeSync.reset')}
            </Button>
            <Button variant="outline" size="sm" className="gap-1 h-8" onClick={() => adjust(MINUTE)}>
              <Plus size={12} /> 1m
            </Button>
            <Button variant="outline" size="sm" className="gap-1 h-8" onClick={() => adjust(5 * MINUTE)}>
              <Plus size={12} /> 5m
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
