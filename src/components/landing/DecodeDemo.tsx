import { useEffect, useState } from 'react';
import { encodeSteps, DECODE_WHEEL } from '../../lib/qr/shenron';
import { getEffectiveTime } from '../../lib/qr/timeSync';
import { qrDataUrl } from '../../lib/qr/image';

const FRIEND = 'dr85d9jy';

/**
 * Live decoder explainer — runs the real encoding the app uses and animates it
 * step by step: epoch ms → hex → letter-wheel substitution → search code → QR.
 */
export function DecodeDemo() {
  const [ts, setTs] = useState(() => getEffectiveTime());
  const [step, setStep] = useState(0);
  const [qr, setQr] = useState<string | null>(null);

  const { hex, letters } = encodeSteps(ts);

  useEffect(() => {
    let s = 0;
    const id = setInterval(() => {
      s += 1;
      if (s > letters.length) {
        clearInterval(id);
        qrDataUrl(FRIEND, ts).then(setQr);
        return;
      }
      setStep(s);
    }, 340);
    // Once the QR has shown for a beat, reset and restart with a fresh timestamp.
    const restart = setTimeout(() => {
      setStep(0);
      setQr(null);
      setTs(getEffectiveTime());
    }, letters.length * 340 + 3200);
    return () => {
      clearInterval(id);
      clearTimeout(restart);
    };
  }, [ts, letters.length]);

  const activeHexIdx = step > 0 && step <= hex.length ? step - 1 : -1;
  const activeWheel = activeHexIdx >= 0 ? parseInt(hex[activeHexIdx], 16) : -1;
  const built = letters.slice(0, step);
  const done = step >= letters.length;

  return (
    <div className="rounded-2xl border border-accent/15 bg-[#070c14] text-white overflow-hidden shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <span className="font-display text-[10px] font-black tracking-widest uppercase text-white/70">
          Decoder // Live
        </span>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="p-5 space-y-4 font-mono text-xs">
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <div className="text-[8px] uppercase tracking-wider text-white/40 mb-1">Friend code</div>
            <div className="text-primary text-sm tracking-wider">{FRIEND}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <div className="text-[8px] uppercase tracking-wider text-white/40 mb-1">Timestamp · epoch ms</div>
            <div className="text-accent text-sm tabular-nums truncate">{ts}</div>
          </div>
        </div>

        {/* Hex */}
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <div className="text-[8px] uppercase tracking-wider text-white/40 mb-1.5">Hex</div>
          <div className="flex flex-wrap gap-1">
            <span className="text-white/30">0x</span>
            {hex.split('').map((c, i) => (
              <span
                key={i}
                className={`px-1 rounded transition-colors duration-150 ${
                  i === activeHexIdx
                    ? 'bg-primary text-primary-fg'
                    : i < step
                      ? 'text-white/80'
                      : 'text-white/25'
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Wheel */}
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <div className="text-[8px] uppercase tracking-wider text-white/40 mb-1.5">Substitution wheel</div>
          <div className="flex flex-wrap gap-1">
            {DECODE_WHEEL.map((letter, i) => (
              <span
                key={letter}
                className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold transition-all duration-150 ${
                  i === activeWheel
                    ? 'bg-accent text-accent-fg scale-110 shadow-[0_0_10px_var(--color-accent)]'
                    : 'bg-white/[0.04] text-white/35'
                }`}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Output + QR */}
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[8px] uppercase tracking-wider text-white/40 mb-1.5">Search code</div>
            <div className="text-sm tracking-wider break-all">
              <span className="text-primary">{FRIEND}</span>
              <span className="text-signal">{built}</span>
              {!done && <span className="inline-block w-1.5 h-4 -mb-0.5 bg-accent animate-pulse" />}
            </div>
          </div>
          <div
            className={`relative w-16 h-16 rounded-lg bg-white p-1.5 shrink-0 transition-all duration-500 ${
              qr ? 'opacity-100 scale-100 shadow-[0_0_24px_rgba(16,185,129,0.4)]' : 'opacity-30 scale-90'
            }`}
          >
            {qr ? (
              <img src={qr} alt="" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full rounded bg-[#0b1120]/10" />
            )}
            {done && (
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-signal border-2 border-[#070c14]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
