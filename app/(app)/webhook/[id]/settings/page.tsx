import { auth } from '@/lib/auth';
import Webhook, { IWebhook } from '@/lib/models/Webhook';
import dbConnect from '@/lib/mongodb';
import { getUserTier } from '@/lib/services/subscriptionService';
import { Types } from 'mongoose';
import { notFound, redirect } from 'next/navigation';
import { SettingsClient } from './settings-client';

interface WebhookSettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function WebhookSettingsPage({
  params,
}: WebhookSettingsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  const { id } = await params;

  await dbConnect();

  const [webhook, pricingTier] = await Promise.all([
    Webhook.findOne({
      uniqueId: id,
      userId: session.user.id,
    }).lean<IWebhook & { _id: Types.ObjectId }>(),
    getUserTier(session.user.id),
  ]);

  if (!webhook) {
    notFound();
  }

  return (
    <SettingsClient
      webhookId={webhook._id.toString()}
      uniqueId={webhook.uniqueId}
      initialName={webhook.name}
      initialType={webhook.type || 'custom'}
      initialDestinationUrl={webhook.destinationUrl || ''}
      initialCliEnabled={webhook.cliEnabled ?? true}
      tier={pricingTier}
    />
  );
}
