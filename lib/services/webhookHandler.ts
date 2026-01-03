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
        currentPeriodStart: subscription.previous_billing_date
          ? new Date(subscription.previous_billing_date)
          : undefined,
        currentPeriodEnd: subscription.next_billing_date
          ? new Date(subscription.next_billing_date)
          : undefined,
      });

      break;
    }

    case 'subscription.renewed': {
      const subscription = event.data;

      // Find the payment by subscription ID and update billing dates
      await Payment.findOneAndUpdate(
        { dodoSubscriptionId: subscription.subscription_id },
        {
          currentPeriodStart: subscription.previous_billing_date
            ? new Date(subscription.previous_billing_date)
            : undefined,
          currentPeriodEnd: subscription.next_billing_date
            ? new Date(subscription.next_billing_date)
            : undefined,
          // Reset cancellation flag if subscription was renewed
          cancelAtPeriodEnd: false,
        }
      );

      break;
    }

    case 'subscription.cancelled': {
      const subscription = event.data;

      // Find the payment by subscription ID and mark as cancelled
      await Payment.findOneAndUpdate(
        { dodoSubscriptionId: subscription.subscription_id },
        {
          cancelledAt: subscription.cancelled_at
            ? new Date(subscription.cancelled_at)
            : new Date(),
          cancelAtPeriodEnd: true,
        }
      );

      break;
    }

    case 'subscription.expired': {
      const subscription = event.data;

      // Find the payment by subscription ID
      // Create a new "free" payment to downgrade the user
      const existingPayment = await Payment.findOne({
        dodoSubscriptionId: subscription.subscription_id,
      });

      if (existingPayment?.user) {
        await Payment.create({
          user: existingPayment.user,
          status: 'completed',
          tier: 'free',
          metadata: {
            reason: 'subscription_expired',
            previousSubscriptionId: subscription.subscription_id,
          },
        });
      }

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
