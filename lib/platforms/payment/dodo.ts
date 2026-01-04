import { NormalizedSubscriptionData } from '@/lib/types/unified-events';
import { Webhook } from 'standardwebhooks';
import { PlatformHandler, TransformResult, VerificationResult } from '../types';
import { DODO_EVENT_MAPPINGS } from './mappings';

export const dodoHandler: PlatformHandler = {
  verify(
    payload: string,
    headers: Record<string, string>,
    queryParams,
    secret: string
  ): VerificationResult {
    try {
      const wh = new Webhook(secret);
      wh.verify(payload, {
        'webhook-id': headers['webhook-id'],
        'webhook-timestamp': headers['webhook-timestamp'],
        'webhook-signature': headers['webhook-signature'],
      });
      return { verified: true };
    } catch (error) {
      return {
        verified: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  },

  transform(payload: any, headers: Record<string, string>): TransformResult {
    const dodoEventType = payload.event_type || payload.type;
    const unifiedType = DODO_EVENT_MAPPINGS[dodoEventType];
    const data = normalizeDodoData(payload);

    return {
      success: true,
      event_type: unifiedType || dodoEventType,
      original_event_type: dodoEventType,
      data,
    };
  },
};

function normalizeDodoData(payload: any): NormalizedSubscriptionData {
  const obj = payload.data;
  return {
    subscription_id: obj?.subscription_id || '',
    customer_id: obj?.customer?.customer_id,
    customer_email: obj?.customer?.email,
    plan_id: obj?.product_id,
    amount: obj?.recurring_pre_tax_amount,
    currency: obj?.currency,
    status: obj?.status,
    interval: obj?.payment_frequency_interval,
    current_period_start: obj?.previous_billing_date,
    current_period_end: obj?.next_billing_date,
  };
}
