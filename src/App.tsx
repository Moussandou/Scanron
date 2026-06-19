import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AuthGate } from './components/auth/AuthGate';
import LandingPage from './routes/LandingPage';
import DashboardPage from './routes/DashboardPage';
import SettingsPage from './routes/SettingsPage';
import DiscordCallback from './routes/DiscordCallback';
import LoginPage from './routes/LoginPage';
import LegalPage from './routes/legal/LegalPage';

export default function App() {
  return (
    <Routes>
      <Route path="/auth/discord/callback" element={<DiscordCallback />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <AuthGate>
            <AppShell>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/vault" element={<Navigate to="/dashboard?tab=manage" replace />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/legal/privacy" element={<LegalPage doc="privacy" />} />
                <Route path="/legal/terms" element={<LegalPage doc="terms" />} />
                <Route path="/legal/notice" element={<LegalPage doc="notice" />} />
              </Routes>
            </AppShell>
          </AuthGate>
        }
      />
    </Routes>
  );
}
