

// Animation 1: Cryptographic search code + UTC day seed merge into QR code
export function SeedDecodingVisual() {
  return (
    <div className="w-full h-32 bg-[#090f19] rounded-xl relative overflow-hidden flex items-center justify-center border border-border/40 shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:15px_15px]" />
      
      {/* Node 1: Code */}
      <div className="absolute left-6 flex flex-col items-center animate-[pulse_2s_infinite]">
        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center font-mono text-[9px] font-bold text-primary">
          CODE
        </div>
        <span className="font-mono text-[7px] text-muted mt-1">Friend Code</span>
      </div>

      {/* Path 1 */}
      <svg className="absolute left-[52px] w-12 h-6" fill="none">
        <path d="M0,12 C15,12 25,3 40,3" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="4 3" className="animate-[dash_10s_linear_infinite]" />
      </svg>

      {/* Node 2: UTC Seed */}
      <div className="absolute left-6 bottom-3 flex flex-col items-center animate-[pulse_2.5s_infinite]">
        <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center font-mono text-[9px] font-bold text-accent">
          SEED
        </div>
        <span className="font-mono text-[7px] text-muted mt-1">UTC Day</span>
      </div>

      {/* Path 2 */}
      <svg className="absolute left-[52px] w-12 h-16" fill="none">
        <path d="M0,12 C15,12 25,48 40,48" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 3" className="animate-[dash_10s_linear_infinite]" />
      </svg>

      {/* Central Merge Processor */}
      <div className="absolute left-28 w-9 h-9 rounded-full bg-surface-2 border-2 border-border flex items-center justify-center shadow-md animate-[spin_8s_linear_infinite]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>

      {/* Path Out */}
      <svg className="absolute left-[148px] w-14 h-4" fill="none">
        <line x1="0" y1="8" x2="50" y2="8" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="5 3" className="animate-[dash_5s_linear_infinite]" />
      </svg>

      {/* Output Node: QR Code */}
      <div className="absolute right-6 flex flex-col items-center">
        <div className="w-10 h-10 bg-white border border-border rounded flex items-center justify-center p-1 shadow-md animate-bounce" style={{ animationDuration: '2.5s' }}>
          {/* Mock QR SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="square">
            <rect x="2" y="2" width="6" height="6" />
            <rect x="16" y="2" width="6" height="6" />
            <rect x="2" y="16" width="6" height="6" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M16 16h2v2h-2zm4 4h2v2h-2zm-2 0h2v-2h-2zm4-4h-2v2h2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Animation 2: Local browser storage, locked cylinder safe shield
export function ZeroCredentialsVisual() {
  return (
    <div className="w-full h-32 bg-[#090f19] rounded-xl relative overflow-hidden flex items-center justify-center border border-border/40 shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:15px_15px]" />
      
      {/* Mock Browser Frame */}
      <div className="w-[180px] h-[80px] rounded-lg border border-border bg-surface/90 shadow-md relative p-2 flex flex-col gap-1.5">
        <div className="flex gap-1 border-b border-border/60 pb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="font-mono text-[5px] text-muted ml-2">localhost:3000/radar</span>
        </div>
        
        {/* Local Storage Cylinder */}
        <div className="flex items-center gap-3 pl-2 pt-1">
          <div className="w-7 h-9 rounded bg-accent/15 border border-accent/30 flex flex-col items-center justify-center relative shadow-[inset_0_0_10px_rgba(14,165,233,0.1)]">
            {/* Top cap */}
            <ellipse cx="14" cy="3" rx="13" ry="2" fill="var(--color-accent)" opacity="0.3" />
            <div className="w-6 h-[1px] bg-accent/40 my-0.5" />
            <div className="w-6 h-[1px] bg-accent/40 my-0.5" />
            <span className="font-mono text-[6px] text-accent font-bold">LOCAL</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-mono text-[7px] text-text font-bold uppercase">Safe Storage</span>
            <span className="font-mono text-[6px] text-muted uppercase">No remote connection</span>
          </div>
        </div>
      </div>

      {/* Pulsing Lock Overlay */}
      <div className="absolute right-8 w-11 h-11 rounded-full bg-[#ff7a00]/15 border border-[#ff7a00]/30 flex items-center justify-center shadow-lg animate-pulse">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
    </div>
  );
}

