'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier');
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      window.location.href = '/';
      return;
    }

    if (tier !== 'pro') {
      window.location.href = '/dashboard';
      return;
    }

    const initiatePayment = async () => {
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
        } else {
          setError('Failed to create checkout session');
        }
      } catch (err) {
        setError('Something went wrong');
      }
    };

    initiatePayment();
  }, [session, status, tier]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <a href="/" className="text-accent hover:underline">
            Return to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted">Redirecting to checkout...</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted">Loading...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
