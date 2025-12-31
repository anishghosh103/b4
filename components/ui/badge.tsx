import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

function Badge({
  className,
  variant = 'default',
  size = 'md',
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles = cn(
    'inline-flex items-center gap-2 font-medium rounded-full transition-colors'
  );

  const variants = {
    default: 'bg-surface-elevated text-foreground border border-border',
    accent: 'bg-accent/10 text-accent border border-accent/20',
    success:
      'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {pulse && (
        <span
          className={cn(
            'w-2 h-2 rounded-full animate-pulse',
            variant === 'success' && 'bg-emerald-400',
            variant === 'accent' && 'bg-accent',
            variant === 'warning' && 'bg-amber-400',
            variant === 'error' && 'bg-red-400',
            variant === 'default' && 'bg-foreground'
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge };
