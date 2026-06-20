import type { ReactNode } from 'react';

/** Shared dark "instrument display" frame so all four visuals feel like one set. */
function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-52 rounded-xl bg-[#070c14] border border-white/[0.06] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.045)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,122,0,0.07),transparent_70%)]" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

/** Small blocky QR glyph — reads as a QR without rendering a real one. */
function MiniQR({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#0b1120">
      <path d="M2 2h6v6H2zM4 4v2h2V4zM16 2h6v6h-6zM18 4v2h2V4zM2 16h6v6H2zM4 18v2h2v-2z" />
      <rect x="10" y="2" width="2" height="2" /><rect x="12" y="4" width="2" height="2" />
      <rect x="10" y="6" width="2" height="2" /><rect x="14" y="10" width="2" height="2" />
      <rect x="10" y="10" width="2" height="2" /><rect x="12" y="12" width="2" height="2" />
      <rect x="16" y="12" width="2" height="2" /><rect x="20" y="10" width="2" height="2" />
      <rect x="10" y="16" width="2" height="2" /><rect x="12" y="18" width="2" height="2" />
      <rect x="14" y="16" width="2" height="2" /><rect x="16" y="18" width="2" height="2" />
      <rect x="18" y="16" width="2" height="2" /><rect x="20" y="18" width="2" height="2" />
      <rect x="10" y="20" width="2" height="2" /><rect x="20" y="20" width="2" height="2" />
      <rect x="16" y="20" width="2" height="2" />
    </svg>
  );
}

function Chip({ tone, label, sub }: { tone: 'primary' | 'accent'; label: string; sub: string }) {
  const color = tone === 'primary' ? 'var(--color-primary)' : 'var(--color-accent)';
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 w-[150px]">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      <div className="flex flex-col leading-none gap-1">
        <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-white/50">{label}</span>
        <span className="font-mono text-[10px] text-white/90">{sub}</span>
      </div>
    </div>
  );
}

// 1 — Direct seed decoding: two inputs merge into a live QR key.
export function SeedDecodingVisual() {
  return (
    <Screen>
      <div className="h-full flex items-center justify-between px-5">
        <div className="z-10 flex flex-col gap-3">
          <Chip tone="primary" label="Friend code" sub="dr85d9jy" />
          <Chip tone="accent" label="Time seed" sub="UTC · live" />
        </div>

        <div className="z-10 w-11 h-11 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" className="animate-[spin_8s_linear_infinite]">
            <path d="M12 2v4M12 18v4M4.9 4.9l2.9 2.9M16.2 16.2l2.9 2.9M2 12h4M18 12h4M4.9 19.1l2.9-2.9M16.2 7.8l2.9-2.9" />
          </svg>
        </div>

        <div className="relative z-10 w-[88px] h-[88px] rounded-xl bg-white p-2.5 shrink-0 shadow-[0_0_28px_rgba(16,185,129,0.3)]">
          <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl-sm" />
          <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-primary rounded-tr-sm" />
          <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-primary rounded-bl-sm" />
          <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br-sm" />
          <MiniQR className="w-full h-full" />
          <span className="absolute left-1 right-1 h-[2px] bg-accent/70 shadow-[0_0_6px_var(--color-accent)] animate-[scan_2.6s_linear_infinite]" />
          <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-signal border-2 border-[#070c14]" />
        </div>
      </div>

      {/* flow line with travelling packet */}
      <div className="absolute left-[150px] right-[104px] top-1/2 h-px bg-gradient-to-r from-primary/30 via-accent/40 to-signal/40">
        <span className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] animate-[packet_2.8s_linear_infinite]" />
      </div>
    </Screen>
  );
}

