'use client';

import { PricingCard } from '@/components/features';
import { PRICING_TIERS } from '@/lib/constants/pricing';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

export function PricingSection() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleGetStarted = async (tier: string) => {
    if (tier === 'free') {
      if (session?.user) {
        window.location.href = '/dashboard';
      } else {
        signIn('google', { callbackUrl: '/dashboard' });
      }
      return;
    }

    if (!session?.user) {
      signIn('google', { callbackUrl: '/checkout?tier=pro' });
      return;
    }

    setLoading(tier);
    try {
      const usageRes = await fetch('/api/subscription/usage');
      const usageData = await usageRes.json();

      if (usageData.data?.tier === 'pro') {
        window.location.href = '/dashboard';
        return;
      }

      const response = await fetch('/api/payments/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'pro',
          successUrl: `${window.location.origin}/settings/subscription`,
        }),
      });
      const res = await response.json();
      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    } catch (err) {
      console.error('Payment init failed:', err);
      setLoading(null);
    }
  };

  return (
    <section
      id="pricing"
      className="py-28 px-6 border-t border-border/30"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted">
            Start free. Scale when you&apos;re ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <PricingCard
            tier={PRICING_TIERS.free.name}
            price="Free"
            description={PRICING_TIERS.free.description}
            features={[...PRICING_TIERS.free.features]}
            onClick={() => handleGetStarted('free')}
            status={loading === 'free' ? 'loading' : 'default'}
          />
          <PricingCard
            tier={PRICING_TIERS.pro.name}
            price="$12"
            description={PRICING_TIERS.pro.description}
            features={[...PRICING_TIERS.pro.features]}
            highlighted
            highlightedText="Recommended"
            onClick={() => handleGetStarted('pro')}
            status={loading === 'pro' ? 'loading' : 'default'}
          />
        </div>
      </div>
    </section>
  );
}
