import { auth } from '@/lib/auth';
import Webhook, { IWebhook } from '@/lib/models/Webhook';
import dbConnect from '@/lib/mongodb';
import { Types } from 'mongoose';
import { notFound, redirect } from 'next/navigation';
import { WorkflowsClient } from './workflows-client';

interface WorkflowsPageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkflowsPage({ params }: WorkflowsPageProps) {
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

  return (
    <WorkflowsClient
      webhookId={id}
      webhookType={webhook.type}
    />
  );
}
