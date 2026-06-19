export function RadarConsole() {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur-md flex flex-col h-[520px] relative overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Console Header */}
      <div className="bg-surface-2/60 border-b border-border px-5 py-3 flex justify-between items-center">
        <span className="font-display text-[10px] font-black tracking-widest text-text uppercase">
          Radar Console // Primary Display
        </span>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
          <span className="w-2.5 h-2.5 bg-accent rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <span className="w-2.5 h-2.5 bg-border rounded-full" />
        </div>
      </div>

      {/* Viewport Screen */}
      <div className="flex-grow bg-[#090f19] relative overflow-hidden flex items-center justify-center p-6">
        {/* Background Coordinate Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.06)_1px,transparent_1px)] bg-[size:30px_30px]" />

        {/* Circular Radar HUD */}
        <div className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] rounded-full border-4 border-accent/20 flex items-center justify-center bg-[#070c14] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
          
          {/* Concentric target rings */}
          <div className="absolute w-[80%] h-[80%] rounded-full border border-accent/15" />
          <div className="absolute w-[55%] h-[55%] rounded-full border border-accent/20" />
          <div className="absolute w-[30%] h-[30%] rounded-full border border-accent/30" />
          
          {/* Crosshairs axis lines */}
          <div className="absolute w-full h-[1px] bg-accent/15" />
          <div className="absolute h-full w-[1px] bg-accent/15" />

          {/* Sweeping scan radar beam */}
          <div 
            className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left bg-gradient-to-br from-primary/30 to-transparent animate-[spin_6s_linear_infinite] pointer-events-none" 
            style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
          />

          {/* Blips / Dragon Ball markers */}
          <div className="absolute top-[22%] left-[28%] w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_12px_#ff7a00] animate-pulse" />
          <div className="absolute top-[68%] left-[72%] w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_12px_#ff7a00] animate-pulse" style={{ animationDelay: '0.4s' }} />
          <div className="absolute top-[42%] left-[48%] w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_12px_#ff7a00] animate-pulse" style={{ animationDelay: '0.9s' }} />
          <div className="absolute top-[82%] left-[36%] w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_12px_#ff7a00] animate-pulse" style={{ animationDelay: '0.2s' }} />

          {/* Core Center Dot */}
          <div className="absolute w-4 h-4 rounded-full bg-accent border-2 border-white shadow-[0_0_12px_var(--color-accent)] animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-accent border border-white shadow-[0_0_8px_var(--color-accent)]" />
        </div>

        {/* HUD Data overlays */}
        <div className="absolute top-4 left-4 font-mono text-[9px] text-accent/80 leading-relaxed uppercase tracking-wider">
          [SCAN_ACTIVE]<br />
          SECTOR: CAPSULE_01<br />
          GRID: DBL-7S
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[9px] text-accent/80 text-right leading-relaxed uppercase tracking-wider">
          RANGE: 8000m<br />
          FREQ: 2.45 GHz<br />
          FILTER: SHENRON_SIG
        </div>

        {/* CSS Scanning laser line */}
        <div className="absolute left-0 w-full h-[2px] bg-accent/40 shadow-[0_0_8px_var(--color-accent)] pointer-events-none animate-[scan_5s_linear_infinite]" />
      </div>

      {/* Console Footer */}
      <div className="bg-surface-2/30 border-t border-border px-5 py-3 flex gap-3">
        <div className="h-2 w-full bg-border rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-[70%] bg-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
}
