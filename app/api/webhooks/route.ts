import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Webhook from '@/lib/models/Webhook';
import { canCreateWebhook } from '@/lib/services/subscriptionService';
import { SubscriptionLimitError } from '@/lib/errors/AppError';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const webhooks = await Webhook.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(webhooks);
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await dbConnect();

    // Check webhook limit before creating
    const webhookCheck = await canCreateWebhook(session.user.id);
    if (!webhookCheck.allowed) {
      const error = new SubscriptionLimitError(
        'maxWebhooks',
        webhookCheck.current,
        webhookCheck.limit,
        webhookCheck.tier
      );
      return NextResponse.json(
        {
          error: error.message,
          code: 'SUBSCRIPTION_LIMIT_EXCEEDED',
          details: {
            limitType: error.limitType,
            current: error.current,
            limit: error.limit,
            tier: error.tier,
            upgradeUrl: '/settings/subscription',
          },
        },
        { status: error.statusCode }
      );
    }

    const uniqueId = crypto.randomUUID().slice(0, 8);
    const webhook = await Webhook.create({
      name: name.trim(),
      uniqueId,
      path: `/wh/${uniqueId}`,
      userId: session.user.id,
    });

    return NextResponse.json(webhook, { status: 201 });
  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    );
  }
}
