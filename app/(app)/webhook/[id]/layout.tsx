import { ReactNode } from 'react';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Webhook, { IWebhook } from '@/lib/models/Webhook';
import { AppHeader, UserMenu } from '@/components/features';
import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Activity, Settings, CheckCircle2 } from 'lucide-react';
import { Types } from 'mongoose';

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

  const webhookUrl = `hookone.dev/wh/${webhook.uniqueId}`;

  return (
    <>
      <AppHeader
        left={
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Logo />
            </Link>
            <div className="h-6 w-px bg-border" />
            <span className="font-medium text-foreground">{webhook.name}</span>
          </div>
        }
        right={
          <>
            {/* URL Badge with success indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="relative">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <div className="absolute inset-0 animate-ping">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 opacity-30" />
                </div>
              </div>
              <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                {webhookUrl}
              </code>
            </div>
            <ThemeSwitcher />
            <UserMenu />
          </>
        }
      />

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 shrink-0">
            <nav className="space-y-1">
              <Link
                href={`/webhook/${id}/events`}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg',
                  'text-sm font-medium',
                  'bg-accent/10 text-foreground border border-accent/20'
                )}
              >
                <Activity className="w-4 h-4" />
                Events
              </Link>
              <button
                disabled
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg w-full',
                  'text-sm font-medium',
                  'text-muted cursor-not-allowed opacity-50'
                )}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}
