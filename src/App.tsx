import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AuthGate } from './components/auth/AuthGate';
import DashboardPage from './routes/DashboardPage';
import SettingsPage from './routes/SettingsPage';
import VaultPage from './routes/VaultPage';
import DiscordCallback from './routes/DiscordCallback';

export default function App() {
  return (
    <Routes>
      <Route path="/auth/discord/callback" element={<DiscordCallback />} />
      <Route
        path="*"
        element={
          <AuthGate>
            <AppShell>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/vault" element={<VaultPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </AppShell>
          </AuthGate>
        }
      />
    </Routes>
  );
}
