import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorColor?: string;
  showValue?: boolean;
}

export function Progress({
  value,
  className,
  indicatorColor = 'bg-gradient-to-r from-blush-400 to-blush-500',
  showValue = false,
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full space-y-1">
      {showValue && (
        <div className="flex justify-between text-xs font-semibold text-corporate-600">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-corporate-100',
          className
        )}
        {...props}
      >
        <div
          className={cn('h-full w-full flex-1 transition-all duration-500 ease-out rounded-full', indicatorColor)}
          style={{ transform: `translateX(-${100 - clampedValue}%)` }}
        />
      </div>
    </div>
  );
}

