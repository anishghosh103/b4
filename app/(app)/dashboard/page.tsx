import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Webhook from '@/lib/models/Webhook';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  await dbConnect();
  const webhooks = await Webhook.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <DashboardClient
      initialWebhooks={JSON.parse(JSON.stringify(webhooks))}
    />
  );
}
