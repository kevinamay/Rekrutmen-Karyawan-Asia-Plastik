import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'blueSubtle' | 'danger' | 'blushSubtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-colors',
      secondary:
        'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow',
      outline:
        'border border-slate-200 bg-white hover:bg-blue-50 text-slate-800 hover:border-blue-300 hover:text-blue-700',
      ghost:
        'text-slate-700 hover:text-blue-600 hover:bg-blue-50/70',
      blueSubtle:
        'bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-200/60 font-semibold',
      blushSubtle:
        'bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-200/60 font-semibold',
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
