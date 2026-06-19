import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../lib/auth/useAuth';
import { getDb } from '../lib/firebase/app';
import { userPath } from '../lib/db/paths';
import { requestPushPermission, disablePushNotifications } from '../lib/auth/push';
import { createFamily, joinFamily, leaveFamily, getFamily } from '../lib/db/families';
import { exportConfig, importConfig } from '../lib/db/importExport';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { NavLink } from 'react-router-dom';
import type { FamilyDoc } from '../lib/db/types';
import {
  Bell,
  Clock,
  Save,
  Loader2,
  CheckCircle,
  Download,
  Upload,
  Users,
  Copy,
  Trash2,
  LogOut,
  Plus,
  Shield,
  Lock,
} from 'lucide-react';

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

  // Timezones
  const [timezones, setTimezones] = useState<string[]>([]);

  // Family states
  const [family, setFamily] = useState<FamilyDoc | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [familyNameInput, setFamilyNameInput] = useState('');
  const [familyIdInput, setFamilyIdInput] = useState('');
  const [familyBusy, setFamilyBusy] = useState(false);

  useEffect(() => {
    try {
      setTimezones(Intl.supportedValuesOf('timeZone'));
    } catch {
      setTimezones(['UTC', 'America/New_York', 'Europe/Paris', 'Asia/Tokyo']);
    }
  }, []);

  async function reloadFamily(fid: string | null) {
    if (!fid) {
      setFamilyId(null);
      setFamily(null);
      return;
    }
    try {
      setFamilyId(fid);
      const fDoc = await getFamily(fid);
      setFamily(fDoc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reload family info');
    }
  }

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
          if (data.familyId) {
            await reloadFamily(data.familyId);
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

  // Family actions
  async function handleCreateFamily(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !familyNameInput) return;
    setFamilyBusy(true);
    setError(null);
    try {
      const fid = await createFamily(familyNameInput, user.uid);
      await reloadFamily(fid);
      setFamilyNameInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create family');
    } finally {
      setFamilyBusy(false);
    }
  }

  async function handleJoinFamily(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !familyIdInput) return;
    setFamilyBusy(true);
    setError(null);
    try {
      await joinFamily(familyIdInput, user.uid);
      await reloadFamily(familyIdInput);
      setFamilyIdInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join family');
    } finally {
      setFamilyBusy(false);
    }
  }

  async function handleLeaveFamily() {
    if (!user || !familyId) return;
    const isOwner = family?.ownerUid === user.uid;
    const confirmMsg = isOwner
      ? 'Are you sure you want to disband the family? This will delete the family and all its shared friends.'
      : 'Are you sure you want to leave the family?';

    if (!window.confirm(confirmMsg)) return;

    setFamilyBusy(true);
    setError(null);
    try {
      await leaveFamily(familyId, user.uid);
      await reloadFamily(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave family');
    } finally {
      setFamilyBusy(false);
    }
  }

  function copyFamilyId() {
    if (!familyId) return;
    navigator.clipboard.writeText(familyId);
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
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-display font-black tracking-widest text-text uppercase">Radar Settings</h1>
        <p className="text-xs text-muted mt-1">Configure scan schedules, shared family codes, and data backups.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {!user && (
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300 shadow-[0_4px_20px_rgba(245,166,35,0.04)]">
          <div className="space-y-1">
            <h3 className="text-xs font-display font-black tracking-wider text-accent uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_6px_var(--color-accent)]" />
              Local Mode Active
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Your codes are stored safely in local storage. Connect to cloud to back up, share codes with your family, and schedule automated reminders!
            </p>
          </div>
          <NavLink to="/login" className="shrink-0">
            <Button variant="outline" size="sm" className="border-accent/25 text-accent hover:bg-accent/10 whitespace-nowrap">
              Cloud Sync
            </Button>
          </NavLink>
        </div>
      )}

      {/* Main Settings Form */}
      <div className={user ? '' : 'relative group opacity-45 pointer-events-none select-none'}>
        {!user && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto">
            <div className="bg-surface border border-border px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-accent">
              <Lock size={13} /> Sign in to configure reminders
            </div>
          </div>
        )}
        <form onSubmit={save} className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-sm p-6 space-y-6">
          <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text flex items-center gap-2.5">
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
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border/85 peer-checked:border-primary/50 shadow-inner"></div>
              </label>
            </div>

            {discordEnabled && (
              <div className="space-y-1.5 pl-4 border-l-2 border-primary/20 animate-in fade-in slide-in-from-left-4 duration-200">
                <Label htmlFor="discordWebhook" className="text-xs uppercase tracking-wider font-display font-semibold">Discord Webhook URL</Label>
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

            <hr className="border-border/50" />

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
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border/85 peer-checked:border-primary/50 shadow-inner"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-sm p-6 space-y-6">
          <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text flex items-center gap-2.5">
            <Clock size={18} className="text-primary" />
            Scan Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sendAtHour" className="text-xs uppercase tracking-wider font-display font-semibold">Reminder Hour</Label>
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
              <Label htmlFor="timezone" className="text-xs uppercase tracking-wider font-display font-semibold">Timezone</Label>
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
                Settings saved successfully!
              </span>
            )}
          </div>
          <Button type="submit" disabled={saving} className="min-w-36">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
            ) : (
              <Save className="w-4 h-4 mr-1.5" />
            )}
            Save Settings
          </Button>
        </div>
        </form>
      </div>

      {/* Family Mode Panel */}
      <div className={user ? '' : 'relative group opacity-45 pointer-events-none select-none mt-6'}>
        {!user && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto">
            <div className="bg-surface border border-border px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-accent">
              <Lock size={13} /> Sign in to join family mode
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-sm p-6 space-y-6">
          <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text flex items-center gap-2.5">
          <Users size={18} className="text-primary" />
          Family Mode (Shared Friends)
        </h2>

        {familyId && family ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-primary/10 bg-primary/5">
              <div className="space-y-1.5">
                <span className="text-[10px] text-primary/80 block uppercase tracking-wider font-display font-bold">Active Family</span>
                <span className="text-base font-bold text-text">{family.name}</span>
                <span className="text-[10px] text-muted block font-mono mt-1 select-all bg-surface px-2 py-0.5 rounded border border-border/80 w-fit">ID: {familyId}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyFamilyId} className="h-8.5">
                  <Copy size={13} className="mr-1.5" />
                  Copy ID
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLeaveFamily}
                  disabled={familyBusy}
                  className="h-8.5 border-accent/20 text-accent hover:bg-accent/10"
                >
                  {family?.ownerUid === user?.uid ? (
                    <>
                      <Trash2 size={13} className="mr-1.5" />
                      Disband
                    </>
                  ) : (
                    <>
                      <LogOut size={13} className="mr-1.5" />
                      Leave
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-muted block uppercase tracking-wider font-display font-bold">Members</span>
              <div className="divide-y divide-border/30 max-h-36 overflow-y-auto rounded-lg border border-border/40 bg-surface/20">
                {family.memberUids.map((uid) => (
                  <div key={uid} className="text-xs text-text flex items-center gap-2 px-3 py-2 hover:bg-surface-2/20 transition-colors">
                    <Shield size={12} className={uid === family.ownerUid ? 'text-accent' : 'text-muted'} />
                    <span className="font-mono tracking-wide">{uid}</span>
                    {uid === family.ownerUid && <span className="text-[9px] font-display font-bold uppercase text-accent bg-accent/15 px-1.5 py-0.5 rounded border border-accent/10">Owner</span>}
                    {uid === user?.uid && <span className="text-[9px] font-display font-bold uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/10">You</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            <form onSubmit={handleCreateFamily} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="familyName" className="text-xs uppercase tracking-wider font-display font-semibold">Family Name</Label>
                <Input
                  id="familyName"
                  placeholder="e.g. Z Fighters"
                  value={familyNameInput}
                  onChange={(e) => setFamilyNameInput(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={familyBusy} className="w-full">
                {familyBusy ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Plus className="w-4 h-4 mr-1.5" />}
                Create Family
              </Button>
            </form>

            <form onSubmit={handleJoinFamily} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="familyIdToJoin" className="text-xs uppercase tracking-wider font-display font-semibold">Family ID to Join</Label>
                <Input
                  id="familyIdToJoin"
                  placeholder="Enter family invite ID..."
                  value={familyIdInput}
                  onChange={(e) => setFamilyIdInput(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={familyBusy} variant="outline" className="w-full">
                {familyBusy ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Users className="w-4 h-4 mr-1.5" />}
                Join Family
              </Button>
            </form>
          </div>
        )}
        </div>
      </div>

      {/* Backup and Restore Panel */}
      <div className="rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-sm p-6 space-y-6">
        <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text flex items-center gap-2.5">
          <Upload size={18} className="text-primary" />
          Backup & Restore
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-text block">Local Config Backup</span>
            <span className="text-xs text-muted block">Export all your account swap listings and friends, or restore them.</span>
          </div>

          <div className="flex gap-2.5">
            <Button variant="outline" onClick={handleExport} className="h-10">
              <Download size={15} className="mr-1.5" />
              Export
            </Button>

            <label className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wider font-display uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 border border-border bg-transparent text-text hover:border-primary/45 hover:bg-surface-2/40 h-10 px-4.5 text-xs cursor-pointer active:scale-[0.98]">
              <Upload size={15} className="mr-1.5" />
              Import
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
