import { AppHeader, UserMenu } from '@/components/features';
import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { auth } from '@/lib/auth';
import Webhook, { IWebhook } from '@/lib/models/Webhook';
import dbConnect from '@/lib/mongodb';
import { platformColors, platformLabels } from '@/lib/platforms';
import { cn } from '@/lib/utils';
import { Types } from 'mongoose';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { WebhookNav } from './webhook-nav';
import { WebhookUrl } from './webhook-url';

interface WebhookLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function WebhookLayout({
  children,
  params,
}: WebhookLayoutProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  const { id } = await params;

  await dbConnect();
  const webhook = await Webhook.findOne({
    uniqueId: id,
    userId: session.user.id,
  }).lean<IWebhook & { _id: Types.ObjectId }>();

  if (!webhook) {
    notFound();
  }

  return (
    <>
      <AppHeader
        left={
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Logo />
            </Link>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted font-medium">
              {webhook.name}
            </span>
            <span
              className={cn(
                'text-xs py-1 px-2 rounded-md font-medium',
                'bg-(--platform-background)/10 dark:bg-(--platform-background)/25 text-(--platform-foreground)',
                platformColors[webhook.type]
              )}
            >
              {platformLabels[webhook.type]}
            </span>
          </div>
        }
        right={
          <>
            {/* URL Badge with success indicator */}
            <WebhookUrl uniqueId={webhook.uniqueId} />
            <ThemeSwitcher />
            <UserMenu />
          </>
        }
      />

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 shrink-0">
            <WebhookNav webhookId={id} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}
