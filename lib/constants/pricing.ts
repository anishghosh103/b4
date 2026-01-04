/**
 * Shared pricing tiers, limits, and benefits used across the application.
 * This is the SINGLE SOURCE OF TRUTH for all subscription limits.
 */

/**
 * Numeric limits for each tier - easily modifiable
 */
export const TIER_LIMITS: Record<
  'free' | 'pro',
  {
    maxWebhooks: number;
    maxEventsPerMonth: number;
    eventRetentionDays: number;
    maxMockWorkflows: number;
    eventGracePeriod?: { extraEvents: number; days: number };
  }
> = {
  free: {
    maxWebhooks: 1,
    maxEventsPerMonth: 1000,
    eventRetentionDays: 7,
    maxMockWorkflows: 3,
  },
  pro: {
    maxWebhooks: Infinity,
    maxEventsPerMonth: Infinity,
    eventRetentionDays: 30,
    maxMockWorkflows: Infinity,
  },
} as const;

export type TierLimits = typeof TIER_LIMITS;
export type LimitKey = keyof TierLimits['free'];
export type PricingTier = keyof typeof TIER_LIMITS;

/**
 * Check if a limit value represents unlimited
 */
export function isUnlimited(value: number): boolean {
  return !Number.isFinite(value);
}

/**
 * Format limit for display (handles Infinity)
 */
export function formatLimit(value: number): string {
  return isUnlimited(value) ? 'Unlimited' : value.toLocaleString();
}

/**
 * Display information for each tier (derived from TIER_LIMITS where applicable)
 */
export const PRICING_TIERS = {
  free: {
    name: 'Free',
    description: 'Perfect for side projects and learning',
    features: [
      `${TIER_LIMITS.free.maxWebhooks} permanent webhook URL`,
      `${TIER_LIMITS.free.maxEventsPerMonth.toLocaleString()} events / month`,
      `${TIER_LIMITS.free.eventRetentionDays}-day event history`,
      'CLI localhost relay',
      `${TIER_LIMITS.free.maxMockWorkflows} mock workflows`,
    ],
  },
  pro: {
    name: 'Pro',
    description: 'For professional developers and teams',
    features: [
      'Unlimited webhook URLs',
      'Unlimited events',
      `${TIER_LIMITS.pro.eventRetentionDays}-day event history`,
      'Priority localhost relay',
      'All mock workflows',
      'Team collaboration',
      'Webhook signature verification',
    ],
  },
} as const;
