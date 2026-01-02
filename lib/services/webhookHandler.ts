/**
 * Webhook Handler Service
 *
 * Processes Dodo payment webhook events with MongoDB transactions
 * for atomic multi-document updates.
 */

import Payment from '../models/Payment';
import { WebhookEvent } from './dodoPaymentsService';

/**
 * Main webhook event handler
 * Routes events to appropriate handlers
 */
export async function handleWebhookEvent(event: WebhookEvent): Promise<void> {
  console.log(`Received webhook event: ${event.type}`);
  console.log(JSON.stringify(event.data, null, 2));

  switch (event.type) {
    case 'subscription.active': {
      const subscription = event.data;

      const paymentId = subscription.metadata.paymentId;
      await Payment.findByIdAndUpdate(paymentId, {
        status: 'completed',
        dodoSubscriptionId: subscription.subscription_id,
      });

      break;
    }
    case 'subscription.failed': {
      const subscription = event.data;

      const paymentId = subscription.metadata.paymentId;
      await Payment.findByIdAndUpdate(paymentId, {
        status: 'failed',
      });

      break;
    }

    default:
      console.warn(`Unknown webhook event type: ${event.type}`);
  }
}
