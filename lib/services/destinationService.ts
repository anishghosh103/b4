import { Types } from 'mongoose';
import { IWebhook } from '../models/Webhook';
import { forwardWebhookToServer } from '../webhook-forwarder';
import Event from '../models/Event';

interface DispatchParams {
  eventId: Types.ObjectId | string;
  webhookId: string;
  webhook: IWebhook;
  method: string;
  headers: Record<string, string>;
  payload: any;
  queryParams: Record<string, string>;
}

export async function dispatchToDestinations(
  params: DispatchParams
): Promise<void> {
  const { webhookId, eventId, webhook, method, headers, payload, queryParams } =
    params;

  const promises: Promise<void>[] = [];

  // Destination 1: Production webhook URL (if configured)
  if (webhook.destinationUrl) {
    promises.push(
      forwardToProductionUrl({
        eventId,
        url: webhook.destinationUrl,
        method,
        headers,
        payload,
      }).then(() => {})
    );
  }

  // Destination 2: CLI via WebSocket (if enabled)
  if (webhook.cliEnabled) {
    promises.push(
      forwardWebhookToServer({
        webhookId,
        eventId,
        method,
        headers,
        body: payload,
        queryParams,
      }).then(() => {})
    );
  }

  // Execute both simultaneously, don't wait for results
  await Promise.allSettled(promises);
}

export async function forwardToProductionUrl(params: {
  eventId: Types.ObjectId | string;
  url: string;
  method: string;
  headers: Record<string, string>;
  payload: any;
}): Promise<{ status: number; body: unknown } | { error: string }> {
  const { eventId, url, method, headers, payload } = params;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-HookOne-Forwarded': 'true',
        // Preserve signature headers for verification at destination
        ...(headers['stripe-signature'] && {
          'stripe-signature': headers['stripe-signature'],
        }),
        ...(headers['webhook-signature'] && {
          'webhook-signature': headers['webhook-signature'],
        }),
        ...(headers['webhook-id'] && { 'webhook-id': headers['webhook-id'] }),
        ...(headers['webhook-timestamp'] && {
          'webhook-timestamp': headers['webhook-timestamp'],
        }),
      },
      ...(method !== 'GET' && method !== 'DELETE'
        ? { body: JSON.stringify(payload) }
        : {}),
      signal: AbortSignal.timeout(30000),
    });

    const responseBody = await response.text();
    let parsedBody;
    try {
      parsedBody = JSON.parse(responseBody);
    } catch {
      parsedBody = responseBody;
    }

    await Event.findByIdAndUpdate(eventId, {
      urlResponse: {
        status: response.status,
        body: parsedBody,
      },
    });

    return { status: response.status, body: parsedBody };
  } catch (error) {
    console.error(`Failed to forward to ${url}:`, error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
