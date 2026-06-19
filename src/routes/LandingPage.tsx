import { NavLink } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useTranslation } from '../lib/i18n/I18nContext';
import { RadarConsole } from '../components/dashboard/RadarConsole';
import { SystemModules } from '../components/dashboard/SystemModules';
import { Shield, Sparkles, Cpu, Radio } from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
        {/* Left Column: Headline and actions */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[9px] font-bold text-accent uppercase tracking-widest">
                System Active // Scanron_v4.2
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-text leading-tight uppercase">
              {t('landing.title')}
              <span className="block text-primary text-2xl sm:text-3xl mt-2 tracking-wide font-bold">
                {t('landing.tagline')}
              </span>
            </h1>
            <p className="text-xs text-muted leading-relaxed max-w-lg">
              {t('landing.desc')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <NavLink to="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/95 text-primary-fg font-display uppercase font-black tracking-wider text-xs px-8 py-6 rounded-xl shadow-[0_0_15px_rgba(255,122,0,0.25)] hover:shadow-[0_0_22px_rgba(255,122,0,0.4)] transition-all duration-300">
                {t('landing.launch')}
              </Button>
            </NavLink>
            <NavLink to="/login">
              <Button size="lg" variant="outline" className="border-accent/40 text-accent hover:bg-accent/5 font-display uppercase font-black tracking-wider text-xs px-8 py-6 rounded-xl transition-all duration-300">
                {t('landing.sync')}
              </Button>
            </NavLink>
          </div>

          {/* Technical Terminal Footer Panel */}
          <div className="p-4 rounded-xl border border-border bg-surface-2/40 max-w-lg flex items-center justify-between text-[10px] font-mono text-muted uppercase tracking-wider">
            <span>Server: local_node</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <span>Encryption: AES_256</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <span>Latency: 14ms</span>
          </div>
        </div>

        {/* Right Column: Interactive CSS Radar Console */}
        <div className="relative">
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-accent/20 to-primary/20 opacity-30 blur-xl animate-pulse" />
          <RadarConsole />
        </div>
      </div>

      {/* Features Grid Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-xl font-display font-black tracking-widest text-text uppercase">
            {t('landing.features.title')}
          </h2>
          <div className="w-12 h-1 bg-primary mx-auto mt-2 rounded" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-5 rounded-2xl bg-surface/60 backdrop-blur-sm glow-card border border-border space-y-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Cpu size={18} />
            </div>
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text">
              {t('landing.feat1.title')}
            </h3>
            <p className="text-[11px] text-muted leading-relaxed">
              {t('landing.feat1.desc')}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface/60 backdrop-blur-sm glow-card-accent border border-border space-y-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Shield size={18} />
            </div>
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text">
              {t('landing.feat2.title')}
            </h3>
            <p className="text-[11px] text-muted leading-relaxed">
              {t('landing.feat2.desc')}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface/60 backdrop-blur-sm glow-card border border-border space-y-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles size={18} />
            </div>
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text">
              {t('landing.feat3.title')}
            </h3>
            <p className="text-[11px] text-muted leading-relaxed">
              {t('landing.feat3.desc')}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface/60 backdrop-blur-sm glow-card-accent border border-border space-y-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Radio size={18} />
            </div>
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text">
              {t('landing.feat4.title')}
            </h3>
            <p className="text-[11px] text-muted leading-relaxed">
              {t('landing.feat4.desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Modules Status List */}
      <div className="max-w-xl mx-auto">
        <SystemModules />
      </div>
    </div>
  );
}
