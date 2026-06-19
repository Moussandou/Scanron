import { HelpCircle, Shield, Users } from 'lucide-react';
import { FriendsManager } from './FriendsManager';
import { CollapsibleHelp } from '../ui/CollapsibleHelp';
import { SectionLabel } from '../ui/SectionLabel';
import { useTranslation } from '../../lib/i18n/I18nContext';
import type { AccountDoc, FriendDoc } from '../../lib/db/types';

type FriendWithId = FriendDoc & { id: string };

interface Props {
  uid: string | null;
  accounts: (AccountDoc & { id: string })[];
  currentId: string | null;
  friends: FriendWithId[];
  onChanged: () => void;
}

export function ManageView({ uid, accounts, currentId, friends, onChanged }: Props) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr] items-start">
      <div className="space-y-6">
        {currentId ? (
          <FriendsManager uid={uid} accountId={currentId} friends={friends} onChanged={onChanged} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-surface/20 p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-border/40 flex items-center justify-center mx-auto text-primary">
              <Users size={24} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-text">{t('vault.noAccount')}</h3>
              <p className="text-xs text-muted leading-relaxed">{t('vault.noAccountDesc')}</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur-sm p-5 space-y-4">
          <SectionLabel icon={<Shield size={16} className="text-primary" />}>{t('vault.statsTitle')}</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-border/40 bg-surface-2/20 text-center">
              <span className="text-[10px] text-muted block uppercase tracking-wider font-display font-bold">{t('vault.totalAccounts')}</span>
              <span className="text-2xl font-display font-black text-text mt-1 block">{accounts.length}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/40 bg-surface-2/20 text-center">
              <span className="text-[10px] text-muted block uppercase tracking-wider font-display font-bold">{t('vault.activeCodes')}</span>
              <span className="text-2xl font-display font-black text-primary mt-1 block">{friends.length}</span>
            </div>
          </div>
          <div className="text-[10px] text-muted text-center pt-3.5 border-t border-border/20 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {uid ? t('vault.syncActive') : t('vault.syncLocal')}
          </div>
        </div>

        <CollapsibleHelp title={t('vault.howToFind')} icon={<HelpCircle size={15} />}>
          <div className="space-y-3 pt-1">
            <p>{t('vault.howToFindDesc')}</p>
            <ol className="space-y-2 list-decimal pl-4">
              <li>{t('vault.howToFindStep1')}</li>
              <li>{t('vault.howToFindStep2')}</li>
              <li>{t('vault.howToFindStep3')}</li>
              <li>{t('vault.howToFindStep4')}</li>
            </ol>
          </div>
        </CollapsibleHelp>
      </div>
    </div>
  );
}
