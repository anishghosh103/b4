import { Types } from 'mongoose';

const WS_SERVER_URL = process.env.WS_SERVER_URL || 'http://localhost:3001';
const WS_AUTH_TOKEN = process.env.WS_AUTH_TOKEN || 'dev-token';

interface ForwardWebhookParams {
  webhookId: string;
  eventId: Types.ObjectId | string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
  queryParams?: Record<string, string>;
}

interface ForwardResponse {
  success: boolean;
  forwarded: boolean;
  queued: boolean;
  error?: string;
}

export async function forwardWebhookToServer(
  params: ForwardWebhookParams
): Promise<ForwardResponse> {
  const { webhookId, eventId, method, headers, body, queryParams } = params;

  try {
    console.log(WS_SERVER_URL, WS_AUTH_TOKEN, webhookId);
    const response = await fetch(`${WS_SERVER_URL}/forward/${webhookId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WS_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        eventId: eventId.toString(),
        method,
        headers,
        body,
        queryParams,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        forwarded: false,
        queued: false,
        error: error.error || 'Failed to forward webhook',
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to forward webhook to server:', error);
    // Don't throw - webhook was still saved, forwarding is optional
    return {
      success: false,
      forwarded: false,
      queued: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
