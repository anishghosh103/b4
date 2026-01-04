/**
 * Subscription Service
 *
 * Handles user tier determination and subscription limit enforcement.
 * This is the single point of access for all subscription-related logic.
 */

import { Types } from 'mongoose';
import {
  LimitKey,
  PricingTier,
  TIER_LIMITS,
  isUnlimited,
} from '../constants/pricing';
import Event from '../models/Event';
import Payment from '../models/Payment';
import Webhook from '../models/Webhook';
import WorkflowUsage from '../models/WorkflowUsage';

// Event check status
export type EventCheckStatus = 'ok' | 'grace_period' | 'rejected';

// Result of a limit check
export interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
  tier: PricingTier;
}

// Result of an event limit check (includes grace period info)
export interface EventCheckResult extends LimitCheckResult {
  status: EventCheckStatus;
  graceInfo?: {
    overBy: number;
    graceEventsRemaining: number;
    graceDaysRemaining: number;
  };
}

// Full usage snapshot for dashboard
export interface UsageSnapshot {
  tier: PricingTier;
  webhooks: LimitCheckResult;
  eventsThisMonth: EventCheckResult;
  mockWorkflows: LimitCheckResult;
  eventRetentionDays: number;
}

/**
 * Get user's current tier from most recent completed payment.
 * Defaults to 'free' if no payment found.
 */
export async function getUserTier(
  userId: Types.ObjectId | string
): Promise<PricingTier> {
  const payment = await Payment.findOne({
    user: userId,
    status: 'completed',
  })
    .sort({ createdAt: -1 })
    .select('tier')
    .lean();

  return (payment?.tier as PricingTier) || 'free';
}

/**
 * Get all limits for a tier
 */
export function getLimits(tier: PricingTier) {
  return TIER_LIMITS[tier];
}

/**
 * Get a specific limit value for a tier
 */
export function getLimit(tier: PricingTier, limitKey: LimitKey): number {
  return TIER_LIMITS[tier][limitKey] as number;
}

/**
 * Check if user can create a new webhook
 */
export async function canCreateWebhook(
  userId: Types.ObjectId | string
): Promise<LimitCheckResult> {
  const [tier, webhookCount] = await Promise.all([
    getUserTier(userId),
    Webhook.countDocuments({ userId }),
  ]);

  const limit = getLimit(tier, 'maxWebhooks');
  const unlimited = isUnlimited(limit);

  return {
    allowed: unlimited || webhookCount < limit,
    current: webhookCount,
    limit,
    remaining: unlimited ? Infinity : Math.max(0, limit - webhookCount),
    isUnlimited: unlimited,
    tier,
  };
}

/**
 * Get start of current month (UTC)
 */
