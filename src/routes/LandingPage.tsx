import { NavLink } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useTranslation } from '../lib/i18n/I18nContext';
import { RadarConsole } from '../components/dashboard/RadarConsole';
import { useAuth } from '../lib/auth/useAuth';
import { useAccounts } from '../lib/db/hooks';
import { 
  SeedDecodingVisual, 
  ZeroCredentialsVisual, 
  MultiAccountVisual, 
  DiscordWebhookVisual 
} from '../components/dashboard/FeatureVisuals';

export default function LandingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { accounts } = useAccounts(user?.uid ?? null);
  
  // Real project stats
  const activeSeed = new Date().toISOString().split('T')[0];
  const storageMode = user ? 'Firebase Cloud Sync' : 'Browser Local Storage';
  const profileCount = accounts.length;

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
        {/* Left Column: Headline and actions */}
        <div className="space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="space-y-4 flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[9px] font-bold text-accent uppercase tracking-widest">
                Storage: {storageMode}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-text leading-tight uppercase">
              Scanron DBL Radar
              <span className="block text-primary text-xl sm:text-2xl mt-2 tracking-wide font-bold">
                Dragon Ball Legends QR Generator
              </span>
            </h1>
            <p className="text-xs text-muted leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t('landing.desc')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 w-full">
            <NavLink to="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/95 text-primary-fg font-display uppercase font-black tracking-wider text-xs px-8 py-6 rounded-xl shadow-[0_0_15px_rgba(255,122,0,0.2)] hover:shadow-[0_0_22px_rgba(255,122,0,0.35)] transition-all duration-300">
                {t('landing.launch')}
              </Button>
            </NavLink>
            <NavLink to="/login">
              <Button size="lg" variant="outline" className="border-accent/40 text-accent hover:bg-accent/5 font-display uppercase font-black tracking-wider text-xs px-8 py-6 rounded-xl transition-all duration-300">
                {t('landing.sync')}
              </Button>
            </NavLink>
          </div>

          {/* Technical Terminal Footer Panel (Dynamic Runtime Specs) */}
          <div className="p-4 rounded-xl border border-border bg-surface-2/40 w-full max-w-lg flex flex-wrap gap-y-2 items-center justify-center lg:justify-between gap-x-4 sm:gap-x-0 text-[10px] font-mono text-muted uppercase tracking-wider mx-auto lg:mx-0">
            <span>SEED: {activeSeed}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border/60 hidden sm:inline" />
            <span>Profiles: {profileCount} Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border/60 hidden sm:inline" />
            <span>Calculations: Local JS</span>
          </div>
        </div>

        {/* Right Column: Interactive CSS Radar Console */}
        <div className="relative w-full max-w-[420px] mx-auto lg:max-w-none">
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {/* Card 1: Direct Seed Decoding */}
          <div className="p-5 rounded-2xl bg-surface/60 backdrop-blur-sm border border-border space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-2">
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text">
                {t('landing.feat1.title')}
              </h3>
              <p className="text-[11px] text-muted leading-relaxed">
                {t('landing.feat1.desc')}
              </p>
            </div>
            <SeedDecodingVisual />
          </div>

          {/* Card 2: Zero Credentials */}
          <div className="p-5 rounded-2xl bg-surface/60 backdrop-blur-sm border border-border space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-2">
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text">
                {t('landing.feat2.title')}
              </h3>
              <p className="text-[11px] text-muted leading-relaxed">
                {t('landing.feat2.desc')}
              </p>
            </div>
            <ZeroCredentialsVisual />
          </div>

          {/* Card 3: Multi-Account Vault */}
          <div className="p-5 rounded-2xl bg-surface/60 backdrop-blur-sm border border-border space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-2">
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text">
                {t('landing.feat3.title')}
              </h3>
              <p className="text-[11px] text-muted leading-relaxed">
                {t('landing.feat3.desc')}
              </p>
            </div>
            <MultiAccountVisual />
          </div>

          {/* Card 4: Discord Webhooks */}
          <div className="p-5 rounded-2xl bg-surface/60 backdrop-blur-sm border border-border space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-2">
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text">
                {t('landing.feat4.title')}
              </h3>
              <p className="text-[11px] text-muted leading-relaxed">
                {t('landing.feat4.desc')}
              </p>
            </div>
            <DiscordWebhookVisual />
          </div>
        </div>
      </div>
    </div>
  );
}