// 2 — Zero game credentials: everything runs locally, no login.
export function ZeroCredentialsVisual() {
  return (
    <Screen>
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="relative w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center animate-[floaty_5s_ease-in-out_infinite]">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-signal)" strokeWidth="3" className="absolute" style={{ marginTop: 2 }}>
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span className="absolute -inset-1 rounded-2xl border border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
        </div>
        <div className="flex gap-2">
          {['No login', 'No password', '100% local'].map((label) => (
            <span key={label} className="font-mono text-[8px] font-bold uppercase tracking-wider text-white/55 border border-white/10 bg-white/[0.03] rounded-full px-2.5 py-1">
              {label}
            </span>
          ))}
        </div>
      </div>
    </Screen>
  );
}

// 3 — Multi-account vault: fan of profiles you switch between.
export function MultiAccountVisual() {
  const cards = [
    { initial: 'G', name: 'Goku_Main', codes: '5 codes', tone: 'primary', cls: 'animate-[floaty_5s_ease-in-out_infinite]', style: { transform: 'translate(-52px, 14px) rotate(-9deg)' } as const },
    { initial: 'V', name: 'Vegeta_PR', codes: '3 codes', tone: 'accent', cls: 'animate-[floaty_5s_ease-in-out_infinite_0.5s]', style: { transform: 'translate(52px, 14px) rotate(9deg)' } as const },
    { initial: 'G', name: 'Gohan_DB', codes: '2 codes', tone: 'signal', cls: 'animate-[floaty_5.5s_ease-in-out_infinite_0.25s] z-10', style: { transform: 'translateY(-14px)' } as const },
  ];
  const toneColor: Record<string, string> = {
    primary: 'var(--color-primary)',
    accent: 'var(--color-accent)',
    signal: 'var(--color-signal)',
  };
  return (
    <Screen>
      <div className="h-full flex items-center justify-center">
        <div className="relative w-52 h-28">
          {cards.map((c) => (
            <div
              key={c.name}
              className={`absolute inset-x-0 top-4 mx-auto w-40 rounded-xl border border-white/10 bg-[#0d1424] shadow-xl p-3 flex items-center gap-3 ${c.cls}`}
              style={c.style}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-black shrink-0"
                style={{ background: `color-mix(in srgb, ${toneColor[c.tone]} 22%, transparent)`, color: toneColor[c.tone] }}
              >
                {c.initial}
              </span>
              <div className="flex flex-col leading-none gap-1">
                <span className="font-mono text-[10px] text-white/90 font-bold">{c.name}</span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-white/45">{c.codes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

// 4 — Discord webhooks: codes broadcast to your server.
export function DiscordWebhookVisual() {
  return (
    <Screen>
      <div className="h-full flex items-center justify-between px-5 gap-4">
        {/* source */}
        <div className="z-10 flex flex-col items-center gap-1.5 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" stroke="var(--color-primary)" strokeWidth="3" />
              <circle cx="24" cy="24" r="4" fill="var(--color-primary)" />
            </svg>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-wider text-white/45">Scanron</span>
        </div>

        {/* pipe */}
        <div className="relative flex-1 h-px bg-gradient-to-r from-primary/40 to-[#5865F2]/60">
          <span className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] animate-[packet_2.6s_linear_infinite]" />
        </div>

        {/* discord message */}
        <div className="z-10 w-[168px] rounded-xl bg-[#313338] border border-black/30 shadow-xl p-2.5 flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#5865F2] flex items-center justify-center text-[8px] font-bold text-white">#</span>
            <span className="font-sans font-bold text-[9px] text-[#dbdee1]">anniversary-codes</span>
          </div>
          <div className="flex gap-2">
            <span className="w-6 h-6 rounded-full bg-[#5865F2] shrink-0 flex items-center justify-center text-[7px] font-black text-white">B</span>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-sans font-black text-[8px] text-white">Scanron</span>
                <span className="bg-[#5865F2] text-white text-[5px] px-1 rounded-sm font-bold">APP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded bg-white p-0.5 shrink-0"><MiniQR className="w-full h-full" /></span>
                <span className="font-mono text-[7px] text-[#b5bac1] leading-tight">Daily code posted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
