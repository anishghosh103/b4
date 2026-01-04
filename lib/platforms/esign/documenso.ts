import crypto from 'crypto';
import { PlatformHandler, TransformResult, VerificationResult } from '../types';
import { DOCUMENSO_EVENT_MAPPINGS } from './mappings';

export const documensoHandler: PlatformHandler = {
  verify(
    payload: string,
    headers: Record<string, string>,
    queryParams,
    secret: string
  ): VerificationResult {
    try {
      const signature = headers['x-documenso-signature'];
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
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
    const eventType = payload.event || payload.type;
    const unifiedType = DOCUMENSO_EVENT_MAPPINGS[eventType];

    return {
      success: true,
      event_type: unifiedType || eventType,
      original_event_type: eventType,
      data: {
        document_id: payload.data?.documentId,
        document_name: payload.data?.title,
        status: payload.data?.status,
      },
    };
  },
};
