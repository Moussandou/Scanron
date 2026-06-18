import './index.css';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import DashboardPage from './routes/DashboardPage';
import SettingsPage from './routes/SettingsPage';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppShell>
  );
}
