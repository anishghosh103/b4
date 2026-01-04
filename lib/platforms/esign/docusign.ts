import crypto from 'crypto';
import { PlatformHandler, TransformResult, VerificationResult } from '../types';
import { DOCUSIGN_EVENT_MAPPINGS } from './mappings';

export const docusignHandler: PlatformHandler = {
  verify(
    payload: string,
    headers: Record<string, string>,
    queryParams,
    secret: string
  ): VerificationResult {
    try {
      const signature = headers['x-docusign-signature-1'];
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('base64');

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
    const eventType = payload.event;
    const unifiedType = DOCUSIGN_EVENT_MAPPINGS[eventType];

    return {
      success: true,
      event_type: unifiedType || eventType,
      original_event_type: eventType,
      data: {
        document_id: payload.data?.envelopeId,
        status: payload.data?.status,
      },
    };
  },
};
