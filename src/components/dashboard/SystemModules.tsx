export function SystemModules() {
  const modules = [
    {
      id: 'MOD_SEED_DECODER',
      name: 'MOD_SEED_DECODER',
      status: 'ONLINE',
      desc: 'Static search codes & daily seed generation.',
      isAccent: true,
    },
    {
      id: 'MOD_LOCAL_AUTH',
      name: 'MOD_LOCAL_AUTH',
      status: 'ACTIVE',
      desc: 'Zero credentials. Safe browser-local processing.',
      isAccent: true,
    },
    {
      id: 'MOD_VAULT_ARRAY',
      name: 'MOD_VAULT_ARRAY',
      status: 'MOUNTED',
      desc: 'Multi-account profile structures.',
      isAccent: true,
    },
    {
      id: 'MOD_DISCORD_HOOK',
      name: 'MOD_DISCORD_HOOK',
      status: 'STANDBY',
      desc: 'Automated QR code webhook broadcasting.',
      isAccent: false,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur-md overflow-hidden shadow-lg">
      <div className="bg-surface-2/60 border-b border-border px-5 py-3.5">
        <span className="font-display text-[10px] font-black tracking-widest text-text uppercase">
          System Modules // Status
        </span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className="flex flex-col border-b border-border/40 pb-3 last:border-0 last:pb-0">
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-xs font-bold text-text">
                &gt; {mod.name}
              </span>
              <span 
                className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  mod.isAccent 
                    ? 'bg-accent/10 border border-accent/20 text-accent' 
                    : 'bg-primary/10 border border-primary/20 text-primary'
                }`}
              >
                {mod.status}
              </span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              {mod.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
