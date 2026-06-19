import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * Titled, collapsible help block — closed by default. Used to tuck the long
 * onboarding / how-to copy out of the way so functional content leads.
 */
export function CollapsibleHelp({ title, icon, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur-sm overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-display font-semibold uppercase tracking-wider text-muted hover:text-text transition-colors cursor-pointer"
      >
        {icon}
        <span>{title}</span>
        <ChevronDown
          size={15}
          className={cn('ml-auto transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 text-xs text-muted leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
