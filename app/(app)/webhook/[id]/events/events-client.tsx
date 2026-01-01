'use client';

import { DashboardEvent } from '@/components/features';
import { formatRelativeTime } from '@/lib/utils';
import { Inbox } from 'lucide-react';

type Platform = 'stripe' | 'github' | 'docusign' | 'dodo' | 'unknown';

interface EventData {
  _id: string;
  name?: string;
  platform?: Platform;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  payload?: any;
  responseStatus: number;
  createdAt: string;
}

function getEventDisplayName(event: EventData): string {
  // If we have an event name, use it
  if (event.name) return event.name;

  // For unknown platforms, show truncated payload
  if (event.platform === 'unknown' && event.payload) {
    const str = typeof event.payload === 'string'
      ? event.payload
      : JSON.stringify(event.payload);
    if (str && str !== '{}' && str !== '[]' && str !== 'null') {
      return str.length > 50 ? str.substring(0, 50) + '...' : str;
    }
  }

  // Fallback to method
  return event.method;
}

interface EventsClientProps {
  webhookId: string;
  initialEvents: EventData[];
}

export function EventsClient({
  initialEvents,
}: EventsClientProps) {
  if (initialEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <Inbox className="w-6 h-6 text-muted" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No events yet
        </h3>
        <p className="text-sm text-muted max-w-sm">
          Events will appear here when your webhook receives requests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Events</h2>
      </div>

      <div className="space-y-2">
        {initialEvents.map((event) => (
          <DashboardEvent
            key={event._id}
            event={getEventDisplayName(event)}
            platform={event.platform || 'unknown'}
            time={formatRelativeTime(event.createdAt)}
            status={event.responseStatus < 400 ? 'success' : 'error'}
          />
        ))}
      </div>
    </div>
  );
}
