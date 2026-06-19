import { type ReactNode } from 'react';
import { useAuth } from '../../lib/auth/useAuth';
import LoginPage from '../../routes/LoginPage';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-dvh bg-bg text-muted flex items-center justify-center">Loading...</div>;
  }
  if (!user) return <LoginPage />;
  return <>{children}</>;
}
