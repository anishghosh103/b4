'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Platform } from '@/lib/platforms/types';
import { cn, formatRelativeTime } from '@/lib/utils';
import JsonView from '@uiw/react-json-view';
import { githubDarkTheme as jsonViewDarkTheme } from '@uiw/react-json-view/githubDark';
import { githubLightTheme as jsonViewLightTheme } from '@uiw/react-json-view/githubLight';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CollapsibleSection } from './collapsible-section';

export interface EventData {
  _id: string;
  name?: string;
  platform?: Platform;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  payload?: unknown;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  responseStatus: number;
  responseBody?: unknown;
  verified?: boolean;
  verificationError?: string | null;
  normalizedPayload?: unknown;
  overQuota?: boolean;
  createdAt: string;
}

interface EventDetailPanelProps {
  event: EventData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const methodColors: Record<string, string> = {
  POST: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-400/50',
  GET: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-400 dark:border-blue-400/50',
  PUT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400 dark:border-amber-400/50',
  PATCH:
    'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-400 dark:border-orange-400/50',
  DELETE:
    'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-400 dark:border-red-400/50',
};

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-400/50';
  }
  if (status >= 400 && status < 500) {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400 dark:border-amber-400/50';
  }
  if (status >= 500) {
    return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-400 dark:border-red-400/50';
  }
  return 'bg-zinc-500/10 text-zinc-600 border border-zinc-400 dark:border-zinc-400/50';
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
}: EventDetailPanelProps) {
  const [jsonViewTheme, setJsonViewTheme] = useState(jsonViewDarkTheme);
  const [view, setView] = useState<'request' | 'response'>('request');
  const platform = event?.platform || 'custom';
  const eventName = event?.name || 'Event';

  useEffect(() => {
    setJsonViewTheme({
      ...(document.documentElement.classList.contains('dark')
        ? jsonViewDarkTheme
        : jsonViewLightTheme),
      backgroundColor: 'transparent!important',
    });
  }, [open]);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="flex flex-col p-0 gap-0 sm:max-w-2xl w-3xl">
        {!event ? null : (
          <>
            {/* Header */}
            <SheetHeader className="border-b border-border px-6 py-4 pr-12">
              <SheetTitle className="flex items-center gap-4">
                <span className="inline-flex font-mono text-base truncate leading-none">
                  {eventName}
                </span>
              </SheetTitle>
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
                        getStatusColor(event.responseStatus)
                      )}
                    >
                      Status: {event.responseStatus}
                    </span>
                    {event.verified !== undefined && (
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
                  {hasContent(event.normalizedPayload) && (
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
                  )}

                  {/* Original Payload */}
                  {hasContent(event.payload) && (
                    <CollapsibleSection title="Original Payload">
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
                  {/* Response */}
                  {hasContent(event.responseBody) && (
                    <CollapsibleSection
                      title="Response Sent"
                      defaultOpen
                    >
                      <div className="max-h-100 overflow-auto p-4">
                        <JsonView
                          value={event.responseBody as any}
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
