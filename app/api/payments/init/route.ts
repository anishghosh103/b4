import { AppError } from '@/lib/errors/AppError';
import Payment from '@/lib/models/Payment';
import PricingConfig from '@/lib/models/PricingConfig';
import { createCheckoutSession } from '@/lib/services/dodoPaymentsService';
import { requireAuth } from '@/lib/utils/authHelpers';
import { asyncHandler, successResponse } from '@/lib/utils/controllerHelpers';

export const POST = asyncHandler(
  requireAuth(async (request, user) => {
    const { tier, successUrl } = await request.json();

    const pricingConfig = await PricingConfig.findOne({
      tier,
      environment: process.env.DODO_ENVIRONMENT || 'test_mode',
    }).lean();
    if (!pricingConfig) {
      throw new AppError('Invalid pricing configuration provided.');
    }

    const payment = await Payment.create({
      user: user._id,
      status: 'pending',
      tier,
      amount: pricingConfig.amount,
    });

    if (tier === 'free') {
      payment.status = 'completed';
      return successResponse({ status: 'completed' });
    }

    // Create Dodo checkout session
    const checkoutSession = await createCheckoutSession({
      dodoProductId: pricingConfig.dodoProductId,
      user,
      paymentId: payment._id.toString(),
      successUrl,
    });

    // Update payment with Dodo payment ID
    payment.dodoPaymentId = checkoutSession.id;
    await payment.save();

    return successResponse({
      status: 'pending',
      checkoutUrl: checkoutSession.checkoutUrl,
    });
  })
);