// Animation 3: Multi-account toggling card stack animation
export function MultiAccountVisual() {
  return (
    <div className="w-full h-32 bg-[#090f19] rounded-xl relative overflow-hidden flex items-center justify-center border border-border/40 shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:15px_15px]" />
      
      <div className="relative w-44 h-24 flex items-center justify-center">
        {/* Account Card 3 */}
        <div 
          className="absolute w-28 h-12 rounded-lg border border-border bg-surface-2/80 shadow p-2 flex items-center gap-2 transform translate-x-2 translate-y-3 z-0 animate-[cycle3_6s_infinite]"
        >
          <div className="w-5 h-5 rounded-full bg-accent/25 flex items-center justify-center text-[8px] font-bold text-accent">G</div>
          <div className="flex flex-col">
            <span className="font-mono text-[7px] text-text font-bold">Gohan_DB</span>
            <span className="font-mono text-[5px] text-muted">2 Search Codes</span>
          </div>
        </div>

        {/* Account Card 2 */}
        <div 
          className="absolute w-28 h-12 rounded-lg border border-border bg-surface-2/95 shadow p-2 flex items-center gap-2 transform -translate-x-2 -translate-y-2 z-10 animate-[cycle2_6s_infinite]"
        >
          <div className="w-5 h-5 rounded-full bg-primary/25 flex items-center justify-center text-[8px] font-bold text-primary">V</div>
          <div className="flex flex-col">
            <span className="font-mono text-[7px] text-text font-bold">Vegeta_PR</span>
            <span className="font-mono text-[5px] text-muted">3 Search Codes</span>
          </div>
        </div>

        {/* Account Card 1 */}
        <div 
          className="absolute w-28 h-12 rounded-lg border border-border bg-surface shadow-md p-2 flex items-center gap-2 transform z-20 animate-[cycle1_6s_infinite]"
        >
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-[8px] font-bold text-accent">G</div>
          <div className="flex flex-col">
            <span className="font-mono text-[7px] text-text font-bold">Goku_Main</span>
            <span className="font-mono text-[5px] text-muted">5 Search Codes</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cycle1 {
          0%, 30% { transform: translate(0px, 0px) scale(1); z-index: 20; box-shadow: 0 4px 6px rgba(0,0,0,0.1); opacity: 1; }
          33%, 63% { transform: translate(12px, 8px) scale(0.9); z-index: 10; opacity: 0.8; }
          66%, 96% { transform: translate(-12px, -8px) scale(0.9); z-index: 0; opacity: 0.6; }
          100% { transform: translate(0px, 0px) scale(1); z-index: 20; opacity: 1; }
        }
        @keyframes cycle2 {
          0%, 30% { transform: translate(-12px, -8px) scale(0.9); z-index: 0; opacity: 0.6; }
          33%, 63% { transform: translate(0px, 0px) scale(1); z-index: 20; box-shadow: 0 4px 6px rgba(0,0,0,0.1); opacity: 1; }
          66%, 96% { transform: translate(12px, 8px) scale(0.9); z-index: 10; opacity: 0.8; }
          100% { transform: translate(-12px, -8px) scale(0.9); z-index: 0; opacity: 0.6; }
        }
        @keyframes cycle3 {
          0%, 30% { transform: translate(12px, 8px) scale(0.9); z-index: 10; opacity: 0.8; }
          33%, 63% { transform: translate(-12px, -8px) scale(0.9); z-index: 0; opacity: 0.6; }
          66%, 96% { transform: translate(0px, 0px) scale(1); z-index: 20; box-shadow: 0 4px 6px rgba(0,0,0,0.1); opacity: 1; }
          100% { transform: translate(12px, 8px) scale(0.9); z-index: 10; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

// Animation 4: Discord webhook pipeline pulse sending code to mockup chat window
export function DiscordWebhookVisual() {
  return (
    <div className="w-full h-32 bg-[#090f19] rounded-xl relative overflow-hidden flex items-center justify-center border border-border/40 shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:15px_15px]" />
      
      {/* Webhook server tower */}
      <div className="absolute left-6 flex flex-col items-center">
        <div className="w-8 h-12 rounded-lg bg-surface border border-border flex flex-col items-center justify-center p-1.5 shadow-md">
          <div className="w-5 h-1.5 bg-accent/30 rounded-sm mb-1" />
          <div className="w-5 h-1.5 bg-accent/30 rounded-sm mb-1" />
          <div className="flex gap-1 mt-0.5">
            <span className="w-1 h-1 rounded-full bg-green-400 animate-ping" />
            <span className="w-1 h-1 rounded-full bg-accent" />
          </div>
        </div>
        <span className="font-mono text-[7px] text-muted mt-1">Webhook</span>
      </div>

      {/* Dynamic pulse along a pipeline wire */}
      <svg className="absolute left-[44px] w-24 h-4" fill="none">
        <line x1="0" y1="8" x2="90" y2="8" stroke="var(--color-border)" strokeWidth="1.5" />
        <circle cx="10" cy="8" r="3.5" fill="var(--color-accent)" className="animate-[pulseLine_3s_infinite]" />
      </svg>

      {/* Discord Mock Window */}
      <div className="absolute right-6 w-32 h-[80px] rounded-lg bg-[#313338] border border-[#202225] shadow-md p-1.5 flex flex-col gap-1 text-left">
        <div className="flex gap-1 border-b border-[#202225] pb-1 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#5865F2] flex items-center justify-center text-[5px] font-bold text-white">#</div>
          <span className="font-sans font-bold text-[7px] text-[#dbdee1]">anniversary-qr</span>
        </div>
        
        {/* Chat message */}
        <div className="flex gap-1 pt-0.5">
          <div className="w-3.5 h-3.5 rounded-full bg-[#5865F2] shrink-0 flex items-center justify-center text-[5px] font-bold text-white">BOT</div>
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <span className="font-sans font-black text-[6px] text-white">Scanron Bot</span>
            <div className="bg-[#2b2d31] border border-[#1e1f22] p-0.5 rounded text-[5px] text-[#dbdee1] font-mono leading-none truncate max-w-[85px]">
              Daily QR Code Seed Generated!
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseLine {
          0% { cx: 5; opacity: 1; }
          80% { cx: 85; opacity: 1; }
          90%, 100% { cx: 85; opacity: 0; }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
    </div>
  );
}
