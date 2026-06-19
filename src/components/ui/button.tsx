import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wider font-display uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-fg hover:bg-primary/95 hover:shadow-[0_6px_18px_-6px_rgba(255,122,0,0.5)]',
        outline: 'border border-border bg-transparent text-text hover:border-primary/45 hover:bg-surface-2/40',
        ghost: 'bg-transparent text-text hover:bg-surface-2/50',
      },
      size: {
        sm: 'h-8 px-3 text-[10px]',
        md: 'h-10 px-4.5 text-xs',
        lg: 'h-12 px-6 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
