import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isValid?: boolean;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, isValid, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-corporate-700 tracking-wide uppercase">
            {label} {props.required && <span className="text-blush-500">*</span>}
          </label>
        )}
        <div className="relative rounded-xl">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'flex h-11 w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-corporate-900 shadow-sm transition-all duration-200 placeholder:text-corporate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                : isValid
                ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100 pr-10'
                : 'border-corporate-200 focus:border-blush-400 focus:ring-blush-100 hover:border-corporate-300',
              className
            )}
            {...props}
          />
          {isValid && !error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-corporate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isValid?: boolean;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, isValid, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-corporate-700 tracking-wide uppercase">
            {label} {props.required && <span className="text-blush-500">*</span>}
          </label>
        )}
        <div className="relative rounded-xl">
          <textarea
            id={inputId}
            ref={ref}
            className={cn(
              'flex min-h-[100px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-corporate-900 shadow-sm transition-all duration-200 placeholder:text-corporate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                : isValid
                ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100'
                : 'border-corporate-200 focus:border-blush-400 focus:ring-blush-100 hover:border-corporate-300',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-corporate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

