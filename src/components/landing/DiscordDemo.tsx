import { useEffect, useState } from 'react';
import { qrDataUrl } from '../../lib/qr/image';

type Phase = 'idle' | 'typing' | 'posted';

/** Animated webhook: the Scanron bot types, then posts a rich QR message. */
export function DiscordDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    qrDataUrl('dr85d9jy').then(setQr);
  }, []);

  useEffect(() => {
    const seq: [Phase, number][] = [
      ['idle', 700],
      ['typing', 1300],
      ['posted', 3400],
    ];
    let i = 0;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      const [p, d] = seq[i];
      setPhase(p);
      i = (i + 1) % seq.length;
      id = setTimeout(tick, d);
    };
    tick();
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="rounded-2xl border border-accent/15 bg-[#1e1f22] text-white overflow-hidden shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)]">
      {/* Channel header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/40 bg-[#2b2d31]">
        <span className="text-[#949ba4] font-bold text-sm">#</span>
        <span className="font-sans font-bold text-[13px] text-[#f2f3f5]">anniversary-codes</span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#23a55a]" />
      </div>

      <div className="p-4 min-h-[230px] flex flex-col justify-end gap-3">
        {/* Posted message */}
        {phase === 'posted' && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="w-9 h-9 rounded-full bg-[#5865F2] shrink-0 flex items-center justify-center text-[11px] font-black">S</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-[13px] text-[#f2f3f5]">Scanron</span>
                <span className="bg-[#5865F2] text-white text-[8px] px-1 rounded font-bold uppercase">App</span>
                <span className="text-[10px] text-[#949ba4]">today</span>
              </div>
              {/* Rich embed */}
              <div className="mt-1.5 rounded border-l-4 border-[#ff7a00] bg-[#2b2d31] p-3 flex gap-3 max-w-[320px]">
                <div className="bg-white rounded-md p-1.5 w-[72px] h-[72px] shrink-0">
                  {qr && <img src={qr} alt="" className="w-full h-full object-contain" />}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-sans font-bold text-[12px] text-[#f2f3f5]">Daily code · Vegeta</span>
                  <span className="font-mono text-[10px] text-[#00a8fc] truncate">dr85d9jyCMSRQREQQMM</span>
                  <span className="font-sans text-[10px] text-[#b5bac1] leading-snug">Scan in-game to claim today's Dragon Ball.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {phase === 'typing' && (
          <div className="flex items-center gap-2 text-[#949ba4] animate-in fade-in duration-200">
            <span className="w-7 h-7 rounded-full bg-[#5865F2] flex items-center justify-center text-[9px] font-black text-white">S</span>
            <div className="flex items-center gap-1 bg-[#2b2d31] rounded-full px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#949ba4] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#949ba4] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#949ba4] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[11px]">Scanron is posting…</span>
          </div>
        )}

        {/* Composer */}
        <div className="rounded-lg bg-[#383a40] px-3.5 py-2.5 flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#4e5058] flex items-center justify-center text-[#b5bac1] text-[11px] leading-none">+</span>
          <span className="font-sans text-[12px] text-[#6d6f78]">Message #anniversary-codes</span>
        </div>
      </div>
    </div>
  );
}
