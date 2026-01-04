'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getStatusCode, getStatusColor } from '@/lib/events';
import { IEvent } from '@/lib/models/Event';
import { Platform } from '@/lib/platforms/types';
import { cn } from '@/lib/utils';
import { Check, Globe, Loader2, Repeat, Terminal, X } from 'lucide-react';
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
interface WebhookConfig {
  destinationUrl: string | null;
  cliEnabled: boolean;
}

interface DashboardEventProps {
  event: IEvent;
  name: string;
  platform: Platform;
  time: string;
  status: 'success' | 'error';
  onClick?: () => void;
  webhookId?: string;
  webhookConfig?: WebhookConfig;
  onReplayComplete?: (updatedEvent: IEvent) => void;
}

export function DashboardEvent({
  event,
  name,
  platform,
  time,
  status,
  onClick,
  webhookId,
  webhookConfig,
  onReplayComplete,
}: DashboardEventProps) {
  const [replayOpen, setReplayOpen] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStatus, setReplayStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const canReplayToUrl = !!webhookConfig?.destinationUrl;
  const canReplayToCli = !!webhookConfig?.cliEnabled;
  const hasAnyDestination = canReplayToUrl || canReplayToCli;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const handleReplay = async (destinations: {
    url?: boolean;
    cli?: boolean;
  }) => {
    if (!webhookId) return;

    setIsReplaying(true);
    setReplayStatus('idle');

    try {
      const response = await fetch(
        `/api/webhooks/${webhookId}/events/${event._id}/replay`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destinations }),
        }
      );

      if (!response.ok) throw new Error('Replay failed');

      const data = await response.json();
      setReplayStatus('success');
      onReplayComplete?.(data.event);

      // Reset after 2 seconds
      setTimeout(() => setReplayStatus('idle'), 2000);
    } catch (error) {
      setReplayStatus('error');
      setTimeout(() => setReplayStatus('idle'), 3000);
    } finally {
      setIsReplaying(false);
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-4 px-4 py-3.5 rounded-xl',
        'bg-surface-elevated/50 border border-border',
        'hover:bg-surface-elevated hover:border-muted/30 dark:hover:border-accent/50',
        'transition-all duration-200 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
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
        {name}
      </span>

      {/* Platform badge */}
      <span
        className={cn(
          'text-xs font-medium px-2.5 py-1 rounded-full',
          getStatusColor(event)
        )}
      >
        {getStatusCode(event)}
      </span>

      {/* Time */}
      <span className="text-xs text-muted w-16 text-right">{time}</span>

      {/* Replay button/dropdown */}
      {hasAnyDestination && webhookId ? (
        <DropdownMenu
          open={replayOpen}
          onOpenChange={setReplayOpen}
          modal={false}
        >
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              disabled={isReplaying}
              className={cn(
                'text-xs text-accent px-3 py-1.5 rounded-lg',
                'bg-accent/0 hover:bg-accent/10',
                'opacity-0 group-hover:opacity-100',
                'transition-all duration-200',
                'flex items-center gap-1.5',
                (replayOpen || isReplaying || replayStatus !== 'idle') &&
                  'opacity-100'
              )}
            >
              {isReplaying ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : replayStatus === 'success' ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : replayStatus === 'error' ? (
                <X className="w-3 h-3 text-red-500" />
              ) : (
                'Replay'
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs">
              Replay to...
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {canReplayToUrl && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleReplay({ url: true });
                }}
              >
                <Globe className="w-4 h-4 mr-2" />
                Production URL
              </DropdownMenuItem>
            )}
            {canReplayToCli && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleReplay({ cli: true });
                }}
              >
                <Terminal className="w-4 h-4 mr-2" />
                CLI
              </DropdownMenuItem>
            )}
            {canReplayToUrl && canReplayToCli && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReplay({ url: true, cli: true });
                  }}
                >
                  <Repeat className="w-4 h-4 mr-2" />
                  Both Destinations
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button
          className={cn(
            'text-xs text-muted px-3 py-1.5 rounded-lg',
            'opacity-0 group-hover:opacity-100',
            'transition-all duration-200',
            'cursor-not-allowed'
          )}
          disabled
        >
          Replay
        </button>
      )}
    </div>
  );
}
