import { useState, type FormEvent } from 'react';
import { signInWithEmail, signInWithGoogle, registerWithEmail } from '../lib/auth/methods';
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

  return (
    <div className="min-h-dvh bg-bg text-text flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6">
        <div className="mb-6 flex items-center gap-3">
          <RadarMark size={32} />
          <div>
            <h1 className="text-lg font-bold tracking-tight">Scanron</h1>
            <p className="text-xs text-muted">Daily Shenron QR, automated.</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <div className="space-y-1">
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-accent">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {mode === 'register' ? 'Create account' : 'Sign in'}
          </Button>
        </form>
        <Button variant="outline" className="mt-3 w-full" onClick={google}>Continue with Google</Button>
        <button
          type="button"
          className="mt-4 w-full text-center text-xs text-muted hover:text-text"
          onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
        >
          {mode === 'signin' ? 'Need an account? Register' : 'Have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
