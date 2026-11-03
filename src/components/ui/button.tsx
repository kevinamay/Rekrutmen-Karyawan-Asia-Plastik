import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'blushSubtle' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-gradient-to-r from-blush-600 to-blush-500 hover:from-blush-700 hover:to-blush-600 text-white shadow-blush shadow-sm hover:shadow-md',
      secondary:
        'bg-corporate-900 hover:bg-corporate-800 text-white shadow-sm hover:shadow',
      outline:
        'border border-corporate-200 bg-white hover:bg-blush-50/60 text-corporate-800 hover:border-blush-200 hover:text-blush-700',
      ghost:
        'text-corporate-600 hover:text-blush-600 hover:bg-blush-50/70',
      blushSubtle:
        'bg-blush-50 hover:bg-blush-100/80 text-blush-700 border border-blush-200/60 font-semibold',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

