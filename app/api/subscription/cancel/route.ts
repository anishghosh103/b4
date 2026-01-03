import { AppError } from '@/lib/errors/AppError';
import Payment from '@/lib/models/Payment';
import { cancelSubscription } from '@/lib/services/dodoPaymentsService';
import { requireAuth } from '@/lib/utils/authHelpers';
import { asyncHandler, successResponse } from '@/lib/utils/controllerHelpers';

export const POST = asyncHandler(
  requireAuth(async (request, user) => {
    // Find the user's active pro subscription
    const payment = await Payment.findOne({
      user: user._id,
      status: 'completed',
      tier: 'pro',
      dodoSubscriptionId: { $exists: true, $ne: null },
      cancelAtPeriodEnd: { $ne: true },
    }).sort({ createdAt: -1 });

    if (!payment) {
      throw new AppError('No active subscription found');
    }

    if (!payment.dodoSubscriptionId) {
      throw new AppError('Subscription ID not found');
    }

    // Cancel the subscription at the end of the billing period
    const result = await cancelSubscription(payment.dodoSubscriptionId);

    // Update payment record
    payment.cancelAtPeriodEnd = true;
    if (result.next_billing_date) {
      payment.currentPeriodEnd = new Date(result.next_billing_date);
    }
    await payment.save();

    return successResponse({
      message:
        'Subscription will be cancelled at the end of the billing period',
      currentPeriodEnd: payment.currentPeriodEnd?.toISOString(),
    });
  })
);
