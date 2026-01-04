import { auth } from '@/lib/auth';
import Event from '@/lib/models/Event';
import Webhook from '@/lib/models/Webhook';
import dbConnect from '@/lib/mongodb';
import { forwardToProductionUrl } from '@/lib/services/destinationService';
import { forwardWebhookToServer } from '@/lib/webhook-forwarder';
import { NextRequest, NextResponse } from 'next/server';

interface ReplayRequest {
  destinations: {
    url?: boolean;
    cli?: boolean;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eventId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: webhookUniqueId, eventId } = await params;
    const { destinations }: ReplayRequest = await request.json();

    if (!destinations?.url && !destinations?.cli) {
      return NextResponse.json(
        { error: 'At least one destination must be selected' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify webhook ownership
    const webhook = await Webhook.findOne({
      uniqueId: webhookUniqueId,
      userId: session.user.id,
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Fetch the event
    const event = await Event.findOne({
      _id: eventId,
      webhook: webhook._id,
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Validate destination availability
    if (destinations.url && !webhook.destinationUrl) {
      return NextResponse.json(
        { error: 'No production URL configured for this webhook' },
        { status: 400 }
      );
    }

    if (destinations.cli && !webhook.cliEnabled) {
      return NextResponse.json(
        { error: 'CLI forwarding is not enabled for this webhook' },
        { status: 400 }
      );
    }

    // Dispatch to selected destinations
    const results: {
      url?: { status: number; body: unknown } | { error: string };
      cli?: { forwarded: boolean; queued: boolean } | { error: string };
    } = {};

    const promises: Promise<void>[] = [];

    if (destinations.url && webhook.destinationUrl) {
      promises.push(
        forwardToProductionUrl({
          eventId: event._id,
          url: webhook.destinationUrl,
          method: event.method,
          headers: event.headers || {},
          payload: event.payload,
        }).then((result) => {
          results.url = result;
        })
      );
    }

    if (destinations.cli && webhook.cliEnabled) {
      promises.push(
        forwardWebhookToServer({
          webhookId: webhook.uniqueId,
          eventId: event._id,
          method: event.method,
          headers: event.headers || {},
          body: event.payload,
          queryParams: event.queryParams || {},
        }).then((result) => {
          if (result.success) {
            results.cli = { forwarded: result.forwarded, queued: result.queued };
          } else {
            results.cli = { error: result.error || 'Failed to forward to CLI' };
          }
        })
      );
    }

    await Promise.allSettled(promises);

    // Refetch the updated event to return current state
    const updatedEvent = await Event.findById(eventId).lean();

    return NextResponse.json({
      success: true,
      results,
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Error replaying event:', error);
    return NextResponse.json(
      { error: 'Failed to replay event' },
      { status: 500 }
    );
  }
}
