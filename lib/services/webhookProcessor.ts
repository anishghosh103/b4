import { Types } from 'mongoose';
import Event from '../models/Event';
import { IWebhook } from '../models/Webhook';
import { getHandler } from '../platforms';
import { Platform, UnifiedEvent } from '../types/unified-events';
import { dispatchToDestinations } from './destinationService';

interface ProcessWebhookParams {
  webhook: IWebhook & { _id: Types.ObjectId; signingSecret?: string | null };
  eventId: Types.ObjectId;
  method: string;
  headers: Record<string, string>;
  payload: any;
  rawBody: string;
  queryParams: Record<string, string>;
}

export async function processWebhookAsync(
  params: ProcessWebhookParams
): Promise<void> {
  const { webhook, eventId, method, headers, payload, rawBody, queryParams } =
    params;

  let verified = false;
  let verificationError: string | null = null;
  let eventType: string | null = null;
  let originalEventType: string | null = null;
  let normalizedData: unknown = null;

  // Handle platform-specific processing
  if (webhook.type !== 'custom') {
    const handler = getHandler(webhook.type);

    if (handler) {
      if (webhook.signingSecret) {
        // Verify signature
        const verifyResult = handler.verify(
          rawBody,
          headers,
          queryParams,
          webhook.signingSecret
        );
        verified = verifyResult.verified;
        verificationError = verifyResult.error || null;
      }

      // Transform to get event type and normalized data
      const transformResult = handler.transform(payload, headers);
      if (transformResult.success) {
        eventType = transformResult.event_type || null;
        originalEventType = transformResult.original_event_type || null;
        normalizedData = transformResult.data || null;
      }
    }
  }

  // Build unified payload structure (same shape for ALL webhook types)
  const unifiedPayload: UnifiedEvent = {
    metadata: {
      webhook_id: webhook.uniqueId,
      platform: webhook.type as Platform,
      event_type: eventType,
      original_event_type: originalEventType,
      received_at: new Date().toISOString(),
      method,
      query_params: queryParams,
      verified,
    },
    data: normalizedData,
    original_payload: payload,
  };

  // Update event with verification and transformation results
  await Event.findByIdAndUpdate(eventId, {
    name: eventType || originalEventType || '',
    verified,
    verificationError,
    normalizedPayload: unifiedPayload,
  });

  // Dispatch unified payload to destinations (both simultaneously)
  await dispatchToDestinations({
    webhookId: webhook.uniqueId,
    eventId,
    webhook,
    method,
    headers,
    payload: unifiedPayload, // Same unified structure for all types
    queryParams,
  });
}
