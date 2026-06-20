import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

const ACCOUNTS = [
  {
    name: 'Goku_Main',
    initial: 'G',
    tone: 'var(--color-primary)',
    friends: [
      { name: 'Vegeta', code: '7q8s9t2b' },
      { name: 'Piccolo', code: 'mk44n8p2' },
      { name: 'Krillin', code: 'b3c7d9f2' },
    ],
  },
  {
    name: 'Vegeta_PR',
    initial: 'V',
    tone: 'var(--color-accent)',
    friends: [
      { name: 'Bulma', code: 'dk29s7q4' },
      { name: 'Trunks', code: 'h8m3n5p9' },
    ],
  },
  {
    name: 'Gohan_DB',
    initial: 'G',
    tone: 'var(--color-signal)',
    friends: [
      { name: 'Goten', code: 'r4t6y8u2' },
      { name: 'Videl', code: 'c5v7b9n3' },
      { name: 'Cell', code: 'q2w4e6r8' },
    ],
  },
];

/** Interactive vault: click an account (or let it auto-rotate) and the codes swap. */
export function VaultDemo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % ACCOUNTS.length), 2800);
    return () => clearInterval(id);
  }, [paused]);

  const acc = ACCOUNTS[active];

  return (
    <div
      className="rounded-2xl border border-accent/15 bg-[#070c14] text-white overflow-hidden shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <span className="font-display text-[10px] font-black tracking-widest uppercase text-white/70">Vault // Accounts</span>
        <Users size={13} className="text-white/40" />
      </div>

      {/* Account tabs */}
      <div className="flex gap-2 p-3 border-b border-white/10">
        {ACCOUNTS.map((a, i) => {
          const on = i === active;
          return (
            <button
              key={a.name}
              onClick={() => setActive(i)}
              className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-all duration-200 cursor-pointer"
              style={{
                borderColor: on ? a.tone : 'rgba(255,255,255,0.1)',
                background: on ? `color-mix(in srgb, ${a.tone} 14%, transparent)` : 'transparent',
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-display font-black"
                style={{ background: `color-mix(in srgb, ${a.tone} 22%, transparent)`, color: a.tone }}
              >
                {a.initial}
              </span>
              <span className={`font-mono text-[10px] ${on ? 'text-white' : 'text-white/45'}`}>{a.name}</span>
            </button>
          );
        })}
      </div>

      {/* Friend list for the active account */}
      <div key={active} className="p-3 space-y-2 animate-in fade-in slide-in-from-right-3 duration-300">
        {acc.friends.map((f) => (
          <div key={f.name} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
            <span className="font-mono text-[11px] text-white/85 font-bold">{f.name}</span>
            <span
              className="font-mono text-[10px] tracking-wider rounded px-2 py-0.5"
              style={{ color: acc.tone, background: `color-mix(in srgb, ${acc.tone} 10%, transparent)` }}
            >
              {f.code}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-1 px-1">
          <span className="font-mono text-[8px] uppercase tracking-wider text-white/35">{acc.friends.length} active codes</span>
          <span className="font-mono text-[8px] uppercase tracking-wider text-signal/70">synced</span>
        </div>
      </div>
    </div>
  );
}
