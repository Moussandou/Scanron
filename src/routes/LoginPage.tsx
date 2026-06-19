import { useState, type FormEvent } from 'react';
import { signInWithEmail, signInWithGoogle, registerWithEmail } from '../lib/auth/methods';
import { getDiscordAuthUrl } from '../lib/auth/discord';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadarMark } from '../components/brand/RadarMark';

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  }

  function discord() {
    setError(null);
    try {
      const redirectUri = window.location.origin + '/auth/discord/callback';
      window.location.href = getDiscordAuthUrl(redirectUri);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discord initialization failed');
    }
  }

  return (
    <div className="min-h-dvh bg-bg text-text flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow node */}
      <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(54,226,123,0.06)_0%,_transparent_65%)] pointer-events-none z-0" />
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-primary/10 bg-surface/50 backdrop-blur-lg p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="mb-8 flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />
            <RadarMark size={40} />
          </div>
          <div>
            <h1 className="text-xl font-display font-black tracking-widest text-text uppercase">Scanron</h1>
            <p className="text-xs text-muted font-medium">Daily DBL Shenron QR, automated.</p>
          </div>
        </div>
        
        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <Label htmlFor="displayName" className="text-xs uppercase tracking-wider font-display font-semibold">Display name</Label>
              <Input id="displayName" placeholder="Goku" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider font-display font-semibold">Email</Label>
            <Input id="email" type="email" placeholder="goku@dbz.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider font-display font-semibold">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && (
            <p className="text-xs text-accent font-medium bg-accent/10 border border-accent/25 rounded-md p-2.5 animate-in fade-in duration-200">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full mt-2" disabled={busy}>
            {mode === 'register' ? 'Create account' : 'Sign in'}
          </Button>
        </form>
        
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-[10px] text-muted font-display uppercase tracking-widest font-semibold">or</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button variant="outline" className="w-full" onClick={google}>
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full" onClick={discord}>
            Continue with Discord
          </Button>
        </div>
        
        <button
          type="button"
          className="mt-6 w-full text-center text-xs text-muted hover:text-primary transition-colors font-display font-bold uppercase tracking-wider cursor-pointer"
          onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
        >
          {mode === 'signin' ? 'Need an account? Register' : 'Have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
