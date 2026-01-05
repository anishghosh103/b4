'use client';

import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ComparisonSection() {
  const [activeTab, setActiveTab] = useState<'ngrok' | 'webhooksite' | 'diy'>(
    'ngrok'
  );

  const comparisons = {
    ngrok: {
      headline: 'Tired of ngrok URL shuffling?',
      body: 'ngrok is great for tunneling. But for webhooks, you need more. Permanent URLs that never change, full event history with replay, built-in signature verification, and team collaboration—all without the $240/year price tag for a static domain.',
      bullets: [
        "Permanent URLs on free tier (vs ngrok's $8/mo)",
        'Full event history with one-click replay',
        'Built-in Stripe/DocuSign signature verification',
        'See exactly what payload hit your endpoint',
      ],
    },
    webhooksite: {
      headline: 'More than just inspecting',
      body: 'webhook.site shows you what came in. HookOne lets you replay it, route it to localhost, and test with mock events—without leaving your development workflow.',
      bullets: [
        'Forward webhooks to localhost with CLI',
        'Replay any event to test your code',
        'Mock workflows for Stripe, DocuSign, Dodo',
        'Team collaboration and sharing',
      ],
    },
    diy: {
      headline: 'Stop building webhook infrastructure',
      body: "You're building a product, not a webhook management system. Get logging, replay, verification, and routing out of the box—so you can focus on what matters.",
      bullets: [
        'Event logging with full payload capture',
        'One-click replay for debugging',
        'Signature verification for all major platforms',
        'Localhost relay without network config',
      ],
    },
  };

  const current = comparisons[activeTab];

  return (
    <section className="py-28 px-6 border-y border-border/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why developers switch to HookOne
          </h2>
          <p className="text-muted">
            See how HookOne compares to what you&apos;re using today.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {[
            { key: 'ngrok', label: 'vs ngrok' },
            { key: 'webhooksite', label: 'vs webhook.site' },
            { key: 'diy', label: 'vs DIY' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key as 'ngrok' | 'webhooksite' | 'diy')
              }
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-accent text-background'
                  : 'bg-surface-elevated border border-border text-muted hover:text-foreground hover:border-accent/30'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <Card
          variant="gradient"
          className="p-8"
        >
          <h3 className="text-xl font-bold mb-4">{current.headline}</h3>
          <p className="text-muted leading-relaxed mb-6">{current.body}</p>

          <div className="grid sm:grid-cols-2 gap-3">
            {current.bullets.map((bullet, i) => (
              <div
                key={i}
                className="flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-foreground">{bullet}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
