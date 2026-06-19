import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../lib/auth/useAuth';
import { getDb } from '../lib/firebase/app';
import { userPath } from '../lib/db/paths';
import { requestPushPermission, disablePushNotifications } from '../lib/auth/push';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Bell, Clock, Save, Loader2, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
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

  // Loaded timezones
  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    try {
      setTimezones(Intl.supportedValuesOf('timeZone'));
    } catch {
      setTimezones(['UTC', 'America/New_York', 'Europe/Paris', 'Asia/Tokyo']);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted space-y-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm">Loading radar settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Radar Settings</h1>
          <p className="text-sm text-muted">Configure daily scan schedules and automated notification reminders.</p>
        </div>
      </div>

      <form onSubmit={save} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
          <h2 className="text-base font-semibold text-text flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            Notification Channels
          </h2>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor="discordToggle" className="text-text font-medium block">Discord Notifications</Label>
                <span className="text-xs text-muted block">Post QR codes and search codes to your Discord webhook daily.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  id="discordToggle"
                  type="checkbox"
                  checked={discordEnabled}
                  onChange={(e) => setDiscordEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {discordEnabled && (
              <div className="space-y-1 pl-4 border-l-2 border-primary/20 animate-in fade-in slide-in-from-left-4 duration-200">
                <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                <Input
                  id="discordWebhook"
                  type="url"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  required={discordEnabled}
                />
              </div>
            )}

            <hr className="border-border" />

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor="pushToggle" className="text-text font-medium block">Web Push Notifications</Label>
                <span className="text-xs text-muted block">Receive browser notifications when the daily radar scan completes.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  id="pushToggle"
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => handlePushToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
          <h2 className="text-base font-semibold text-text flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Scan Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="sendAtHour">Reminder Hour</Label>
              <select
                id="sendAtHour"
                value={sendAtHour}
                onChange={(e) => setSendAtHour(parseInt(e.target.value, 10))}
                className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {Array.from({ length: 24 }).map((_, h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {success && (
              <span className="flex items-center gap-1.5 text-sm text-primary animate-in fade-in zoom-in-95 duration-200">
                <CheckCircle size={16} />
                Settings saved successfully!
              </span>
            )}
          </div>
          <Button type="submit" disabled={saving} className="min-w-32">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
