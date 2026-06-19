import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
}

interface Props {
  tabs: TabItem[];
  current: string;
  onChange: (id: string) => void;
}

/**
 * Controlled tab strip. The parent owns `current` (typically backed by a URL
 * query param) so tabs are deep-linkable. Active tab is the one accented spot.
 */
export function Tabs({ tabs, current, onChange }: Props) {
  return (
    <div role="tablist" className="flex items-center gap-1.5 border-b border-border/10">
      {tabs.map((tab) => {
        const active = tab.id === current;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative -mb-px px-4 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-t-lg border-b-2 transition-all duration-200 cursor-pointer',
              active
                ? 'text-primary border-primary'
                : 'text-muted border-transparent hover:text-text hover:bg-surface-2/40',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
