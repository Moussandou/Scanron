import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth/useAuth';
import { useAccounts, useFriends } from '../lib/db/hooks';
import { AccountSwitcher } from '../components/vault/AccountSwitcher';
import { QRModal } from '../components/dashboard/QRModal';
import { ScanView } from '../components/dashboard/ScanView';
import { ManageView } from '../components/vault/ManageView';
import { TimeSyncChip } from '../components/dashboard/TimeSyncChip';
import { PageHeader } from '../components/ui/PageHeader';
import { Tabs } from '../components/ui/Tabs';
import { OnboardingTour } from '../components/onboarding/OnboardingTour';
import { useOnboarding } from '../lib/onboarding/useOnboarding';
import { downloadFriendsZip } from '../lib/qr/zip';
import { useTranslation } from '../lib/i18n/I18nContext';
import type { FriendDoc } from '../lib/db/types';

type FriendWithId = FriendDoc & { id: string };

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const uid = user?.uid ?? null;
  const { accounts, reload: reloadAccounts } = useAccounts(uid);
  // Derive the active account during render — fall back to the first account —
  // so there's no effect-driven flash before a selection exists.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const currentId = selectedId ?? accounts[0]?.id ?? null;
  const { friends, reload: reloadFriends } = useFriends(uid, currentId);
  const [expanded, setExpanded] = useState<FriendWithId | null>(null);
  const [zipping, setZipping] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'manage' ? 'manage' : 'scan';
  const setTab = (id: string) =>
    setSearchParams(id === 'scan' ? {} : { tab: id }, { replace: true });

  // First-run guided tour. Each step lives on a different tab, so the page drives the
  // tab as the tour advances; the tour itself just spotlights the anchored element.
  const tourSteps = [
    { anchor: 'add-code', title: t('onboarding.step1.title'), body: t('onboarding.step1.body'), tab: 'manage' },
    { anchor: 'scan', title: t('onboarding.step2.title'), body: t('onboarding.step2.body'), tab: 'scan' },
  ];
  const tour = useOnboarding(tourSteps.length);
  useEffect(() => {
    if (tour.active) setTab(tourSteps[tour.step].tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.active, tour.step]);

  async function handleDownloadAll() {
    if (friends.length === 0) return;
    setZipping(true);
    try {
      await downloadFriendsZip(friends);
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title={t('shell.codes')}
        subtitle={t('dashboard.subtitle')}
        right={
          <AccountSwitcher
            uid={uid}
            accounts={accounts}
            currentId={currentId}
            onSelect={setSelectedId}
            onChanged={reloadAccounts}
          />
        }
      />

      <TimeSyncChip />

      <Tabs
        tabs={[
          { id: 'scan', label: t('codes.tabScan') },
          { id: 'manage', label: t('codes.tabManage') },
        ]}
        current={tab}
        onChange={setTab}
      />

      {tab === 'scan' ? (
        <ScanView
          friends={friends}
          onExpand={setExpanded}
          onDownloadAll={handleDownloadAll}
          zipping={zipping}
          onGoManage={() => setTab('manage')}
        />
      ) : (
        <ManageView
          uid={uid}
          accounts={accounts}
          currentId={currentId}
          friends={friends}
          onChanged={reloadFriends}
        />
      )}

      {expanded && (
        <QRModal name={expanded.name} friendCode={expanded.friendCode} onClose={() => setExpanded(null)} />
      )}

      {tour.active && (
        <OnboardingTour
          steps={tourSteps.map(({ anchor, title, body }) => ({ anchor, title, body }))}
          step={tour.step}
          onNext={tour.next}
          onSkip={tour.skip}
        />
      )}
    </div>
  );
}
