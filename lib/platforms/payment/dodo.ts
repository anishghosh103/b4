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

    return {
      success: true,
      event_type: unifiedType || dodoEventType,
      original_event_type: dodoEventType,
      data: payload.data || {},
    };
  },
};
