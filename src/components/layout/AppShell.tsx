import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { RadarMark } from '../brand/RadarMark';
import { cn } from '../../lib/utils';

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    'relative text-xs font-semibold tracking-wider px-3.5 py-1.5 transition-all duration-300 font-display uppercase rounded-lg border',
    isActive
      ? 'text-primary bg-primary/10 border-primary/20 shadow-[0_0_12px_rgba(54,226,123,0.12)]'
      : 'text-muted border-transparent hover:text-text hover:bg-surface-2/50',
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-text relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[400px] bg-[radial-gradient(circle_at_top,_rgba(54,226,123,0.06)_0%,_transparent_70%)] pointer-events-none z-0" />
      
      <header className="sticky top-0 z-20 border-b border-primary/5 bg-bg/75 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <RadarMark size={32} />
            <span className="font-display font-black text-lg tracking-widest text-text uppercase">
              Scanron
            </span>
          </div>
          <nav className="ml-auto flex items-center gap-1.5">
            <NavLink to="/" className={navClass} end>Dashboard</NavLink>
            <NavLink to="/vault" className={navClass}>Vault</NavLink>
            <NavLink to="/settings" className={navClass}>Settings</NavLink>
          </nav>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

