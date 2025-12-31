'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  delay = '',
  className,
}: FeatureCardProps) {
  return (
    <Card
      variant="default"
      className={cn(
        'group p-6 animate-slide-up opacity-0',
        'hover:border-accent/30',
        delay,
        className
      )}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Icon container */}
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center mb-5',
          'bg-accent/10',
          'group-hover:bg-accent/20',
          'transition-colors duration-200'
        )}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2.5 text-foreground">
        {title}
      </h3>

      {/* Description */}
      <p className="text-muted text-sm leading-relaxed">
        {description}
      </p>
    </Card>
  );
}
