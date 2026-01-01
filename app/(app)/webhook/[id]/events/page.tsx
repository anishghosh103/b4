import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Webhook, { IWebhook } from '@/lib/models/Webhook';
import Event from '@/lib/models/Event';
import { EventsClient } from './events-client';
import { Types } from 'mongoose';

interface WebhookEventsPageProps {
  params: Promise<{ id: string }>;
}

export default async function WebhookEventsPage({
  params,
}: WebhookEventsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  const { id } = await params;

  await dbConnect();

  // Verify user owns the webhook
  const webhook = await Webhook.findOne({
    uniqueId: id,
    userId: session.user.id,
  }).lean<IWebhook & { _id: Types.ObjectId }>();

  if (!webhook) {
    notFound();
  }

  // Fetch events for this webhook
  const events = await Event.find({ webhook: webhook._id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return (
    <EventsClient
      webhookId={id}
      initialEvents={JSON.parse(JSON.stringify(events))}
    />
  );
}