function getStartOfMonth(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/**
 * Get current month string in YYYY-MM format
 */
function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(
    2,
    '0'
  )}`;
}

/**
 * Calculate days since a date
 */
function daysSince(date: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get all webhook IDs for a user
 */
async function getUserWebhookIds(
  userId: Types.ObjectId | string
): Promise<Types.ObjectId[]> {
  const webhooks = await Webhook.find({ userId }).select('_id').lean();
  return webhooks.map((w) => w._id as Types.ObjectId);
}

/**
 * Count events this month for a user
 */
async function countEventsThisMonth(
  userId: Types.ObjectId | string
): Promise<number> {
  const startOfMonth = getStartOfMonth();
  return Event.countDocuments({
    createdAt: { $gte: startOfMonth },
    user: userId,
  });
}

/**
 * Get the first over-quota event this month (for grace period calculation)
 */
async function getFirstOverQuotaEvent(
  webhookIds: Types.ObjectId[]
): Promise<Date | null> {
  if (webhookIds.length === 0) return null;

  const startOfMonth = getStartOfMonth();
  const event = await Event.findOne({
    webhook: { $in: webhookIds },
    overQuota: true,
    createdAt: { $gte: startOfMonth },
  })
    .sort({ createdAt: 1 })
    .select('createdAt')
    .lean<{ createdAt: Date } | null>();

  return event?.createdAt || null;
}

/**
 * Check if user can receive more events this month.
 * Includes grace period logic for free tier.
 */
export async function canReceiveEvent(
  userId: Types.ObjectId | string
): Promise<EventCheckResult> {
  const tier = await getUserTier(userId);
  const limit = getLimit(tier, 'maxEventsPerMonth');

  // Pro tier has unlimited events
  if (isUnlimited(limit)) {
    return {
      allowed: true,
      current: 0,
      limit,
      remaining: Infinity,
      isUnlimited: true,
      tier,
      status: 'ok',
    };
  }

  // Get user's webhooks and count events
  const [webhookIds, eventCount] = await Promise.all([
    getUserWebhookIds(userId),
    countEventsThisMonth(userId),
  ]);

  // Under limit - all good
  if (eventCount < limit) {
    return {
      allowed: true,
      current: eventCount,
      limit,
      remaining: limit - eventCount,
      isUnlimited: false,
      tier,
      status: 'ok',
    };
  }

  // Over limit - check grace period
  const grace = TIER_LIMITS[tier].eventGracePeriod;
  if (!grace) {
    // No grace period configured (shouldn't happen for free)
    return {
      allowed: false,
      current: eventCount,
      limit,
      remaining: 0,
      isUnlimited: false,
      tier,
      status: 'rejected',
    };
  }

  const overBy = eventCount - limit;
  const firstOverQuotaDate = await getFirstOverQuotaEvent(webhookIds);
  const daysSinceGrace = firstOverQuotaDate ? daysSince(firstOverQuotaDate) : 0;

  // Check if grace period is exhausted
  if (overBy >= grace.extraEvents || daysSinceGrace >= grace.days) {
    return {
      allowed: false,
      current: eventCount,
      limit,
      remaining: 0,
      isUnlimited: false,
      tier,
      status: 'rejected',
      graceInfo: {
        overBy,
        graceEventsRemaining: Math.max(0, grace.extraEvents - overBy),
        graceDaysRemaining: Math.max(0, grace.days - daysSinceGrace),
      },
    };
  }

  // Within grace period - accept but flag
  return {
    allowed: true,
    current: eventCount,
    limit,
    remaining: 0,
    isUnlimited: false,
    tier,
    status: 'grace_period',
    graceInfo: {
      overBy,
      graceEventsRemaining: grace.extraEvents - overBy,
      graceDaysRemaining: Math.max(0, grace.days - daysSinceGrace),
    },
  };
}

/**
 * Get user's event retention period in days
 */
export async function getEventRetentionDays(
  userId: Types.ObjectId | string
): Promise<number> {
  const tier = await getUserTier(userId);
  return getLimit(tier, 'eventRetentionDays');
}

/**
 * Get workflow usage count for current month
 */
export async function getWorkflowUsageThisMonth(
  userId: Types.ObjectId | string
): Promise<number> {
  const month = getCurrentMonth();
  const usage = await WorkflowUsage.findOne({ userId, month }).lean();
  return usage?.count || 0;
}

/**
 * Check if user can trigger a workflow
 */
export async function canTriggerWorkflow(
  userId: Types.ObjectId | string
): Promise<LimitCheckResult> {
  const [tier, currentCount] = await Promise.all([
    getUserTier(userId),
    getWorkflowUsageThisMonth(userId),
  ]);
  const limit = getLimit(tier, 'maxMockWorkflows');
  console.log(userId, tier, currentCount, limit);
  const unlimited = isUnlimited(limit);

  return {
    allowed: unlimited || currentCount < limit,
    current: currentCount,
    limit,
    remaining: unlimited ? Infinity : Math.max(0, limit - currentCount),
    isUnlimited: unlimited,
    tier,
  };
}

/**
 * Increment workflow usage for current month
 */
export async function incrementWorkflowUsage(
  userId: Types.ObjectId | string
): Promise<void> {
  const month = getCurrentMonth();
  await WorkflowUsage.findOneAndUpdate(
    { userId, month },
    { $inc: { count: 1 } },
    { upsert: true }
  );
}

/**
 * Get complete usage snapshot for a user (for dashboard display).
 * Optimized to minimize database queries.
 */
export async function getUserUsageSnapshot(
  userId: Types.ObjectId | string
): Promise<UsageSnapshot> {
  const tier = await getUserTier(userId);
  const limits = TIER_LIMITS[tier];

  // Get user's webhooks
  const webhookIds = await getUserWebhookIds(userId);
  const webhookCount = webhookIds.length;

  // Count events this month (skip if unlimited)
  let eventCount = 0;
  let eventStatus: EventCheckStatus = 'ok';
  let graceInfo: EventCheckResult['graceInfo'];

  if (!isUnlimited(limits.maxEventsPerMonth)) {
    eventCount = await countEventsThisMonth(userId);

    if (eventCount >= limits.maxEventsPerMonth && limits.eventGracePeriod) {
      const overBy = eventCount - limits.maxEventsPerMonth;
      const firstOverQuotaDate = await getFirstOverQuotaEvent(webhookIds);
      const daysSinceGrace = firstOverQuotaDate
        ? daysSince(firstOverQuotaDate)
        : 0;

      if (
        overBy >= limits.eventGracePeriod.extraEvents ||
        daysSinceGrace >= limits.eventGracePeriod.days
      ) {
        eventStatus = 'rejected';
      } else if (overBy > 0) {
        eventStatus = 'grace_period';
      }

      graceInfo = {
        overBy,
        graceEventsRemaining: Math.max(
          0,
          limits.eventGracePeriod.extraEvents - overBy
        ),
        graceDaysRemaining: Math.max(
          0,
          limits.eventGracePeriod.days - daysSinceGrace
        ),
      };
    }
  }

  // Get workflow usage count for this month
  const mockWorkflowCount = await getWorkflowUsageThisMonth(userId);

  return {
    tier,
    webhooks: {
      allowed:
        isUnlimited(limits.maxWebhooks) || webhookCount < limits.maxWebhooks,
      current: webhookCount,
      limit: limits.maxWebhooks,
      remaining: isUnlimited(limits.maxWebhooks)
        ? Infinity
        : Math.max(0, limits.maxWebhooks - webhookCount),
      isUnlimited: isUnlimited(limits.maxWebhooks),
      tier,
    },
    eventsThisMonth: {
      allowed:
        isUnlimited(limits.maxEventsPerMonth) ||
        eventCount < limits.maxEventsPerMonth ||
        eventStatus === 'grace_period',
      current: eventCount,
      limit: limits.maxEventsPerMonth,
      remaining: isUnlimited(limits.maxEventsPerMonth)
        ? Infinity
        : Math.max(0, limits.maxEventsPerMonth - eventCount),
      isUnlimited: isUnlimited(limits.maxEventsPerMonth),
      tier,
      status: eventStatus,
      graceInfo,
    },
    mockWorkflows: {
      allowed:
        isUnlimited(limits.maxMockWorkflows) ||
        mockWorkflowCount < limits.maxMockWorkflows,
      current: mockWorkflowCount,
      limit: limits.maxMockWorkflows,
      remaining: isUnlimited(limits.maxMockWorkflows)
        ? Infinity
        : Math.max(0, limits.maxMockWorkflows - mockWorkflowCount),
      isUnlimited: isUnlimited(limits.maxMockWorkflows),
      tier,
    },
    eventRetentionDays: limits.eventRetentionDays,
  };
}
