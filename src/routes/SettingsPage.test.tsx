// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

const mockUseAuth = vi.fn().mockReturnValue({ user: { uid: 'u1' }, loading: false });
vi.mock('../lib/auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockDoc = vi.fn().mockReturnValue({ __type: 'docref' });
const mockGetDoc = vi.fn();
const mockUpdateDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  doc: (...args: any[]) => mockDoc(...args),
  getDoc: (...args: any[]) => mockGetDoc(...args),
  updateDoc: (...args: any[]) => mockUpdateDoc(...args),
}));

vi.mock('../lib/firebase/app', () => ({
  getDb: () => ({ __type: 'db' }),
  getFirebaseAuth: () => ({ currentUser: { uid: 'u1' } }),
}));

const mockRequestPushPermission = vi.fn();
const mockDisablePushNotifications = vi.fn();
vi.mock('../lib/auth/push', () => ({
  requestPushPermission: () => mockRequestPushPermission(),
  disablePushNotifications: () => mockDisablePushNotifications(),
}));

const mockCreateFamily = vi.fn().mockResolvedValue('fam123');
const mockJoinFamily = vi.fn().mockResolvedValue(undefined);
const mockLeaveFamily = vi.fn().mockResolvedValue(undefined);
const mockGetFamily = vi.fn().mockResolvedValue(null);

vi.mock('../lib/db/families', () => ({
  createFamily: (...args: any[]) => mockCreateFamily(...args),
  joinFamily: (...args: any[]) => mockJoinFamily(...args),
  leaveFamily: (...args: any[]) => mockLeaveFamily(...args),
  getFamily: (...args: any[]) => mockGetFamily(...args),
}));

const mockExportConfig = vi.fn().mockResolvedValue('{"accounts":[]}');
const mockImportConfig = vi.fn().mockResolvedValue(undefined);

vi.mock('../lib/db/importExport', () => ({
  exportConfig: (...args: any[]) => mockExportConfig(...args),
  importConfig: (...args: any[]) => mockImportConfig(...args),
}));

import { I18nProvider } from '../lib/i18n/I18nContext';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from './SettingsPage';

beforeEach(() => {
  mockDoc.mockClear();
  mockGetDoc.mockReset();
  mockUpdateDoc.mockClear();
  mockRequestPushPermission.mockReset();
  mockDisablePushNotifications.mockClear();
  mockCreateFamily.mockClear();
  mockJoinFamily.mockClear();
  mockLeaveFamily.mockClear();
  mockGetFamily.mockReset().mockResolvedValue(null);
  mockExportConfig.mockClear();
  mockImportConfig.mockClear();
});

afterEach(() => {
  cleanup();
});

describe('SettingsPage', () => {
  it('renders settings fields and updates firestore on save', async () => {
    // Mock user document
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        displayName: 'Goku',
        discordWebhook: 'https://discord.com/webhook/old',
        notificationSettings: {
          discord: true,
          push: false,
          sendAtHour: 9,
          timezone: 'America/New_York',
        },
      }),
    });

    render(
      <MemoryRouter>
        <I18nProvider>
          <SettingsPage />
        </I18nProvider>
      </MemoryRouter>
    );

    // Wait for the fields to be loaded with existing values
    await waitFor(() => {
      expect(screen.getByLabelText(/discord webhook/i)).toBeDefined();
    });

    const webhookInput = screen.getByLabelText(/discord webhook/i) as HTMLInputElement;
    expect(webhookInput.value).toBe('https://discord.com/webhook/old');

    // Check existing timezone and hour values
    const hourSelect = screen.getByLabelText(/reminder hour/i) as HTMLSelectElement;
    expect(hourSelect.value).toBe('9');

    // Change fields
    fireEvent.change(webhookInput, { target: { value: 'https://discord.com/webhook/new' } });
    fireEvent.change(hourSelect, { target: { value: '14' } });

    // Click save
    const saveBtn = screen.getByRole('button', { name: /save settings/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });

    const updatedData = mockUpdateDoc.mock.calls[0][1];
    expect(updatedData.discordWebhook).toBe('https://discord.com/webhook/new');
    expect(updatedData.notificationSettings.sendAtHour).toBe(14);
  });
});
