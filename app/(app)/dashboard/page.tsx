import { AppHeader, UserMenu } from '@/components/features';
import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { auth } from '@/lib/auth';
import Webhook from '@/lib/models/Webhook';
import dbConnect from '@/lib/mongodb';
import Link from 'next/link';
import { redirect } from 'next/navigation';
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
    <>
      <AppHeader
        left={
          <Link href="/dashboard">
            <Logo />
          </Link>
        }
        right={
          <>
            <ThemeSwitcher />
            <UserMenu />
          </>
        }
      />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <DashboardClient
          initialWebhooks={JSON.parse(JSON.stringify(webhooks))}
        />
      </main>
    </>
  );
}
