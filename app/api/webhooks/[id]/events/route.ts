import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Webhook, { IWebhook } from '@/lib/models/Webhook';
import Event from '@/lib/models/Event';
import { Types } from 'mongoose';
import { getEventRetentionDays } from '@/lib/services/subscriptionService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    // Verify user owns the webhook
    const webhook = await Webhook.findOne({
      uniqueId: id,
      userId: session.user.id,
    }).lean<IWebhook & { _id: Types.ObjectId }>();

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Get retention period based on user's tier
    const retentionDays = await getEventRetentionDays(session.user.id);
    const cutoffDate = new Date(
      Date.now() - retentionDays * 24 * 60 * 60 * 1000
    );

    // Fetch events within retention period
    const events = await Event.find({
      webhook: webhook._id,
      createdAt: { $gte: cutoffDate },
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      events,
      webhookName: webhook.name,
      retentionDays,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
