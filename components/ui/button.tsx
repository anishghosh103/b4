import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'relative inline-flex items-center justify-center font-semibold',
      'rounded-lg transition-colors duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
    );

    const variants = {
      primary: cn('bg-accent text-accent-foreground', 'hover:bg-accent-dim'),
      secondary: cn(
        'bg-surface-elevated text-foreground border border-border',
        'hover:border-accent/50 hover:bg-surface'
      ),
      ghost: cn(
        'bg-transparent text-muted',
        'hover:text-foreground hover:bg-surface-elevated'
      ),
      outline: cn(
        'bg-transparent border border-border text-foreground',
        'hover:border-accent/50 hover:bg-accent/5'
      ),
      success: cn(
        'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20',
        'hover:bg-emerald-500/15 dark:hover:bg-emerald-500/20 hover:border-emerald-500/30'
      ),
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5 [&_svg]:size-2.5',
      md: 'px-5 py-2.5 text-sm gap-2 [&_svg]:size-3.5',
      lg: 'px-8 py-4 text-base gap-2.5 [&_svg]:size-5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        <span
          className={cn(
            'inline-flex items-center justify-center gap-2',
            isLoading ? '[&_svg]:hidden' : ''
          )}
        >
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
