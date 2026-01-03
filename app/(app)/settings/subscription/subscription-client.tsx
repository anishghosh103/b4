'use client';

import { PricingCard } from '@/components/features/pricing-card';
import { Badge, Button, Card } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tilt } from '@/components/ui/tilt';
import { PRICING_TIERS } from '@/lib/constants/pricing';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatPrice';
import { Zap } from 'lucide-react';
import { useState } from 'react';

interface PricingConfig {
  _id: string;
  tier: 'free' | 'pro';
  name: string;
  amount: {
    value: number;
    currency: string;
  };
  dodoProductId: string;
  metadata?: {
    features?: string[];
    description?: string;
  };
}

interface SubscriptionClientProps {
  pricingConfigs: PricingConfig[];
  currentTier: string;
  hasPendingPayment: boolean;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export function SubscriptionClient({
  pricingConfigs,
  currentTier,
  hasPendingPayment,
  currentPeriodEnd,
  cancelAtPeriodEnd,
}: SubscriptionClientProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(cancelAtPeriodEnd);

  const proConfig = pricingConfigs.find((c) => c.tier === 'pro');
  const freeConfig = pricingConfigs.find((c) => c.tier === 'free');

  // Use shared pricing constants as fallback for features/description
  const freeFeatures =
    freeConfig?.metadata?.features ?? PRICING_TIERS.free.features;
  const freeDescription =
    freeConfig?.metadata?.description ?? PRICING_TIERS.free.description;

  const handleSelectPlan = async (tier: string) => {
    if (tier === currentTier) return;

    setLoadingTier(tier);
    setError(null);

    try {
      const response = await fetch('/api/payments/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          successUrl: `${window.location.origin}/settings/subscription`,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || 'Failed to initialize payment');
      }

      if (res.data.status === 'completed') {
        window.location.reload();
      } else if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoadingTier(null);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    setError(null);

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || 'Failed to cancel subscription');
      }

      setCancelSuccess(true);
      setShowCancelDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isProCurrent = currentTier === 'pro';
  const isFreeCurrent = currentTier === 'free';

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Subscription</h1>
        <p className="text-muted">
          {isProCurrent
            ? 'You have access to all Pro features'
            : 'Upgrade to unlock powerful features'}
        </p>
      </div>

      {/* Current Status */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">Current plan:</span>
          <Badge
            variant={isProCurrent ? 'accent' : 'default'}
            className="capitalize"
          >
            {currentTier}
          </Badge>
          {hasPendingPayment && (
            <Badge
              variant="warning"
              pulse
            >
              Payment Processing
            </Badge>
          )}
        </div>
        {isProCurrent && cancelSuccess && currentPeriodEnd && (
          <Badge variant="warning">
            Subscription ends on {formatDate(currentPeriodEnd)}
          </Badge>
        )}
        {isProCurrent && !cancelSuccess && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted hover:text-red-400 text-xs"
            onClick={() => setShowCancelDialog(true)}
          >
            Cancel subscription
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Pro Card - Hero Section */}
      {proConfig && (
        <Tilt
          rotationFactor={2}
          isRevese
        >
          <PricingCard
            tier={PRICING_TIERS.pro.name}
            price={formatPrice(proConfig.amount)}
            description={PRICING_TIERS.pro.description}
            features={[...PRICING_TIERS.pro.features]}
            highlighted
            highlightedText="Recommended"
            actionContent={
              currentTier === 'pro' ? (
                'Already subscribed'
              ) : (
                <>
                  <Zap /> Upgrade to Pro
                </>
              )
            }
            className="max-w-100 mx-auto"
            onClick={() =>
              isProCurrent && !cancelSuccess
                ? setShowCancelDialog(true)
                : handleSelectPlan('pro')
            }
            status={
              loadingTier === 'pro'
                ? 'loading'
                : currentTier === 'pro'
                ? 'subscribed'
                : 'default'
            }
          />
        </Tilt>
      )}

      {/* Free Plan - Compact Section */}
      {freeConfig && (
        <div
          className={cn(
            'relative p-6 rounded-2xl border transition-all duration-300',
            isFreeCurrent
              ? 'bg-surface-elevated border-border'
              : 'bg-surface border-border/50 hover:border-border'
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold">{freeConfig.name}</h3>
                {isFreeCurrent && (
                  <Badge
                    variant="default"
                    size="sm"
                  >
                    Current
                  </Badge>
                )}
              </div>
              <p className="text-muted text-sm">{freeDescription}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {freeFeatures.slice(0, 3).map((feature, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs text-muted"
                  >
                    <svg
                      className="w-3 h-3 text-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 sm:flex-shrink-0">
              <div className="text-right">
                <span className="text-2xl font-bold text-foreground">Free</span>
                <span className="text-muted text-sm block">forever</span>
              </div>

              {isFreeCurrent ? (
                <Button
                  variant="secondary"
                  size="md"
                  className="rounded-xl whitespace-nowrap"
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="md"
                  className="rounded-xl whitespace-nowrap text-muted hover:text-foreground"
                  disabled={loadingTier !== null}
                  isLoading={loadingTier === 'free'}
                  onClick={() => handleSelectPlan('free')}
                >
                  Switch to Free
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {/* <p className="text-sm text-muted text-center">
        Questions about billing?{' '}
        <a
          href="mailto:support@example.com"
          className="text-accent hover:underline"
        >
          Contact support
        </a>
      </p> */}

      {/* Cancel Subscription Dialog */}
      <Dialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your Pro subscription?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="text-sm text-muted">
              You&apos;ll lose access to Pro features including:
            </p>
            <ul className="text-sm text-muted list-disc list-inside space-y-1">
              <li>Unlimited webhooks</li>
              <li>Unlimited events</li>
              <li>30-day event retention</li>
              <li>Priority support</li>
            </ul>
            {currentPeriodEnd && (
              <p className="text-sm font-medium text-foreground mt-4">
                Your access will end on {formatDate(currentPeriodEnd)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowCancelDialog(false)}
              disabled={isCancelling}
            >
              Keep Subscription
            </Button>
            <Button
              variant="primary"
              className="bg-red-500 hover:bg-red-600"
              onClick={handleCancelSubscription}
              isLoading={isCancelling}
            >
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProCard({
  isCurrent,
  config,
  disabled,
  isLoading,
  onClick,
}: {
  isCurrent?: boolean;
  config: PricingConfig;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}) {
  const proFeatures = config?.metadata?.features ?? PRICING_TIERS.pro.features;
  const proDescription =
    config?.metadata?.description ?? PRICING_TIERS.pro.description;
  return (
    <Card
      variant="gradient"
      glow={!isCurrent}
      className={cn(
        'relative overflow-hidden p-8 max-w-100 mx-auto',
        isCurrent && 'border-emerald-500/30'
      )}
    >
      {/* Background gradient decoration */}
      <div className="absolute inset-0 bg-linear-to-br from-accent/5 via-transparent to-accent/10 pointer-events-none" />

      {/* Badge */}
      <div className="relative flex justify-between items-start mb-6">
        <div>
          {isCurrent ? (
            <Badge
              variant="success"
              size="sm"
            >
              Your Current Plan
            </Badge>
          ) : (
            <Badge
              variant="accent"
              size="sm"
            >
              Recommended
            </Badge>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="relative mb-8">
        <h2 className="text-3xl font-bold mb-2">{config.name}</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-foreground">
            {formatPrice(config.amount)}
          </span>
          <span className="text-muted text-lg">/month</span>
        </div>
        <p className="text-muted mt-3 text-base">{proDescription}</p>
      </div>

      {/* Features Grid */}
      <div className="relative grid gap-4 mb-8">
        {proFeatures.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 border border-border/50"
          >
            <div className="shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative">
        {isCurrent ? (
          <Button
            variant="success"
            size="lg"
            className="w-full rounded-xl"
            disabled
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            You're on Pro
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            className="w-full rounded-xl"
            disabled={disabled}
            isLoading={isLoading}
            onClick={onClick}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Upgrade to Pro
          </Button>
        )}
      </div>
    </Card>
  );
}
