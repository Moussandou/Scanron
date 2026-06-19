import { Download, Compass, UserPlus, QrCode } from 'lucide-react';
import { Button } from '../ui/button';
import { CollapsibleHelp } from '../ui/CollapsibleHelp';
import { SectionLabel } from '../ui/SectionLabel';
import { QRCard } from './QRCard';
import { useTranslation } from '../../lib/i18n/I18nContext';
import type { FriendDoc } from '../../lib/db/types';

type FriendWithId = FriendDoc & { id: string };

interface Props {
  friends: FriendWithId[];
  onExpand: (f: FriendWithId) => void;
  onDownloadAll: () => void;
  zipping: boolean;
  onGoManage: () => void;
}

export function ScanView({ friends, onExpand, onDownloadAll, zipping, onGoManage }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {friends.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-surface/20 p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-border/40 flex items-center justify-center mx-auto text-primary">
            <Compass size={24} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-text">{t('dashboard.noFriends')}</h3>
            <p className="text-xs text-muted leading-relaxed">{t('dashboard.noFriendsDesc')}</p>
          </div>
          <Button size="sm" onClick={onGoManage} className="bg-primary hover:bg-primary/95 text-primary-fg font-semibold">
            {t('dashboard.goToVault')}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onDownloadAll} disabled={zipping}>
              <Download size={14} /> {zipping ? 'Zipping...' : 'Download All'}
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {friends.map((f) => (
              <QRCard key={f.id} name={f.name} friendCode={f.friendCode} onExpand={() => onExpand(f)} />
            ))}
          </div>
        </>
      )}

      <CollapsibleHelp title={t('codes.helpScanTitle')}>
        <div className="space-y-5 pt-1">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: <Compass size={16} />, title: t('dashboard.step1.title'), desc: t('dashboard.step1.desc') },
              { icon: <UserPlus size={16} />, title: t('dashboard.step2.title'), desc: t('dashboard.step2.desc') },
              { icon: <QrCode size={16} />, title: t('dashboard.step3.title'), desc: t('dashboard.step3.desc') },
            ].map((step, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/40 bg-surface-2/20 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <h4 className="text-xs font-semibold text-text">{step.title}</h4>
                <p className="text-[11px] text-muted leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-1">
            <SectionLabel>{t('dashboard.manualTitle')}</SectionLabel>
            <p>{t('dashboard.manualP1')}</p>
            <p>{t('dashboard.manualP3')}</p>
            <p>{t('dashboard.manualP4')}</p>
          </div>
        </div>
      </CollapsibleHelp>
    </div>
  );
}
