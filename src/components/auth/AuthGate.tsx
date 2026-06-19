import { type ReactNode } from 'react';
import { useAuth } from '../../lib/auth/useAuth';
import LoginPage from '../../routes/LoginPage';
import { RadarMark } from '../brand/RadarMark';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-dvh bg-bg text-text flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-lg animate-pulse" />
          <RadarMark size={56} />
        </div>
        <p className="font-display text-[10px] font-bold tracking-[0.25em] text-primary animate-pulse uppercase">
          Initializing Radar...
        </p>
      </div>
    );
  }
  if (!user) return <LoginPage />;
  return <>{children}</>;
}
