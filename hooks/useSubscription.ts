'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  UsageSnapshot,
  EventCheckStatus,
} from '@/lib/services/subscriptionService';

interface UseSubscriptionReturn {
  usage: UsageSnapshot | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  canCreateWebhook: () => boolean;
  canReceiveEvents: () => boolean;
  canCreateMockWorkflow: () => boolean;
  getRemainingWebhooks: () => number | 'unlimited';
  getRemainingEvents: () => number | 'unlimited';
  getEventStatus: () => EventCheckStatus | null;
  isInGracePeriod: () => boolean;
}

export function useSubscription(): UseSubscriptionReturn {
  const [usage, setUsage] = useState<UsageSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/subscription/usage');
      if (!response.ok) {
        throw new Error('Failed to fetch usage');
      }

      const data = await response.json();
      setUsage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const canCreateWebhook = useCallback(() => {
    return usage?.webhooks.allowed ?? false;
  }, [usage]);

  const canReceiveEvents = useCallback(() => {
    return usage?.eventsThisMonth.allowed ?? false;
  }, [usage]);

  const canCreateMockWorkflow = useCallback(() => {
    return usage?.mockWorkflows.allowed ?? false;
  }, [usage]);

  const getRemainingWebhooks = useCallback(() => {
    if (!usage) return 0;
    return usage.webhooks.isUnlimited ? 'unlimited' : usage.webhooks.remaining;
  }, [usage]);

  const getRemainingEvents = useCallback(() => {
    if (!usage) return 0;
    return usage.eventsThisMonth.isUnlimited
      ? 'unlimited'
      : usage.eventsThisMonth.remaining;
  }, [usage]);

  const getEventStatus = useCallback((): EventCheckStatus | null => {
    return usage?.eventsThisMonth.status ?? null;
  }, [usage]);

  const isInGracePeriod = useCallback(() => {
    return usage?.eventsThisMonth.status === 'grace_period';
  }, [usage]);

  return {
    usage,
    isLoading,
    error,
    refresh: fetchUsage,
    canCreateWebhook,
    canReceiveEvents,
    canCreateMockWorkflow,
    getRemainingWebhooks,
    getRemainingEvents,
    getEventStatus,
    isInGracePeriod,
  };
}
