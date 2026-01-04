import { IEvent } from '../models/Event';

export const methodColors: Record<string, string> = {
  POST: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-400/50',
  GET: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-400 dark:border-blue-400/50',
  PUT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400 dark:border-amber-400/50',
  PATCH:
    'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-400 dark:border-orange-400/50',
  DELETE:
    'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-400 dark:border-red-400/50',
};

export function getStatusColor(event: IEvent): string {
  const status = event.urlResponse?.status || event.cliResponse?.status;
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

export function getStatusCode(event: IEvent) {
  return event.urlResponse?.status || event.cliResponse?.status || 404;
}
