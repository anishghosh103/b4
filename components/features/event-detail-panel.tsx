'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { getStatusCode, getStatusColor, methodColors } from '@/lib/events';
import { IEvent } from '@/lib/models/Event';
import { cn, formatRelativeTime } from '@/lib/utils';
import JsonView from '@uiw/react-json-view';
import { githubDarkTheme as jsonViewDarkTheme } from '@uiw/react-json-view/githubDark';
import { githubLightTheme as jsonViewLightTheme } from '@uiw/react-json-view/githubLight';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Globe,
  Loader2,
  Repeat,
  Terminal,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CollapsibleSection } from './collapsible-section';

interface WebhookConfig {
  destinationUrl: string | null;
  cliEnabled: boolean;
}

interface EventDetailPanelProps {
  event: IEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webhookId?: string;
  webhookConfig?: WebhookConfig;
  onEventUpdate?: (event: IEvent) => void;
}

function stringify(data: unknown): string {
  if (data === undefined || data === null) return '';
  return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

function hasContent(data: unknown): boolean {
  if (data === undefined || data === null) return false;
  if (typeof data === 'object' && Object.keys(data as object).length === 0)
    return false;
  return !!data;
}

export function EventDetailPanel({
  event,
  open,
  onOpenChange,
  webhookId,
  webhookConfig,
  onEventUpdate,
}: EventDetailPanelProps) {
  const [jsonViewTheme, setJsonViewTheme] = useState(jsonViewDarkTheme);
  const [view, setView] = useState<'request' | 'response'>('request');
  const [isReplaying, setIsReplaying] = useState<'url' | 'cli' | 'both' | null>(
    null
  );
  const [replayResult, setReplayResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const platform = event?.platform || 'custom';
  const eventName = event?.name || 'Event';

  const canReplayToUrl = !!webhookConfig?.destinationUrl;
  const canReplayToCli = !!webhookConfig?.cliEnabled;
  const hasAnyDestination = canReplayToUrl || canReplayToCli;

  useEffect(() => {
    setJsonViewTheme({
      ...(document.documentElement.classList.contains('dark')
        ? jsonViewDarkTheme
        : jsonViewLightTheme),
      backgroundColor: 'transparent!important',
    });
  }, [open]);

  const handleReplay = async (destinations: { url?: boolean; cli?: boolean }) => {
    if (!event || !webhookId) return;

    const replayType =
      destinations.url && destinations.cli
        ? 'both'
        : destinations.url
          ? 'url'
          : 'cli';

    setIsReplaying(replayType);
    setReplayResult(null);

    try {
      const response = await fetch(
        `/api/webhooks/${webhookId}/events/${event._id}/replay`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destinations }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Replay failed');
      }

      const data = await response.json();
      setReplayResult({ type: 'success', message: 'Event replayed successfully' });
      onEventUpdate?.(data.event);

      setTimeout(() => setReplayResult(null), 3000);
    } catch (error) {
      setReplayResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Replay failed',
      });
    } finally {
      setIsReplaying(null);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="flex flex-col p-0 gap-0 max-w-full sm:max-w-2xl w-full sm:w-3xl">
        {!event ? null : (
          <>
            {/* Header */}
            <SheetHeader className="border-b border-border px-6 py-4 pr-12">
              <SheetTitle className="flex items-center gap-4">
                <span className="inline-flex font-mono text-base truncate leading-none">
                  {eventName}
                </span>
              </SheetTitle>

              {/* Replay Actions */}
              {hasAnyDestination && webhookId && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-muted">Replay to:</span>
                  {canReplayToUrl && (
                    <button
                      onClick={() => handleReplay({ url: true })}
                      disabled={isReplaying !== null}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md',
                        'bg-muted/10 hover:bg-muted/20 border border-border',
                        'transition-colors duration-150',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {isReplaying === 'url' ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Globe className="size-3" />
                      )}
                      URL
                    </button>
                  )}
                  {canReplayToCli && (
                    <button
                      onClick={() => handleReplay({ cli: true })}
                      disabled={isReplaying !== null}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md',
                        'bg-muted/10 hover:bg-muted/20 border border-border',
                        'transition-colors duration-150',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {isReplaying === 'cli' ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Terminal className="size-3" />
                      )}
                      CLI
                    </button>
                  )}
                  {canReplayToUrl && canReplayToCli && (
                    <button
                      onClick={() => handleReplay({ url: true, cli: true })}
                      disabled={isReplaying !== null}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md',
                        'bg-muted/10 hover:bg-muted/20 border border-border',
                        'transition-colors duration-150',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {isReplaying === 'both' ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Repeat className="size-3" />
                      )}
                      Both
                    </button>
                  )}
                </div>
              )}

              {/* Replay Result Feedback */}
              {replayResult && (
                <p
                  className={cn(
                    'text-xs mt-2 flex items-center gap-1',
                    replayResult.type === 'success'
                      ? 'text-emerald-500'
                      : 'text-red-500'
                  )}
                >
                  {replayResult.type === 'success' ? (
                    <Check className="size-3" />
                  ) : (
                    <AlertCircle className="size-3" />
                  )}
                  {replayResult.message}
                </p>
              )}
            </SheetHeader>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Status Overview */}
              <div className="px-4 py-4 border-b border-border">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        'text-xs font-medium px-2.5 py-1 rounded-full',
                        methodColors[event.method]
                      )}
                    >
                      {event.method}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-medium px-2.5 py-1 rounded-full',
                        getStatusColor(event)
                      )}
                    >
                      Status: {getStatusCode(event)}
                    </span>
                    {event.verified !== undefined &&
                      event.platform !== 'custom' && (
                        <span
                          className={cn(
                            'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
                            event.verified
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-400/50'
                              : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-400 dark:border-red-400/50'
                          )}
                        >
                          {event.verified ? (
                            <>
                              <CheckCircle2 className="size-3.5" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="size-3.5" />
                              Unverified
                            </>
                          )}
                        </span>
                      )}
                    {event.overQuota && (
                      <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="size-3.5" />
                        Over Quota
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted ml-auto">
                    {formatRelativeTime(event.createdAt)}
                  </span>
                </div>
                {event.verificationError && (
                  <p className="bg-red-100/50 border border-red-300 py-2 px-3 text-xs text-red-500 mt-2 rounded-md flex items-start gap-2">
                    <span className="py-0.5">
                      <AlertCircle className="size-3" />
                    </span>
                    {event.verificationError}
                  </p>
                )}
              </div>

              <div className="border-b border-border grid grid-cols-2 divide-x divide-border">
                {[
                  { value: 'request' as const, label: 'Request' },
                  { value: 'response' as const, label: 'Response' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    className={cn(
                      'w-full py-3 text-xs uppercase tracking-widest font-semibold transition-all duration-150',
                      view === tab.value
                        ? 'text-primary bg-muted/10'
                        : 'text-muted/80 hover:text-primary/80'
                    )}
                    onClick={() => setView(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {view === 'request' ? (
                <>
                  {/* Normalized Payload (Collapsible) */}
                  {/* {hasContent(event.normalizedPayload) && (
                    <CollapsibleSection
                      title="Payload"
                      defaultOpen
                    >
                      <div className="max-h-100 overflow-auto p-4">
                        <JsonView
                          value={event.normalizedPayload as any}
                          style={jsonViewTheme}
                          displayDataTypes={false}
                          displayObjectSize={false}
                        ></JsonView>
                      </div>
                    </CollapsibleSection>
                  )} */}

                  {/* Original Payload */}
                  {hasContent(event.payload) && (
                    <CollapsibleSection
                      title="Payload"
                      defaultOpen
                    >
                      <div className="max-h-100 overflow-auto p-4">
                        <JsonView
                          value={event.payload as any}
                          style={jsonViewTheme}
                          displayDataTypes={false}
                          displayObjectSize={false}
                        />
                      </div>
                    </CollapsibleSection>
                  )}

                  {/* Headers (Collapsible) */}
                  {hasContent(event.headers) && (
                    <CollapsibleSection title="Headers">
                      <div className="max-h-100 overflow-auto p-4">
                        <JsonView
                          value={event.headers as any}
                          style={jsonViewTheme}
                          displayDataTypes={false}
                          displayObjectSize={false}
                        />
                      </div>
                    </CollapsibleSection>
                  )}

                  {/* Query Params (Collapsible) */}
                  {hasContent(event.queryParams) && (
                    <CollapsibleSection title="Query Parameters">
                      <div className="max-h-100 overflow-auto p-4">
                        <JsonView
                          value={event.queryParams as any}
                          style={jsonViewTheme}
                          displayDataTypes={false}
                          displayObjectSize={false}
                        />
                      </div>
                    </CollapsibleSection>
                  )}
                </>
              ) : null}

              {view === 'response' ? (
                <>
                  {/* URL Response */}
                  {hasContent(event.urlResponse?.body) && (
                    <CollapsibleSection
                      title="Production URL Response"
                      defaultOpen
                    >
                      <div className="max-h-100 overflow-auto p-4">
                        <JsonView
                          value={event.urlResponse.body as any}
                          style={jsonViewTheme}
                          displayDataTypes={false}
                          displayObjectSize={false}
                        />
                      </div>
                    </CollapsibleSection>
                  )}
                  {/* CLI Response */}
                  {hasContent(event.cliResponse?.body) && (
                    <CollapsibleSection
                      title="CLI Response"
                      defaultOpen
                    >
                      <div className="max-h-100 overflow-auto p-4">
                        <JsonView
                          value={event.cliResponse.body as any}
                          style={jsonViewTheme}
                          displayDataTypes={false}
                          displayObjectSize={false}
                        />
                      </div>
                    </CollapsibleSection>
                  )}
                </>
              ) : null}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
