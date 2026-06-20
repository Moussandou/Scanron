import { useState, useEffect, type FormEvent } from 'react';
import { signInWithEmail, signInWithGoogle, registerWithEmail } from '../lib/auth/methods';
import { getDiscordAuthUrl } from '../lib/auth/discord';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { DragonBallIcon } from '../components/brand/DragonBallIcon';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from '../lib/i18n/I18nContext';
import { useAuth } from '../lib/auth/useAuth';

// Google Brand SVG Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// Discord Brand SVG Icon
const DiscordIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 127.14 96.36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.87-.64,1.72-1.32,2.53-2a75.46,75.46,0,0,0,73,0c.81.69,1.66,1.37,2.53,2a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.58-18.83C129,54.65,122.94,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
  </svg>
);

// Cloud Vault sync mockup
function SyncMockup() {
  return (
    <div className="relative w-full h-52 flex items-center justify-center bg-surface border border-border/40 rounded-2xl overflow-hidden shadow-sm">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* Central Cloud Node */}
      <div className="absolute z-10 w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_24px_rgba(255,122,0,0.18)] animate-pulse">
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
      </div>

      {/* Left Device representation (Phone) */}
      <div className="absolute left-6 bottom-4 w-22 h-32 bg-surface-2 border border-border/80 rounded-t-xl p-2 shadow-sm flex flex-col justify-between">
        <div className="w-full flex items-center justify-between border-b border-border/30 pb-1">
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="w-6 h-0.5 bg-border rounded-full" />
          <div className="w-1 h-1 rounded-full bg-border" />
        </div>
        <div className="flex-1 flex flex-col gap-1 py-1.5 justify-start text-[5px] text-text font-bold">
          <div className="w-full h-3 bg-surface rounded flex items-center justify-between px-1 border border-border/10">
            <span>Main</span>
            <span className="w-1 h-1 rounded-full bg-signal" />
          </div>
          <div className="w-full h-3 bg-surface rounded flex items-center justify-between px-1 border border-border/10">
            <span>Smurf</span>
            <span className="w-1 h-1 rounded-full bg-signal" />
          </div>
        </div>
        <div className="w-full h-2 bg-primary/10 rounded flex items-center justify-center">
          <span className="text-[4px] font-display text-primary font-bold uppercase tracking-wider">Sync Active</span>
        </div>
      </div>

      {/* Right Device representation (Desktop Monitor) */}
      <div className="absolute right-6 top-4 w-32 h-26 bg-surface-2 border border-border/80 rounded-lg p-2 shadow-sm flex flex-col justify-between text-left">
        <div className="w-full flex items-center gap-1 border-b border-border/30 pb-1">
          <div className="w-1 h-1 rounded-full bg-[#ef4444]" />
          <div className="w-1 h-1 rounded-full bg-[#eab308]" />
          <div className="w-1 h-1 rounded-full bg-[#22c55e]" />
        </div>
        <div className="flex-1 py-1.5 flex flex-col gap-1">
          <span className="text-[5px] text-muted font-bold uppercase tracking-wider">Vault Registry</span>
          <div className="grid grid-cols-2 gap-1">
            <div className="h-4 bg-surface rounded p-0.5 flex flex-col justify-between border border-border/10">
              <span className="text-[3.5px] font-bold text-muted">Accounts</span>
              <span className="text-[5px] font-display font-black text-primary leading-none">02</span>
            </div>
            <div className="h-4 bg-surface rounded p-0.5 flex flex-col justify-between border border-border/10">
              <span className="text-[3.5px] font-bold text-muted">Codes</span>
              <span className="text-[5px] font-display font-black text-accent leading-none">14</span>
            </div>
          </div>
        </div>
        <div className="w-full h-2.5 bg-accent/10 rounded flex items-center justify-between px-1">
          <span className="text-[4px] text-accent font-bold uppercase">Cloud Synced</span>
          <span className="w-1 h-1 rounded-full bg-accent animate-ping" />
        </div>
      </div>

      {/* Connection paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
        <path d="M80 120 C 120 120, 120 110, 160 110" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-40" />
        <path d="M290 70 C 240 70, 220 90, 200 95" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-40" />
      </svg>
      {/* Mini sync packets */}
      <div className="absolute left-[90px] top-[115px] w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] animate-[packet_4s_linear_infinite]" />
      <div className="absolute right-[110px] top-[75px] w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] animate-[packet_3.5s_linear_infinite_reverse]" />
    </div>
  );
}

