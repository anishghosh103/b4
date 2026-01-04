import Event from '@/lib/models/Event';
import Webhook, { IWebhook } from '@/lib/models/Webhook';
import dbConnect from '@/lib/mongodb';
import { canReceiveEvent } from '@/lib/services/subscriptionService';
import { processWebhookAsync } from '@/lib/services/webhookProcessor';
import { asyncHandler } from '@/lib/utils/controllerHelpers';
import { waitUntil } from '@vercel/functions';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function handleWebhookRequest(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  method: HttpMethod
) {
  try {
    const { id } = await params;

    // Read raw body for signature verification
    const rawBody = await request.text();

    await dbConnect();

    console.log('id');

    // Find webhook with signing secret
    const webhook = await Webhook.findOne({ uniqueId: id }).lean<
      IWebhook & { _id: Types.ObjectId }
    >();

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Check event limit for the webhook owner
    const eventCheck = await canReceiveEvent(webhook.userId);
    if (!eventCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Monthly event limit exceeded',
          code: 'EVENT_LIMIT_EXCEEDED',
          details: {
            current: eventCheck.current,
            limit: eventCheck.limit,
            tier: eventCheck.tier,
            status: eventCheck.status,
          },
        },
        { status: 429 }
      );
    }

    // Track if this event is over quota (in grace period)
    const isOverQuota = eventCheck.status === 'grace_period';

    // Parse payload
    let payload: any = null;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json') && rawBody) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        payload = rawBody;
      }
    } else {
      payload = rawBody;
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

    // Detect platform (for logging/display purposes)

    // Create event record immediately
    const event = await Event.create({
      user: webhook.userId,
      webhook: webhook._id,
      platform: webhook.type,
      method,
      payload,
      headers,
      queryParams,
      overQuota: isOverQuota,
    });

    // IMMEDIATE RESPONSE - Don't wait for processing
    const response = NextResponse.json(
      { received: true, eventId: event._id },
      { status: 200 }
    );

    console.log(0);
    // Async processing (fire-and-forget)
    waitUntil(
      processWebhookAsync({
        webhook,
        eventId: event._id as Types.ObjectId,
        method,
        headers,
        payload,
        rawBody,
        queryParams,
      }).catch((err) => {
        console.error('Async webhook processing failed:', err);
      })
    );

    return response;
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = asyncHandler(
  (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    return handleWebhookRequest(request, context, 'GET');
  }
);

export const POST = asyncHandler(
  (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    return handleWebhookRequest(request, context, 'POST');
  }
);

export const PUT = asyncHandler(
  (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    return handleWebhookRequest(request, context, 'PUT');
  }
);

export const PATCH = asyncHandler(
  (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    return handleWebhookRequest(request, context, 'PATCH');
  }
);

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleWebhookRequest(request, context, 'DELETE');
}
