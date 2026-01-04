import Event from '@/lib/models/Event';
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

const WS_AUTH_TOKEN = process.env.WS_AUTH_TOKEN || 'dev-token';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate auth token (server-to-server call from WS server)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${WS_AUTH_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status, body } = await request.json();

    await dbConnect();

    const event = await Event.findByIdAndUpdate(
      id,
      {
        cliResponse: { status, body },
      },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating event cliResponse:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}
