

// Animation 1: Cryptographic seed merge visualizer (larger nodes, clear flow paths, and dynamic QR scanner)
export function SeedDecodingVisual() {
  return (
    <div className="w-full h-48 bg-[#090f19] rounded-xl relative overflow-hidden flex items-center justify-between px-6 border border-border/40 shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Inputs (Left side) */}
      <div className="flex flex-col gap-4 z-10 shrink-0">
        {/* Code Slot */}
        <div className="flex items-center gap-2 bg-[#0d1527] border border-primary/30 rounded-xl p-2 animate-[pulse_2s_infinite]">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-mono text-[10px] font-black text-primary">
            CODE
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[8px] font-black text-text uppercase">Friend ID</span>
            <span className="font-mono text-[7px] text-muted">e.g. dr85d9jy</span>
          </div>
        </div>

        {/* Seed Slot */}
        <div className="flex items-center gap-2 bg-[#0d1527] border border-accent/30 rounded-xl p-2 animate-[pulse_2.5s_infinite]">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center font-mono text-[10px] font-black text-accent">
            SEED
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[8px] font-black text-text uppercase">UTC Seed</span>
            <span className="font-mono text-[7px] text-muted">Daily Rotator</span>
          </div>
        </div>
      </div>

      {/* Center Merge Processor */}
      <div className="relative flex flex-col items-center z-10">
        <div className="w-12 h-12 rounded-full bg-surface-2 border-2 border-border flex items-center justify-center shadow-lg animate-[spin_10s_linear_infinite]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" className="animate-pulse">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <span className="font-mono text-[8px] font-bold text-accent mt-2 tracking-widest uppercase">Decryption</span>
      </div>

      {/* Output QR Key (Right side) */}
      <div className="z-10 shrink-0 flex flex-col items-center">
        <div className="w-20 h-20 bg-white border-2 border-primary/20 rounded-xl flex items-center justify-center p-2.5 shadow-md relative overflow-hidden animate-bounce" style={{ animationDuration: '3.5s' }}>
          {/* Mock QR */}
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="square">
            <rect x="1" y="1" width="6" height="6" strokeWidth="2.2" />
            <rect x="17" y="1" width="6" height="6" strokeWidth="2.2" />
            <rect x="1" y="17" width="6" height="6" strokeWidth="2.2" />
            <rect x="9" y="9" width="6" height="6" strokeWidth="2.2" />
            <path d="M17 17h2v2h-2zm4 4h2v-2h-2zm-2 0h2v-2h-2zm4-4h-2v2h2zM9 17h2v2H9zm8-8h2v2h-2z" />
          </svg>
          {/* Vertical Scanner sweep laser line */}
          <div className="absolute left-0 w-full h-[2px] bg-accent shadow-[0_0_8px_var(--color-accent)] animate-[scan_3s_linear_infinite] pointer-events-none" />
        </div>
        <span className="font-mono text-[8px] font-bold text-text mt-2 uppercase tracking-wide">Valid Scan Key</span>
      </div>

      {/* Path wires (drawn in absolute background) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" strokeWidth="1.5">
        {/* Wire 1 */}
        <path d="M 120 60 Q 150 60 175 80" stroke="var(--color-primary)" strokeDasharray="5 3" className="animate-[dash_6s_linear_infinite]" />
        {/* Wire 2 */}
        <path d="M 120 135 Q 150 135 175 110" stroke="var(--color-accent)" strokeDasharray="5 3" className="animate-[dash_6s_linear_infinite]" />
        {/* Wire Out */}
        <path d="M 220 96 H 290" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="5 3" className="animate-[dash_4s_linear_infinite]" />
      </svg>
    </div>
  );
}

