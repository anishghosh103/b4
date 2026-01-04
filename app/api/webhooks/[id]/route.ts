import { auth } from '@/lib/auth';
import Event from '@/lib/models/Event';
import Webhook from '@/lib/models/Webhook';
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, type, destinationUrl, cliEnabled, signingSecret } =
      await request.json();

    await dbConnect();

    const updateData: Record<string, any> = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json(
          { error: 'Name cannot be empty' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (type !== undefined) {
      const validTypes = [
        'custom',
        'stripe',
        'dodo',
        'polar',
        'pandadoc',
        'docusign',
        'documenso',
      ];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: 'Invalid webhook type' },
          { status: 400 }
        );
      }
      updateData.type = type;
    }

    if (destinationUrl !== undefined) {
      if (destinationUrl && !/^https?:\/\//.test(destinationUrl)) {
        return NextResponse.json(
          { error: 'Invalid destination URL' },
          { status: 400 }
        );
      }
      updateData.destinationUrl = destinationUrl || null;
    }

    if (cliEnabled !== undefined) {
      updateData.cliEnabled = Boolean(cliEnabled);
    }

    if (signingSecret !== undefined) {
      updateData.signingSecret = signingSecret || null;
    }

    const webhook = await Webhook.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      updateData,
      { new: true }
    );

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json(webhook);
  } catch (error) {
    console.error('Error updating webhook:', error);
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const webhook = await Webhook.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    await Event.deleteMany({ webhook: id }).lean();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}
