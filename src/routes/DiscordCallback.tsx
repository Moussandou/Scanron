import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { signInWithDiscord } from '../lib/auth/discord';
import { Loader2, AlertCircle } from 'lucide-react';
import { buttonVariants } from '../components/ui/button';

export default function DiscordCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const code = searchParams.get('code');
  const [error, setError] = useState<string | null>(null);
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;

    if (!code) {
      navigate('/');
      return;
    }

    attempted.current = true;

    const redirectUri = window.location.origin + location.pathname;

    signInWithDiscord(code, redirectUri)
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unknown authentication error');
      });
  }, [code, navigate, location.pathname]);

  if (error) {
    return (
      <div className="min-h-dvh bg-bg text-text flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-lg font-bold tracking-tight">Failed to authenticate</h1>
            <p className="text-sm text-muted">{error}</p>
          </div>
          <Link to="/" className={buttonVariants({ variant: 'default', className: 'w-full mt-2' })}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-text flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <div className="space-y-1">
          <h1 className="text-base font-semibold tracking-wide uppercase text-primary">Connecting with Discord</h1>
          <p className="text-sm text-muted">Please wait while we link your account...</p>
        </div>
      </div>
    </div>
  );
}
