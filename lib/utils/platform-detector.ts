export type Platform =
  | 'stripe'
  | 'github'
  | 'docusign'
  | 'dodo'
  | 'polar'
  | 'pandadoc'
  | 'documenso'
  | 'custom';

interface DetectionResult {
  platform: Platform;
  eventName: string | null;
}

/**
 * Normalize headers to lowercase keys for consistent detection
 */
function normalizeHeaders(
  headers: Record<string, string>
): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    normalized[key.toLowerCase()] = value;
  }
  return normalized;
}

/**
 * Detect the platform and extract event name from webhook headers and payload
 *
 * Platform detection:
 * - Stripe: stripe-signature header
 * - GitHub: x-github-event header
 * - DocuSign: x-docusign-signature-1 header
 * - Dodo: webhook-signature + webhook-id + webhook-timestamp headers
 */
export function detectPlatformAndEvent(
  headers: Record<string, string>,
  payload: any
): DetectionResult {
  const h = normalizeHeaders(headers);

  // Stripe: has stripe-signature header
  // Event name is in payload.type (e.g., "payment_intent.succeeded")
  if (h['stripe-signature']) {
    return {
      platform: 'stripe',
      eventName: payload?.type || null,
    };
  }

  // GitHub: has x-github-event header
  // Event name is the header value + payload.action (e.g., "pull_request.opened")
  if (h['x-github-event']) {
    const event = h['x-github-event'];
    const action = payload?.action ? `.${payload.action}` : '';
    return {
      platform: 'github',
      eventName: `${event}${action}`,
    };
  }

  // DocuSign: has x-docusign-signature-1 header
  // Event name is in payload.event (e.g., "envelope-completed")
  if (h['x-docusign-signature-1']) {
    return {
      platform: 'docusign',
      eventName: payload?.event || null,
    };
  }

  // Dodo: has webhook-signature + webhook-id + webhook-timestamp headers
  // Event name is in payload.event_type or payload.type (e.g., "payment.succeeded")
  if (h['webhook-signature'] && h['webhook-id'] && h['webhook-timestamp']) {
    return {
      platform: 'dodo',
      eventName: payload?.event_type || payload?.type || null,
    };
  }

  // Polar: has webhook-signature but NOT webhook-id
  if (h['webhook-signature'] && !h['webhook-id']) {
    return {
      platform: 'polar',
      eventName: payload?.type || null,
    };
  }

  // PandaDoc: has x-pandadoc-signature header
  if (h['x-pandadoc-signature']) {
    return {
      platform: 'pandadoc',
      eventName: payload?.event || null,
    };
  }

  // Documenso: has x-documenso-signature header
  if (h['x-documenso-signature']) {
    return {
      platform: 'documenso',
      eventName: payload?.event || payload?.type || null,
    };
  }

  // Unknown platform: no event name extraction
  return {
    platform: 'custom',
    eventName: null,
  };
}
