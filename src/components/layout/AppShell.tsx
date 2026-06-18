import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { RadarMark } from '../brand/RadarMark';
import { cn } from '../../lib/utils';

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    'text-sm font-medium px-3 py-1.5 rounded-md transition-colors',
    isActive ? 'text-primary bg-surface-2' : 'text-muted hover:text-text',
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-text">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <RadarMark />
          <span className="font-bold tracking-tight">Scanron</span>
          <nav className="ml-auto flex items-center gap-1">
            <NavLink to="/" className={navClass} end>Dashboard</NavLink>
            <NavLink to="/settings" className={navClass}>Settings</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
