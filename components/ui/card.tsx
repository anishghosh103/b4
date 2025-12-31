import { cn } from '@/lib/utils';
import { forwardRef, type HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'gradient';
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'default', glow = false, children, ...props },
    ref
  ) => {
    const baseStyles = cn('rounded-2xl border transition-all duration-300');

    const variants = {
      default: cn('bg-surface border-border'),
      elevated: cn(
        'bg-surface-elevated border-border',
        'shadow-lg shadow-black/5 dark:shadow-black/20'
      ),
      interactive: cn(
        'bg-surface border-border',
        'hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5',
        'cursor-pointer'
      ),
      gradient: cn(
        'bg-gradient-to-br from-surface-elevated to-surface border-border',
        'backdrop-blur-xl'
      ),
    };

    const glowStyles = glow
      ? 'shadow-lg shadow-accent/10 border-accent/30'
      : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], glowStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-border', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6', className)}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-border', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardFooter, CardHeader };
