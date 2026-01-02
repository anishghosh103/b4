import { getUserUsageSnapshot } from '@/lib/services/subscriptionService';
import { requireAuth } from '@/lib/utils/authHelpers';
import { asyncHandler, successResponse } from '@/lib/utils/controllerHelpers';

/**
 * GET /api/subscription/usage
 * Returns the user's current subscription usage snapshot
 */
export const GET = asyncHandler(
  requireAuth(async (req, user) => {
    const usage = await getUserUsageSnapshot(user._id);
    return successResponse(usage);
  })
);