// High-fidelity Discord webhook broadcast representation
function DiscordMockup() {
  return (
    <div className="w-full bg-[#2f3136] text-text rounded-2xl border border-[#202225] shadow-md overflow-hidden flex flex-col font-sans">
      <div className="h-9 bg-[#202225] border-b border-[#18191c] px-3.5 flex items-center gap-2">
        <span className="text-[#8e9297] font-semibold text-base leading-none">#</span>
        <span className="text-white text-xs font-bold font-sans tracking-wide">shenron-radar</span>
        <span className="ml-auto text-[8px] bg-[#3ba55d]/10 border border-[#3ba55d]/20 text-[#3ba55d] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">Live Webhook</span>
      </div>
      
      <div className="p-4 flex gap-3 text-left">
        {/* User avatar icon */}
        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        
        {/* Message elements */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold text-xs hover:underline cursor-pointer">Scanron Bot</span>
            <span className="bg-[#5865F2] text-white text-[7px] px-1 py-0.2 rounded font-black uppercase tracking-wider font-display">BOT</span>
            <span className="text-[#72767d] text-[9px]">Today at 08:00 AM</span>
          </div>
          
          <div className="mt-1 border-l-4 border-signal bg-[#202225] rounded-r p-3.5 flex flex-col gap-2.5 max-w-[340px] shadow-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] text-[#72767d] font-bold uppercase tracking-wider">ANNIVERSARY SWEEP</span>
              <span className="text-white font-bold text-xs leading-tight">🐉 Dragon Radar Complete</span>
            </div>
            
            {/* Embed QR details */}
            <div className="flex items-center gap-3 bg-[#2f3136]/50 p-2 rounded border border-border/5">
              {/* QR checkered pattern */}
              <div className="w-12 h-12 bg-white p-1 rounded shrink-0 flex flex-col gap-0.5 relative">
                <div className="grid grid-cols-6 gap-0.5 w-full h-full">
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-black" /><div className="bg-black" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-white" /><div className="bg-white" /><div className="bg-black" />
                  <div className="bg-white" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-black" /><div className="bg-white" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-black" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-white" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-black" />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[9px] text-white font-mono font-bold leading-normal">Code: 7q8s9t2b</span>
                <span className="text-[8px] text-[#b9bbbe] font-sans">Profile: Goku • 10 Friends</span>
                <span className="text-[8px] text-signal font-sans font-semibold mt-1">✓ Active code ready</span>
              </div>
            </div>
            
            {/* Reactions summary */}
            <div className="flex gap-1.5 mt-0.5">
              <div className="bg-[#2f3136] border border-[#202225] rounded px-1.5 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-surface-2/20 text-[9px]">
                <span>🐉</span>
                <span className="text-white text-[8px] font-bold">14</span>
              </div>
              <div className="bg-[#2f3136] border border-[#202225] rounded px-1.5 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-surface-2/20 text-[9px]">
                <span>🔥</span>
                <span className="text-white text-[8px] font-bold">9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function LoginPage() {
  const { language, setLanguage, t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Feature showcase index and auto-rotation control
  const [activeTab, setActiveTab] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const showcaseFeatures = [
    {
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      titleKey: 'login.showcase.sync.title',
      descKey: 'login.showcase.sync.desc',
      mockup: <SyncMockup />
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#5865F2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      titleKey: 'login.showcase.discord.title',
      descKey: 'login.showcase.discord.desc',
      mockup: <DiscordMockup />
    },

  ];

  // Rotate mockup screens automatically
  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % showcaseFeatures.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoplay, showcaseFeatures.length]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'register') await registerWithEmail(email, password, displayName);
      else await signInWithEmail(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    console.log('[LoginPage] Triggering Google authentication flow');
    try {
      await signInWithGoogle();
      console.log('[LoginPage] Google authentication completed successfully');
    } catch (err) {
      console.error('[LoginPage] Google authentication encountered an error:', err);
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  }

  async function discord() {
    setError(null);
    try {
      const redirectUri = window.location.origin + '/auth/discord/callback';
      window.location.href = getDiscordAuthUrl(redirectUri);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discord initialization failed');
    }
  }

  return (
    <div className="min-h-dvh bg-bg text-text flex items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(255,143,0,0.03)_0%,_transparent_65%)] pointer-events-none z-0" />
      <div className="absolute w-[600px] h-[600px] -bottom-40 -left-40 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.02)_0%,_transparent_60%)] pointer-events-none z-0" />
      
      {/* Central console box */}
      <div className="relative z-10 w-full max-w-5xl bg-surface/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Language switch */}
        <div className="absolute top-4 right-4 z-20">
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-lg border border-border bg-surface/60 text-muted hover:text-text hover:border-muted/40 font-display text-[10px] uppercase font-black tracking-wider transition-all duration-200 cursor-pointer h-7 flex items-center justify-center min-w-9"
          >
            {language === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
        
        {/* Left column: Login controls */}
        <div className="col-span-1 lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/40 relative">
          
          <div className="flex-1 flex flex-col justify-center">
            {/* Header branding */}
            <div className="mb-6 flex items-center gap-3">
              <DragonBallIcon size={42} className="animate-bounce shrink-0" style={{ animationDuration: '3s' }} />
              <div>
                <h1 className="text-lg font-display font-black tracking-widest text-text uppercase leading-none">Scanron</h1>
                <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1">{t('login.subtitle')}</p>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={submit} className="space-y-3.5">
              {mode === 'register' && (
                <div className="space-y-1 text-left">
                  <Label htmlFor="displayName" className="text-[10px] uppercase tracking-wider font-display font-bold text-muted">
                    {t('login.displayName')}
                  </Label>
                  <Input
                    id="displayName"
                    placeholder="Goku"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="h-10 rounded-xl border border-border/70 bg-surface/50 text-xs px-3 focus-visible:ring-primary/20"
                  />
                </div>
              )}
              <div className="space-y-1 text-left">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-wider font-display font-bold text-muted">
                  {t('login.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="goku@dbz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 rounded-xl border border-border/70 bg-surface/50 text-xs px-3 focus-visible:ring-primary/20"
                />
              </div>
              <div className="space-y-1 text-left">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-wider font-display font-bold text-muted">
                  {t('login.password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 rounded-xl border border-border/70 bg-surface/50 text-xs px-3 focus-visible:ring-primary/20"
                />
              </div>
              {error && (
                <p className="text-[10px] text-accent font-bold bg-accent/5 border border-accent/25 rounded-lg p-2.5 animate-in fade-in duration-200">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full h-10.5 mt-2 rounded-xl text-xs uppercase" disabled={busy}>
                {mode === 'register' ? t('login.createAccount') : t('login.signIn')}
              </Button>
            </form>
            
            {/* Divider lines */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-border/30"></div>
              <span className="flex-shrink mx-3.5 text-[9px] text-muted font-display uppercase tracking-widest font-black">
                {t('login.or')}
              </span>
              <div className="flex-grow border-t border-border/30"></div>
            </div>

            {/* Custom styled OAuth buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={google}
                className="w-full h-10.5 rounded-xl flex items-center justify-center gap-3 font-semibold text-xs transition-all duration-200 font-display uppercase tracking-wider bg-surface border border-border/80 text-text shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:border-primary/40 hover:bg-surface-2/40 active:scale-[0.98] cursor-pointer"
              >
                <GoogleIcon />
                <span>{t('login.google')}</span>
              </button>
              <button
                type="button"
                onClick={discord}
                className="w-full h-10.5 rounded-xl flex items-center justify-center gap-3 font-semibold text-xs transition-all duration-200 font-display uppercase tracking-wider bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-[0_2px_8px_rgba(88,101,242,0.15)] hover:shadow-[0_4px_12px_rgba(88,101,242,0.3)] active:scale-[0.98] border border-transparent cursor-pointer"
              >
                <DiscordIcon />
                <span>{t('login.discord')}</span>
              </button>
            </div>
            
            {/* Account Switcher Trigger */}
            <button
              type="button"
              className="mt-5 w-full text-center text-[10px] text-muted hover:text-primary transition-colors font-display font-black uppercase tracking-wider cursor-pointer"
              onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
            >
              {mode === 'signin' ? t('login.needAccount') : t('login.haveAccount')}
            </button>
          </div>

          {/* Local Mode Trigger */}
          <div className="mt-6 border-t border-border/30 pt-3 text-center">
            <NavLink to="/" className="text-[10px] text-primary hover:text-primary/80 font-black font-display uppercase tracking-wider transition-colors">
              {t('login.local')} →
            </NavLink>
          </div>
        </div>

        {/* Right column: CSS Showcase Mockups */}
        <div className="col-span-1 lg:col-span-7 bg-surface-2/30 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Radial grid pattern background */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="flex-1 flex flex-col justify-center gap-6 lg:gap-8 z-10">
            {/* Showcase title */}
            <div className="text-left max-w-md">
              <span className="text-[9px] bg-primary/10 border border-primary/25 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest font-display">
                {t('shell.cloudSave')}
              </span>
              <h2 className="text-lg md:text-xl font-display font-black text-text uppercase tracking-wide mt-2">
                {t('login.showcase.title')}
              </h2>
            </div>

            {/* Interactive Showcase Mockup Frame */}
            <div className="relative w-full min-h-[220px] flex items-center justify-center transition-all duration-300">
              <div className="w-full max-w-sm transform hover:scale-[1.01] transition-transform duration-300">
                {showcaseFeatures[activeTab].mockup}
              </div>
            </div>

            {/* Showcase Tab Control Selectors */}
            <div className="flex flex-col gap-2 max-w-md">
              {showcaseFeatures.map((feat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveTab(idx);
                    setAutoplay(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                    activeTab === idx
                      ? 'bg-surface border-border shadow-[0_4px_12px_rgba(15,23,42,0.03)] translate-x-1'
                      : 'bg-transparent border-transparent hover:bg-surface-2/40 hover:border-border/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === idx ? 'bg-surface-2' : 'bg-surface/50 border border-border/30'} shrink-0`}>
                    {feat.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-[10px] font-bold font-display uppercase tracking-wide ${activeTab === idx ? 'text-text' : 'text-muted'}`}>
                      {t(feat.titleKey as Parameters<typeof t>[0])}
                    </span>
                    <span className="text-[9px] text-muted mt-0.5 leading-normal">
                      {t(feat.descKey as Parameters<typeof t>[0])}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
