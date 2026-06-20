import { Check, X, Database } from 'lucide-react';

const CHECKS = ['QR computed in your browser', 'No account, no login required', 'Codes stay in local storage'];

/** On-device demo: data never leaves the browser — a packet bounces off the wall. */
export function LocalDemo() {
  return (
    <div className="rounded-2xl border border-accent/15 bg-[#070c14] text-white overflow-hidden shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <span className="font-display text-[10px] font-black tracking-widest uppercase text-white/70">Runtime // On-device</span>
        <span className="font-mono text-[9px] text-signal uppercase tracking-wider">offline-safe</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Browser ──✕── server */}
        <div className="flex items-stretch gap-3">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-400/70" />
              <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
              <span className="w-2 h-2 rounded-full bg-green-400/70" />
              <span className="font-mono text-[8px] text-white/40 ml-2">scanron · local</span>
            </div>
            <div className="p-3 flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                <Database size={18} />
              </div>
              <div className="leading-tight">
                <div className="font-mono text-[10px] text-white/90 font-bold">local storage</div>
                <div className="font-mono text-[8px] text-white/45 uppercase tracking-wider">friend codes</div>
              </div>
            </div>
          </div>

          {/* Blocked link */}
          <div className="relative w-20 shrink-0 flex items-center">
            <div className="w-full border-t border-dashed border-white/20" />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] animate-[packet_2.4s_ease-in_infinite]" />
            <span className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 flex items-center justify-center">
              <X size={11} strokeWidth={3} />
            </span>
          </div>

          <div className="w-16 shrink-0 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-1 opacity-50">
            <div className="w-6 h-8 rounded border border-white/20 flex flex-col items-center justify-center gap-0.5">
              <span className="w-3 h-0.5 bg-white/30" />
              <span className="w-3 h-0.5 bg-white/30" />
            </div>
            <span className="font-mono text-[7px] text-white/40 uppercase">servers</span>
          </div>
        </div>

        {/* Checklist */}
        <ul className="space-y-2">
          {CHECKS.map((c, i) => (
            <li
              key={c}
              className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${i * 180}ms`, animationFillMode: 'backwards', animationDuration: '500ms' }}
            >
              <span className="w-4 h-4 rounded-full bg-signal/15 text-signal flex items-center justify-center shrink-0">
                <Check size={11} strokeWidth={3} />
              </span>
              <span className="font-mono text-[11px] text-white/75">{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
