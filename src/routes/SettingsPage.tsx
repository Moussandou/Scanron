import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../lib/auth/useAuth';
import { getDb } from '../lib/firebase/app';
import { userPath } from '../lib/db/paths';
import { requestPushPermission, disablePushNotifications } from '../lib/auth/push';
import { exportConfig, importConfig } from '../lib/db/importExport';
import { ONBOARDING_DONE_KEY } from '../lib/onboarding/useOnboarding';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { TimeSyncControls } from '../components/dashboard/TimeSyncControls';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionLabel } from '../components/ui/SectionLabel';
import { useTranslation } from '../lib/i18n/I18nContext';
import {
  Bell,
  Clock,
  Save,
  Loader2,
  CheckCircle,
  Download,
  Upload,
  Lock,
  RotateCcw,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [discordEnabled, setDiscordEnabled] = useState(false);
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [sendAtHour, setSendAtHour] = useState(9);
  const [timezone, setTimezone] = useState('UTC');

  // Timezones
  const [timezones, setTimezones] = useState<string[]>([]);



  // Webhook testing states
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    try {
      setTimezones(Intl.supportedValuesOf('timeZone'));
    } catch {
      setTimezones(['UTC', 'America/New_York', 'Europe/Paris', 'Asia/Tokyo']);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadSettings() {
      try {
        const db = getDb();
        const userRef = doc(db, userPath(user!.uid));
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setDiscordWebhook(data.discordWebhook || '');
          if (data.notificationSettings) {
            setDiscordEnabled(!!data.notificationSettings.discord);
            setPushEnabled(!!data.notificationSettings.push);
            setSendAtHour(data.notificationSettings.sendAtHour ?? 9);
            setTimezone(data.notificationSettings.timezone || 'UTC');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    void loadSettings();
  }, [user]);

  async function handlePushToggle(checked: boolean) {
    setError(null);
    try {
      if (checked) {
        const token = await requestPushPermission();
        if (token) {
          setPushEnabled(true);
        } else {
          setPushEnabled(false);
          setError('Push notifications are not supported in this browser.');
        }
      } else {
        await disablePushNotifications();
        setPushEnabled(false);
      }
    } catch (err) {
      setPushEnabled(false);
      setError(err instanceof Error ? err.message : 'Failed to request notification permission');
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const db = getDb();
      const userRef = doc(db, userPath(user.uid));
      await updateDoc(userRef, {
        discordWebhook,
        notificationSettings: {
          discord: discordEnabled,
          push: pushEnabled,
          sendAtHour,
          timezone,
        },
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function handleTestWebhook() {
    if (!discordWebhook) return;
    setTestingWebhook(true);
    setTestResult(null);
    try {
      const response = await fetch(discordWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Scanron Radar',
          avatar_url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=128&h=128&fit=crop',
          content: '☄️ **Scanron Radar Connection Test** ☄️\nYour Discord Webhook notification is configured correctly! Time to summon Shenron! 🐉'
        }),
      });

      if (response.ok) {
        setTestResult({ success: true, message: 'Test notification sent successfully!' });
      } else {
        const text = await response.text();
        setTestResult({ success: false, message: `Failed: ${response.status} ${response.statusText}. ${text}` });
      }
    } catch (err) {
      setTestResult({ success: false, message: err instanceof Error ? err.message : 'Network error' });
    } finally {
      setTestingWebhook(false);
    }
  }

  // Backup & Restore
  async function handleExport() {
    if (!user) return;
    try {
      const json = await exportConfig(user.uid);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scanron_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export backup');
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!user || !file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      try {
        await importConfig(user.uid, text);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import backup');
      }
    };
    reader.readAsText(file);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted space-y-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      {error && (
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {/* Clock Sync — available to everyone, fixes expired QR codes */}
      <TimeSyncControls />

      {/* Main Settings Form */}
      <div className={user ? '' : 'relative pointer-events-none select-none'}>
        {!user && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-surface/40 backdrop-blur-[2px] pointer-events-auto">
            <div className="bg-surface border border-accent/30 px-4 py-2.5 rounded-xl shadow-[var(--shadow-pop)] flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-accent">
              <Lock size={13} /> {t('settings.lockReminders')}
            </div>
          </div>
        )}
        <form onSubmit={save} className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-sm p-6 space-y-6">
          <SectionLabel icon={<Bell size={18} className="text-primary" />}>{t('settings.notifications')}</SectionLabel>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor="discordToggle" className="text-text font-medium block">{t('settings.discord')}</Label>
                <span className="text-xs text-muted block">{t('settings.discordDesc')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  id="discordToggle"
                  type="checkbox"
                  checked={discordEnabled}
                  onChange={(e) => setDiscordEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border/85 peer-checked:border-primary/50 shadow-inner"></div>
              </label>
            </div>

            {discordEnabled && (
              <div className="space-y-3.5 pl-4 border-l-2 border-primary/20 animate-in fade-in slide-in-from-left-4 duration-200">
                <div className="space-y-1.5">
                  <Label htmlFor="discordWebhook" className="text-xs uppercase tracking-wider font-display font-semibold">{t('settings.discordWebhook')}</Label>
                  <Input
                    id="discordWebhook"
                    type="url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={discordWebhook}
                    onChange={(e) => setDiscordWebhook(e.target.value)}
                    required={discordEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-fit border-primary/20 text-primary hover:bg-primary/5 h-8.5"
                    disabled={testingWebhook || !discordWebhook.startsWith('http')}
                    onClick={handleTestWebhook}
                  >
                    {testingWebhook ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        {t('settings.testing')}
                      </>
                    ) : (
                      t('settings.testWebhook')
                    )}
                  </Button>
                  {testResult && (
                    <p className={`text-xs font-semibold px-3 py-2 rounded-lg border ${
                      testResult.success 
                        ? 'bg-primary/10 border-primary/25 text-primary' 
                        : 'bg-accent/10 border-accent/25 text-accent'
                    }`}>
                      {testResult.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <hr className="border-border/50" />

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor="pushToggle" className="text-text font-medium block">{t('settings.webpush')}</Label>
                <span className="text-xs text-muted block">{t('settings.webpushDesc')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  id="pushToggle"
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => handlePushToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border/85 peer-checked:border-primary/50 shadow-inner"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-sm p-6 space-y-6">
          <SectionLabel icon={<Clock size={18} className="text-primary" />}>{t('settings.schedule')}</SectionLabel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sendAtHour" className="text-xs uppercase tracking-wider font-display font-semibold">{t('settings.hour')}</Label>
              <select
                id="sendAtHour"
                value={sendAtHour}
                onChange={(e) => setSendAtHour(parseInt(e.target.value, 10))}
                className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-text transition-all duration-200 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                {Array.from({ length: 24 }).map((_, h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="timezone" className="text-xs uppercase tracking-wider font-display font-semibold">{t('settings.timezone')}</Label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-text transition-all duration-200 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-border/20 pb-6">
          <div className="flex items-center gap-2">
            {success && (
              <span className="flex items-center gap-1.5 text-xs text-primary animate-in fade-in zoom-in-95 duration-200 font-semibold">
                <CheckCircle size={15} />
                {t('settings.saved')}
              </span>
            )}
          </div>
          <Button type="submit" disabled={saving} className="min-w-36">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
            ) : (
              <Save className="w-4 h-4 mr-1.5" />
            )}
            {saving ? t('settings.saving') : t('settings.save')}
          </Button>
        </div>
        </form>
      </div>


      {/* Replay onboarding tour */}
      <div className="rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-text block">{t('settings.replayTour')}</span>
            <span className="text-xs text-muted block">{t('settings.replayTourDesc')}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={() => {
              try { localStorage.removeItem(ONBOARDING_DONE_KEY); } catch { /* noop */ }
              navigate('/dashboard');
            }}
          >
            <RotateCcw size={14} /> {t('settings.replayTour')}
          </Button>
        </div>
      </div>

      {/* Backup and Restore Panel */}
      <div className="rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-sm p-6 space-y-6">
        <SectionLabel icon={<Upload size={18} className="text-primary" />}>{t('settings.backupTitle')}</SectionLabel>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-text block">{t('settings.backupTitle')}</span>
            <span className="text-xs text-muted block">{t('settings.backupDesc')}</span>
          </div>

          <div className="flex gap-2.5">
            <Button variant="outline" onClick={handleExport} className="h-10">
              <Download size={15} className="mr-1.5" />
              {t('settings.export')}
            </Button>

            <label className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wider font-display uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 border border-border bg-transparent text-text hover:border-primary/45 hover:bg-surface-2/40 h-10 px-4.5 text-xs cursor-pointer active:scale-[0.98]">
              <Upload size={15} className="mr-1.5" />
              {t('settings.import')}
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="sr-only"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
