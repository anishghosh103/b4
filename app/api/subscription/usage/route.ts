import { getUserUsageSnapshot } from '@/lib/services/subscriptionService';
import { requireAuth } from '@/lib/utils/authHelpers';
import { asyncHandler } from '@/lib/utils/controllerHelpers';
import { NextResponse } from 'next/server';

/**
 * GET /api/subscription/usage
 * Returns the user's current subscription usage snapshot
 */
export const GET = asyncHandler(
  requireAuth(async (req, user) => {
    const usage = await getUserUsageSnapshot(user._id);
    return NextResponse.json(usage);
  })
);
