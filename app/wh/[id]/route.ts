import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Webhook, { IWebhook } from '@/lib/models/Webhook';
import Event from '@/lib/models/Event';
import { Types } from 'mongoose';
import { detectPlatformAndEvent } from '@/lib/utils/platform-detector';
import { forwardWebhookToServer } from '@/lib/webhook-forwarder';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function handleWebhookRequest(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  method: HttpMethod
) {
  try {
    const { id } = await params;

    await dbConnect();

    // Find webhook by uniqueId
    const webhook = await Webhook.findOne({ uniqueId: id }).lean<
      IWebhook & { _id: Types.ObjectId }
    >();

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Extract headers (convert Headers to plain object)
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Extract query parameters
    const queryParams: Record<string, string> = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // Extract payload (body) for methods that support it
    let payload: any = null;
    if (method !== 'GET') {
      const contentType = request.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        try {
          payload = await request.json();
        } catch {
          payload = null;
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        try {
          const formData = await request.formData();
          payload = Object.fromEntries(formData.entries());
        } catch {
          payload = null;
        }
      } else if (contentType.includes('text/')) {
        try {
          payload = await request.text();
        } catch {
          payload = null;
        }
      } else {
        // Try to read as text for other content types
        try {
          payload = await request.text();
        } catch {
          payload = null;
        }
      }
    }

    // Detect platform and extract event name
    const { platform, eventName } = detectPlatformAndEvent(headers, payload);

    // Create event record
    const event = await Event.create({
      webhook: webhook._id,
      name: eventName || '',
      platform,
      method,
      payload,
      headers,
      queryParams,
      responseStatus: 200,
      responseBody: { received: true },
    });

    // Forward to WebSocket server for CLI (fire and forget)
    forwardWebhookToServer({
      webhookId: id,
      method,
      headers,
      body: payload,
      queryParams,
    }).catch((err) => {
      console.error('Webhook forwarding failed:', err);
    });

    return NextResponse.json(
      {
        received: true,
        eventId: event._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleWebhookRequest(request, context, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleWebhookRequest(request, context, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleWebhookRequest(request, context, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleWebhookRequest(request, context, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleWebhookRequest(request, context, 'DELETE');
}