// Animation 2: Zero credentials local storage secure browser mockup
export function ZeroCredentialsVisual() {
  return (
    <div className="w-full h-48 bg-[#090f19] rounded-xl relative overflow-hidden flex items-center justify-center gap-8 border border-border/40 shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),gradient-to-r(rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Mock Browser Terminal */}
      <div className="w-[210px] h-[120px] rounded-xl border border-border bg-surface/95 shadow-lg relative p-2.5 flex flex-col gap-2 z-10 transform -rotate-1">
        <div className="flex gap-1.5 border-b border-border pb-1.5 items-center">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="font-mono text-[7px] text-muted ml-3 uppercase tracking-wider">localhost // Scanron radar</span>
        </div>
        
        {/* Secure Local Cylinder */}
        <div className="flex items-center gap-4 pl-3 pt-2">
          <div className="w-9 h-12 rounded-lg bg-accent/10 border-2 border-accent/40 flex flex-col items-center justify-center relative shadow-[inset_0_0_12px_rgba(14,165,233,0.2)]">
            <ellipse cx="16" cy="3.5" rx="14" ry="2.5" fill="var(--color-accent)" opacity="0.3" />
            <div className="w-7 h-[1.5px] bg-accent/40 my-0.5" />
            <div className="w-7 h-[1.5px] bg-accent/40 my-0.5" />
            <span className="font-mono text-[7px] text-accent font-black tracking-widest">DB</span>
          </div>

          <div className="flex flex-col gap-0.5 text-left">
            <span className="font-mono text-[9px] text-text font-black uppercase">Local Storage</span>
            <span className="font-mono text-[7px] text-muted uppercase">Sandboxed Client</span>
            <span className="font-mono text-[6px] text-green-500 font-bold uppercase">✓ 100% Cryptographic Offline</span>
          </div>
        </div>
      </div>

      {/* Safe Shield overlay */}
      <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/40 flex flex-col items-center justify-center shadow-lg animate-pulse z-10">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="font-mono text-[6px] font-bold text-primary mt-1 uppercase">Secure</span>
      </div>
    </div>
  );
}

