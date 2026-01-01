'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface WebhookEventProps {
  delay: number;
  type: 'stripe' | 'docusign' | 'dodo' | 'github';
  event: string;
}

const colorMap = {
  stripe: {
    bg: 'bg-violet-500',
    glow: 'shadow-violet-500/20',
    border: 'border-violet-500/10',
  },
  docusign: {
    bg: 'bg-yellow-500',
    glow: 'shadow-yellow-500/20',
    border: 'border-yellow-500/10',
  },
  dodo: {
    bg: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/10',
  },
  github: {
    bg: 'bg-zinc-400',
    glow: 'shadow-zinc-400/20',
    border: 'border-zinc-400/10',
  },
};

function WebhookEvent({ delay, type, event }: WebhookEventProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const colors = colorMap[type];

  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-4 py-3.5 rounded-xl',
        'bg-surface-elevated/80 backdrop-blur-sm',
        'border transition-all duration-500',
        colors.border,
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
        'hover:bg-surface-elevated hover:border-accent/20',
        'hover:shadow-lg hover:shadow-black/5'
      )}
    >
      {/* Status indicator */}
      <div className="relative">
        <div className={cn('w-2.5 h-2.5 rounded-full', colors.bg)} />
        <div
          className={cn(
            'absolute inset-0 rounded-full animate-ping',
            colors.bg,
            'opacity-30'
          )}
        />
      </div>

      {/* Event name */}
      <span className="font-mono text-xs text-muted truncate max-w-48 group-hover:text-foreground/80 transition-colors">
        {event}
      </span>

      {/* Status badge */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-emerald-500 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-md bg-emerald-500/5 dark:bg-emerald-500/10">
          200
        </span>
        <span className="text-[10px] text-muted uppercase tracking-wider">
          OK
        </span>
      </div>
    </div>
  );
}

export function EventStream() {
  const events: WebhookEventProps[] = [
    { type: 'stripe', delay: 50, event: 'payment_intent.succeeded' },
    { type: 'docusign', delay: 150, event: 'envelope-completed' },
    { type: 'dodo', delay: 250, event: 'payment.succeeded' },
    { type: 'github', delay: 350, event: 'pull_request.opened' },
  ];

  return (
    <div className="space-y-2.5">
      {events.map((e, i) => (
        <WebhookEvent
          key={i}
          delay={e.delay}
          type={e.type}
          event={e.event}
        />
      ))}
    </div>
  );
}

// Dashboard event list item (non-animated version for dashboard)
type Platform = 'stripe' | 'github' | 'docusign' | 'dodo' | 'unknown';

interface DashboardEventProps {
  event: string;
  platform: Platform;
  time: string;
  status: 'success' | 'error';
}

const platformColors: Record<Platform, string> = {
  stripe: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  github: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
  docusign: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  dodo: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  unknown: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
};

const platformLabels: Record<Platform, string> = {
  stripe: 'Stripe',
  github: 'GitHub',
  docusign: 'DocuSign',
  dodo: 'Dodo',
  unknown: 'Unknown',
};

export function DashboardEvent({
  event,
  platform,
  time,
  status,
}: DashboardEventProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-4 px-4 py-3.5 rounded-xl',
        'bg-surface-elevated/50 border border-border',
        'hover:bg-surface-elevated hover:border-accent/20',
        'transition-all duration-200 cursor-pointer'
      )}
    >
      {/* Status dot */}
      <div
        className={cn(
          'w-2.5 h-2.5 rounded-full shrink-0',
          status === 'success' ? 'bg-emerald-400' : 'bg-red-400'
        )}
      />

      {/* Event name */}
      <span className="font-mono text-sm text-foreground flex-1 truncate">
        {event}
      </span>

      {/* Platform badge */}
      <span
        className={cn(
          'text-xs font-medium px-2.5 py-1 rounded-md border',
          platformColors[platform]
        )}
      >
        {platformLabels[platform]}
      </span>

      {/* Time */}
      <span className="text-xs text-muted w-16 text-right">{time}</span>

      {/* Replay button */}
      <button
        className={cn(
          'text-xs text-accent px-3 py-1.5 rounded-lg',
          'bg-accent/0 hover:bg-accent/10',
          'opacity-0 group-hover:opacity-100',
          'transition-all duration-200'
        )}
      >
        Replay
      </button>
    </div>
  );
}
