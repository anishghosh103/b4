/**
 * Dodo Payments Service
 *
 * Handles checkout session creation and webhook verification
 * using Dodo Payments API and Standard Webhooks.
 */

import DodoPayments from 'dodopayments';
import { ServiceError, WebhookVerificationError } from '../errors/AppError';

// Dodo Payments API configuration
const DODO_API_BASE = 'https://api.dodopayments.com/v1';
const DODO_API_KEY = process.env.DODO_API_KEY;
const DODO_WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET;
const DODO_ENVIRONMENT = process.env.DODO_ENVIRONMENT;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Checkout session creation parameters
export interface CreateCheckoutParams {
  dodoProductId: string;
  user: { name?: string; email: string };
  paymentId: string;
  successUrl?: string;
}

// Checkout session response
export interface CheckoutSession {
  id: string; // Session ID
  checkoutUrl: string;
}

// Webhook event types
export interface WebhookEvent {
  type:
    | 'subscription.active'
    | 'subscription.failed'
    | 'subscription.cancelled'
    | 'subscription.expired'
    | 'subscription.renewed';
  data: {
    subscription_id: string;
    amount: number;
    currency: string;
    status: string;
    metadata: { paymentId: string };
  };
  timestamp: string;
}

const client = new DodoPayments({
  bearerToken: DODO_API_KEY,
  environment: DODO_ENVIRONMENT === 'live_mode' ? 'live_mode' : 'test_mode',
  webhookKey: DODO_WEBHOOK_SECRET,
});

/**
 * Create a Dodo Payments checkout session
 */
export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<CheckoutSession> {
  if (!DODO_API_KEY) {
    throw new ServiceError('Dodo Payments', 'API key not configured');
  }

  try {
    const session = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: params.dodoProductId,
          quantity: 1,
        },
      ],
      customer: {
        name: params.user.name,
        email: params.user.email,
      },
      return_url: params.successUrl,
      metadata: { paymentId: params.paymentId },
    });

    return {
      id: session.session_id,
      checkoutUrl: session.checkout_url!,
    };
  } catch (error) {
    console.error('Dodo Payments checkout creation error:', error);
    if (error instanceof ServiceError) throw error;
    throw new ServiceError(
      'Dodo Payments',
      `Failed to create checkout session: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Verify webhook signature using Standard Webhooks
 */
export function verifyWebhook(
  payload: string,
  headers: Record<string, string | string[] | undefined>
): void {
  if (!DODO_WEBHOOK_SECRET) {
    throw new WebhookVerificationError('Webhook secret not configured');
  }

  try {
    // Extract webhook headers
    const signature = headers['webhook-signature'] as string;
    const timestamp = headers['webhook-timestamp'] as string;
    const id = headers['webhook-id'] as string;

    if (!signature) {
      throw new WebhookVerificationError('Missing webhook signature');
    }

    const webhook = client.webhooks.unwrap(payload, {
      headers: {
        'webhook-id': id || '',
        'webhook-signature': signature,
        'webhook-timestamp': timestamp || '',
      },
    });
  } catch (error) {
    console.error('Webhook verification failed:', error);
    throw new WebhookVerificationError(
      error instanceof Error ? error.message : 'Signature verification failed'
    );
  }
}

/**
 * Parse webhook event from verified payload
 */
export function parseWebhookEvent(payload: string): WebhookEvent {
  try {
    const event = JSON.parse(payload);

    // Validate required fields
    if (!event.type || !event.data) {
      throw new Error('Invalid webhook event structure');
    }

    return {
      type: event.type,
      data: {
        subscription_id: event.data.subscription_id,
        amount: event.data.total_amount / 100,
        currency: event.data.currency,
        status: event.data.status,
        metadata: event.data.metadata || {},
      },
      timestamp: event.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to parse webhook event:', error);
    throw new ServiceError(
      'Dodo Payments',
      `Invalid webhook payload: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Get payment details from Dodo API
 */
export async function getPaymentDetails(paymentId: string): Promise<any> {
  if (!DODO_API_KEY) {
    throw new ServiceError('Dodo Payments', 'API key not configured');
  }

  try {
    const response = await fetch(`${DODO_API_BASE}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${DODO_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new ServiceError(
      'Dodo Payments',
      `Failed to fetch payment details: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Cancel a checkout session
 */
export async function cancelCheckoutSession(sessionId: string): Promise<void> {
  if (!DODO_API_KEY) {
    throw new ServiceError('Dodo Payments', 'API key not configured');
  }

  try {
    const response = await fetch(
      `${DODO_API_BASE}/checkout/sessions/${sessionId}/cancel`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${DODO_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to cancel session: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error canceling checkout session:', error);
    throw new ServiceError(
      'Dodo Payments',
      `Failed to cancel checkout session: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
