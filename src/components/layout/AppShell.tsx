import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ScanronMark } from '../brand/ScanronMark';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/auth/useAuth';
import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n/I18nContext';
import { LocalModeBanner } from './LocalModeBanner';
import { Footer } from './Footer';
import { RadarBackdrop } from './RadarBackdrop';

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    'relative text-xs font-semibold tracking-wider px-3.5 py-1.5 transition-all duration-300 font-display uppercase rounded-lg border',
    isActive
      ? 'text-primary bg-primary/10 border-primary/20 shadow-[0_0_12px_rgba(255,143,0,0.12)]'
      : 'text-muted border-transparent hover:text-text hover:bg-surface-2/50',
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { language, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };
  
  return (
    <div className="min-h-dvh bg-bg text-text relative overflow-x-clip flex flex-col">
      <RadarBackdrop />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[400px] bg-[radial-gradient(circle_at_top,_rgba(255,143,0,0.06)_0%,_transparent_70%)] pointer-events-none z-0" />
      
      <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <NavLink to="/" className="group flex items-center gap-2.5 hover:opacity-95 transition-opacity">
            <ScanronMark size={30} animated className="shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="flex flex-col leading-none">
              <span className="font-display font-black text-base sm:text-lg tracking-[0.2em] text-text uppercase">
                Scanron
              </span>
              <span className="font-mono text-[8px] tracking-[0.3em] text-muted uppercase mt-1 hidden sm:block">
                Dragon Radar
              </span>
            </span>
          </NavLink>
          <nav className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <NavLink to="/dashboard" className={navClass} end>{t('shell.codes')}</NavLink>
            <NavLink to="/settings" className={navClass}>{t('shell.settings')}</NavLink>
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 rounded border border-border bg-surface-2/60 text-muted hover:text-text hover:border-muted/40 font-display text-[10px] uppercase font-bold tracking-wider cursor-pointer h-8 flex items-center justify-center min-w-9 ml-1"
              aria-label="Toggle language"
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>
            {!user && (
              <NavLink to="/login" className="ml-1">
                <Button size="sm" variant="outline" className="border-accent/25 text-accent hover:border-accent/40 hover:bg-accent/10 hover:shadow-[0_0_10px_rgba(14,165,233,0.1)] flex items-center gap-1 h-8 px-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {t('shell.cloudSave')}
                </Button>
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <LocalModeBanner />
      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 flex-1">{children}</main>
      <Footer />
    </div>
  );
}

