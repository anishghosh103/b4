'use client';

import { cn } from '@/lib/utils';

interface PlatformLogoProps {
  name: string;
  color: 'violet' | 'yellow' | 'emerald' | 'zinc' | 'lime' | 'red' | 'blue';
  className?: string;
}

const colorMap = {
  violet: {
    dot: 'bg-violet-500',
    border: 'hover:border-violet-500/50',
    glow: 'hover:shadow-violet-500/10',
  },
  yellow: {
    dot: 'bg-yellow-500',
    border: 'hover:border-yellow-500/50',
    glow: 'hover:shadow-yellow-500/10',
  },
  emerald: {
    dot: 'bg-emerald-500',
    border: 'hover:border-emerald-500/50',
    glow: 'hover:shadow-emerald-500/10',
  },
  zinc: {
    dot: 'bg-zinc-400',
    border: 'hover:border-zinc-400/50',
    glow: 'hover:shadow-zinc-400/10',
  },
  lime: {
    dot: 'bg-lime-500',
    border: 'hover:border-lime-500/50',
    glow: 'hover:shadow-lime-500/10',
  },
  red: {
    dot: 'bg-red-500',
    border: 'hover:border-red-500/50',
    glow: 'hover:shadow-red-500/10',
  },
  blue: {
    dot: 'bg-blue-500',
    border: 'hover:border-blue-500/50',
    glow: 'hover:shadow-blue-500/10',
  },
};

export function PlatformLogo({ name, color, className }: PlatformLogoProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        'group flex items-center gap-2.5 px-4 py-2.5 rounded-full',
        'bg-surface/50 backdrop-blur-sm border border-border',
        'transition-all duration-300 cursor-default',
        'hover:bg-surface-elevated hover:shadow-lg',
        colors.border,
        colors.glow,
        className
      )}
    >
      <div
        className={cn(
          'w-2.5 h-2.5 rounded-full transition-transform duration-300',
          'group-hover:scale-110',
          colors.dot
        )}
      />
      <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">
        {name}
      </span>
    </div>
  );
}
