import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-surface-2 px-3.5 text-sm text-text transition-all duration-200',
        'placeholder:text-muted/65 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-[0_0_10px_rgba(54,226,123,0.1)]',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