// Animation 3: Stacked profile card switching loop
export function MultiAccountVisual() {
  return (
    <div className="w-full h-48 bg-[#090f19] rounded-xl relative overflow-hidden flex items-center justify-center border border-border/40 shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      <div className="relative w-52 h-36 flex items-center justify-center">
        {/* Profile Card 3 */}
        <div 
          className="absolute w-36 h-16 rounded-xl border-2 border-border bg-surface-2/80 shadow p-3 flex items-center gap-3 z-0 animate-[cycle3_6s_infinite]"
        >
          <div className="w-7 h-7 rounded-full bg-accent/25 flex items-center justify-center text-[10px] font-black text-accent uppercase">
            G
          </div>
          <div className="flex flex-col text-left">
            <span className="font-mono text-[8px] text-text font-black">Gohan_DB</span>
            <span className="font-mono text-[6px] text-muted uppercase">2 Friend Codes</span>
          </div>
        </div>

        {/* Profile Card 2 */}
        <div 
          className="absolute w-36 h-16 rounded-xl border-2 border-border bg-surface-2/95 shadow p-3 flex items-center gap-3 z-10 animate-[cycle2_6s_infinite]"
        >
          <div className="w-7 h-7 rounded-full bg-primary/25 flex items-center justify-center text-[10px] font-black text-primary uppercase">
            V
          </div>
          <div className="flex flex-col text-left">
            <span className="font-mono text-[8px] text-text font-black">Vegeta_PR</span>
            <span className="font-mono text-[6px] text-muted uppercase">3 Friend Codes</span>
          </div>
        </div>

        {/* Profile Card 1 */}
        <div 
          className="absolute w-36 h-16 rounded-xl border-2 border-border bg-surface shadow-lg p-3 flex items-center gap-3 z-20 animate-[cycle1_6s_infinite]"
        >
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-black text-accent uppercase">
            G
          </div>
          <div className="flex flex-col text-left">
            <span className="font-mono text-[8px] text-text font-black">Goku_Main</span>
            <span className="font-mono text-[6px] text-muted uppercase">5 Friend Codes</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cycle1 {
          0%, 30% { transform: translate(0px, 0px) scale(1.05); z-index: 25; box-shadow: 0 8px 16px rgba(0,0,0,0.15); opacity: 1; }
          33%, 63% { transform: translate(22px, 12px) scale(0.95); z-index: 15; opacity: 0.85; }
          66%, 96% { transform: translate(-22px, -12px) scale(0.9); z-index: 5; opacity: 0.6; }
          100% { transform: translate(0px, 0px) scale(1.05); z-index: 25; opacity: 1; }
        }
        @keyframes cycle2 {
          0%, 30% { transform: translate(-22px, -12px) scale(0.9); z-index: 5; opacity: 0.6; }
          33%, 63% { transform: translate(0px, 0px) scale(1.05); z-index: 25; box-shadow: 0 8px 16px rgba(0,0,0,0.15); opacity: 1; }
          66%, 96% { transform: translate(22px, 12px) scale(0.95); z-index: 15; opacity: 0.85; }
          100% { transform: translate(-22px, -12px) scale(0.9); z-index: 5; opacity: 0.6; }
        }
        @keyframes cycle3 {
          0%, 30% { transform: translate(22px, 12px) scale(0.95); z-index: 15; opacity: 0.85; }
          33%, 63% { transform: translate(-22px, -12px) scale(0.9); z-index: 5; opacity: 0.6; }
          66%, 96% { transform: translate(0px, 0px) scale(1.05); z-index: 25; box-shadow: 0 8px 16px rgba(0,0,0,0.15); opacity: 1; }
          100% { transform: translate(22px, 12px) scale(0.95); z-index: 15; opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

// Animation 4: Discord webhook pipeline with large data packets and detailed chat card
export function DiscordWebhookVisual() {
  return (
    <div className="w-full h-48 bg-[#090f19] rounded-xl relative overflow-hidden flex items-center justify-between px-6 border border-border/40 shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Webhook server tower */}
      <div className="flex flex-col items-center z-10 shrink-0">
        <div className="w-9 h-14 rounded-xl bg-surface border-2 border-border flex flex-col items-center justify-center p-2 shadow-md">
          <div className="w-6 h-2 bg-accent/30 rounded-sm mb-1" />
          <div className="w-6 h-2 bg-accent/30 rounded-sm mb-1" />
          <div className="flex gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          </div>
        </div>
        <span className="font-mono text-[8px] text-muted mt-1 uppercase font-bold">Server Web</span>
      </div>

      {/* Discord Mock Window */}
      <div className="w-[170px] h-[110px] rounded-xl bg-[#313338] border-2 border-[#202225] shadow-lg p-2.5 flex flex-col gap-1.5 text-left z-10">
        <div className="flex gap-1 border-b border-[#202225] pb-1.5 items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-[#5865F2] flex items-center justify-center text-[7px] font-bold text-white">#</div>
          <span className="font-sans font-bold text-[8px] text-[#dbdee1]">anniversary-codes</span>
        </div>
        
        {/* Chat message */}
        <div className="flex gap-2 pt-0.5">
          <div className="w-5 h-5 rounded-full bg-[#5865F2] shrink-0 flex items-center justify-center text-[7px] font-bold text-white">BOT</div>
          <div className="flex flex-col gap-1 overflow-hidden">
            <div className="flex items-center gap-1">
              <span className="font-sans font-black text-[8px] text-white">Scanron BOT</span>
              <span className="bg-[#5865F2] text-white text-[5px] px-1 rounded-sm font-bold">APP</span>
            </div>
            <div className="bg-[#2b2d31] border border-[#1e1f22] p-1.5 rounded text-[7px] text-[#dbdee1] font-mono leading-relaxed max-w-[110px] shadow-inner">
              <span className="text-primary font-bold">QR SEED SUCCESS:</span><br />
              Code decoded for friend Goku.
            </div>
          </div>
        </div>
      </div>

      {/* Path wires (drawn in absolute background) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" strokeWidth="1.5">
        <path d="M 70 96 H 200" stroke="var(--color-border)" />
        <circle cx="10" cy="96" r="4.5" fill="var(--color-accent)" className="animate-[pulseLine_4s_infinite]" />
      </svg>

      <style>{`
        @keyframes pulseLine {
          0% { cx: 70; opacity: 1; }
          75% { cx: 200; opacity: 1; }
          85%, 100% { cx: 200; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
