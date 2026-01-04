import crypto from 'crypto';
import { PlatformHandler, TransformResult, VerificationResult } from '../types';
import { POLAR_EVENT_MAPPINGS } from './mappings';

export const polarHandler: PlatformHandler = {
  verify(
    payload: string,
    headers: Record<string, string>,
    queryParams,
    secret: string
  ): VerificationResult {
    try {
      const signature = headers['webhook-signature'];
      const timestamp = headers['webhook-timestamp'];
      const signedPayload = `${timestamp}.${payload}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex');

      if (signature === expectedSignature) {
        return { verified: true };
      }
      return { verified: false, error: 'Signature mismatch' };
    } catch (error) {
      return {
        verified: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  },

  transform(payload: any, headers: Record<string, string>): TransformResult {
    const polarEventType = payload.type;
    const unifiedType = POLAR_EVENT_MAPPINGS[polarEventType];

    return {
      success: true,
      event_type: unifiedType || polarEventType,
      original_event_type: polarEventType,
      data: payload.data || {},
    };
  },
};
