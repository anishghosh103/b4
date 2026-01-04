import crypto from 'crypto';
import { PlatformHandler, TransformResult, VerificationResult } from '../types';
import { PANDADOC_EVENT_MAPPINGS } from './mappings';

export const pandadocHandler: PlatformHandler = {
  verify(
    payload: string,
    headers: Record<string, string>,
    queryParams,
    secret: string
  ): VerificationResult {
    try {
      const signature = queryParams['signature'];
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
      const isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(signature, 'hex')
      );
      if (isValid) {
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
    const eventType = payload.event;
    const unifiedType = PANDADOC_EVENT_MAPPINGS[eventType];

    return {
      success: true,
      event_type: unifiedType || eventType,
      original_event_type: eventType,
      data: {
        document_id: payload.data?.id,
        document_name: payload.data?.name,
        status: payload.data?.status,
      },
    };
  },
};
