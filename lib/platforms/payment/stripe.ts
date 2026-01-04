import crypto from 'crypto';
import { NormalizedSubscriptionData } from '../../types/unified-events';
import { PlatformHandler, TransformResult, VerificationResult } from '../types';
import { STRIPE_EVENT_MAPPINGS } from './mappings';

export const stripeHandler: PlatformHandler = {
  verify(
    payload: string,
    headers: Record<string, string>,
    queryParams,
    secret: string
  ): VerificationResult {
    try {
      const signatureHeader = headers['stripe-signature'];
      const parts = signatureHeader.split(',').reduce((acc, part) => {
        const [key, value] = part.split('=');
        acc[key] = value;
        return acc;
      }, {} as any);

      const timestamp = parts['t'];
      const signature = parts['v1'];

      if (!timestamp || !signature) {
        throw new Error('Invalid signature header format');
      }

      // Check timestamp tolerance (prevents replay attacks)
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime - parseInt(timestamp) > 300) {
        throw new Error('Webhook timestamp too old');
      }

      // Compute expected signature
      const signedPayload = `${timestamp}.${payload}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex');

      // Constant-time comparison to prevent timing attacks
      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

      if (!isValid) {
        throw new Error('Invalid signature');
      }

      const parsedPayload = JSON.parse(payload);

      return { verified: true };
    } catch (error) {
      return {
        verified: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  },

  transform(payload: any, headers: Record<string, string>): TransformResult {
    const stripeEventType = payload.type;
    const unifiedType = STRIPE_EVENT_MAPPINGS[stripeEventType];
    const data = normalizeStripeData(payload);

    return {
      success: true,
      event_type: unifiedType || stripeEventType,
      original_event_type: stripeEventType,
      data,
    };
  },
};

function normalizeStripeData(payload: any): NormalizedSubscriptionData {
  const obj = payload.data?.object;
  return {
    subscription_id: obj?.id || '',
    customer_id: obj?.customer,
    customer_email: obj?.customer_email,
    plan_id: obj?.items?.data?.[0]?.price?.id,
    amount: obj?.items?.data?.[0]?.price?.unit_amount,
    currency: obj?.currency,
    status: obj?.status,
  };
}
