import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled';
  inputSize?: 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', inputSize = 'md', ...props }, ref) => {
    const baseStyles = cn(
      'w-full rounded-xl transition-all duration-200',
      'text-foreground placeholder:text-muted',
      'focus:outline-none focus:ring-2 focus:ring-accent/30',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    );

    const variants = {
      default: cn(
        'bg-surface border border-border',
        'hover:border-border/80 focus:border-accent/50'
      ),
      filled: cn(
        'bg-surface-elevated border border-transparent',
        'hover:bg-surface focus:border-accent/50'
      ),
    };

    const sizes = {
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base',
    };

    return (
      <input
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[inputSize], className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
