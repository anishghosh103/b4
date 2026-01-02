import { AppHeader, UserMenu } from '@/components/features';
import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { auth } from '@/lib/auth';
import Payment from '@/lib/models/Payment';
import PricingConfig from '@/lib/models/PricingConfig';
import dbConnect from '@/lib/mongodb';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SubscriptionClient } from './subscription-client';

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  await dbConnect();

  // Fetch pricing configs for current environment
  const environment = process.env.DODO_ENVIRONMENT || 'test_mode';
  const pricingConfigs = await PricingConfig.find({
    environment,
    isActive: true,
  })
    .sort({ 'amount.value': 1 })
    .lean();

  // Check for any pending payment (for showing processing state)
  const latestPayment = await Payment.findOne({ user: session.user.id })
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();

  const currentTier = latestPayment?.tier || 'free';

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
      <main className="max-w-4xl mx-auto px-6 py-8">
        <SubscriptionClient
          pricingConfigs={JSON.parse(JSON.stringify(pricingConfigs))}
          currentTier={currentTier}
          hasPendingPayment={latestPayment?.status === 'pending'}
        />
      </main>
    </>
  );
}
