import { WebhookVerificationError } from '@/lib/errors/AppError';
import {
  parseWebhookEvent,
  verifyWebhook,
} from '@/lib/services/dodoPaymentsService';
import { handleWebhookEvent } from '@/lib/services/webhookHandler';
import { asyncHandler } from '@/lib/utils/controllerHelpers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/webhooks/dodo-payments
 * Handle webhook events from Dodo Payments
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  try {
    // Get raw body (needed for signature verification)
    const rawBody = await request.text();

    // Get headers (convert to plain object)
    const headers: Record<string, string | string[] | undefined> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Verify webhook signature
    try {
      verifyWebhook(rawBody, headers);
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse webhook event
    const event = parseWebhookEvent(rawBody);

    console.log('Processing webhook event:', event.type);

    // // Handle the event
    await handleWebhookEvent(event);

    // Always return 200 OK to prevent retries
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);

    // Log error but still return 200 to prevent retries
    // The error will be logged and can be investigated
    if (error instanceof WebhookVerificationError) {
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 401 }
      );
    }

    // Return 200 for other errors to prevent webhook retries
    // Error is logged for investigation
    return NextResponse.json(
      { received: true, error: 'Processing error' },
      { status: 200 }
    );
  }
});
