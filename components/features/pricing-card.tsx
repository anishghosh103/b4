'use client';

import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  tier: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  className?: string;
}

export function PricingCard({
  tier,
  price,
  description,
  features,
  highlighted = false,
  className,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col p-8',
        highlighted && 'border-accent/50 glow-amber-sm',
        !highlighted && 'hover:border-accent/20',
        className
      )}
    >
      {/* Popular badge */}
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-background text-xs font-medium rounded-full">
          Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1">{tier}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-bold text-foreground">{price}</span>
          {price !== 'Free' && <span className="text-muted">/month</span>}
        </div>
        <p className="text-muted text-sm">{description}</p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-sm"
          >
            <svg
              className="w-4 h-4 text-accent shrink-0"
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
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        variant={highlighted ? 'primary' : 'secondary'}
        size="lg"
        className="w-full rounded-lg"
        onClick={() => {
          document
            .getElementById('waitlist')
            ?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        Join Waitlist
      </Button>
    </Card>
  );
}
