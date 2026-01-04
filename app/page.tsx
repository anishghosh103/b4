'use client';

import {
  DashboardEvent,
  EventStream,
  FeatureCard,
  PlatformLogo,
  PricingCard,
  UserMenu,
} from '@/components/features';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Badge, Button, Card } from '@/components/ui';
import { PRICING_TIERS } from '@/lib/constants/pricing';
import { cn } from '@/lib/utils';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

// Logo component
function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
        <svg
          className="w-5 h-5 text-background"
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
      </div>
      <span className="hidden sm:inline font-semibold text-lg">HookOne</span>
    </div>
  );
}

// Navigation component
function Navigation() {
  const { data: session } = useSession();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Docs
          </a>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          {session?.user ? (
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
              >
                Dashboard
              </Button>
            </Link>
          ) : null}
          <div className="ml-2">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="pt-36 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge
              variant="accent"
              pulse
              className="mb-6 animate-slide-up opacity-0"
              style={{ animationFillMode: 'forwards' }}
            >
              Your URL never changes
            </Badge>

            <h1
              className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 animate-slide-up opacity-0 delay-100"
              style={{ animationFillMode: 'forwards' }}
            >
              Webhook testing, <span className="text-accent">simplified</span>
            </h1>

            <p
              className="text-lg text-muted leading-normal mb-8 max-w-lg animate-slide-up opacity-0 delay-200"
              style={{ animationFillMode: 'forwards' }}
            >
              Get a permanent URL for all your webhooks. Inspect payloads,
              replay events, and relay to localhost. No more ngrok URL
              shuffling.
            </p>

            <div
              className="animate-slide-up opacity-0 delay-300"
              style={{ animationFillMode: 'forwards' }}
            >
              {session?.user ? (
                <Link href="/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  onClick={() => signIn('google')}
                >
                  Get started for free
                </Button>
              )}
            </div>
          </div>

          {/* Live Event Stream */}
          <div
            className="relative animate-slide-in-right opacity-0 delay-300"
            style={{ animationFillMode: 'forwards' }}
          >
            <div className="absolute -inset-8 bg-gradient-to-r from-accent/10 via-transparent to-violet-500/5 rounded-3xl blur-3xl" />
            <Card
              variant="gradient"
              className="relative p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium">Live Events</span>
                </div>
                <span className="text-xs text-muted font-mono px-2.5 py-1 rounded-lg bg-surface border border-border">
                  hookone.dev/wh/a1b2c3
                </span>
              </div>

              <EventStream />

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted">4 events received</span>
                <button className="text-xs text-accent hover:text-accent-dim transition-colors font-medium">
                  View all &rarr;
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Platforms Section
function PlatformsSection() {
  return (
    <section className="py-16 px-6 border-y border-border/30">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm text-muted mb-8">
          Works with your favorite platforms
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <PlatformLogo
            name="Stripe"
            color="violet"
          />
          <PlatformLogo
            name="DodoPayments"
            color="emerald"
          />
          <PlatformLogo
            name="DocuSign"
            color="yellow"
          />
          <PlatformLogo
            name="PandaDoc"
            color="green"
          />
          {/* <PlatformLogo
            name="GitHub"
            color="zinc"
          /> */}
          {/* <PlatformLogo
            name="Shopify"
            color="lime"
          /> */}
          {/* <PlatformLogo
            name="Twilio"
            color="red"
          /> */}
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      title: 'Permanent URLs',
      description:
        'Your webhook URL never expires or changes. Set it once in Stripe, DocuSign, or any platform and forget about it.',
      delay: 'delay-100',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'Localhost Relay',
      description:
        'Forward webhooks to your local development server with a single CLI command. No network configuration needed.',
      delay: 'delay-200',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      title: 'Event Replay',
      description:
        'Replay any webhook event with one click. Perfect for debugging edge cases and testing error handling.',
      delay: 'delay-300',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      title: 'Payload Inspector',
      description:
        'View headers, body, and metadata of every webhook in a clean interface. Export to JSON or cURL.',
      delay: 'delay-400',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      title: 'Mock Workflows',
      description:
        'Test your integration without signing up for third-party services. We simulate webhooks from Stripe, Dodo, and more.',
      delay: 'delay-500',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: 'Secure by Default',
      description:
        'Signature verification, HTTPS only, and automatic secret rotation. Your webhooks are protected at every step.',
      delay: 'delay-600',
    },
  ];

  return (
    <section
      id="features"
      className="py-28 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for webhook testing
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            From development to production, HookOne gives you the tools to build
            reliable webhook integrations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Dashboard Preview Section
function DashboardSection() {
  const [dashboardView, setDashboardView] = useState<'events' | 'workflows'>(
    'events'
  );
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const events = [
    {
      event: 'payment_intent.succeeded',
      platform: 'stripe' as const,
      time: '2s ago',
      status: 'success' as const,
    },
    {
      event: 'envelope-completed',
      platform: 'docusign' as const,
      time: '1m ago',
      status: 'success' as const,
    },
    {
      event: 'payment.succeeded',
      platform: 'dodo' as const,
      time: '5m ago',
      status: 'success' as const,
    },
    {
      event: 'payment_intent.payment_failed',
      platform: 'stripe' as const,
      time: '1h ago',
      status: 'error' as const,
    },
  ];

  const workflows = [
    {
      name: 'Stripe Payment Flow',
      events: 4,
      platform: 'Stripe',
      color: 'violet',
    },
    {
      name: 'DocuSign Envelope Flow',
      events: 4,
      platform: 'DocuSign',
      color: 'yellow',
    },
    { name: 'GitHub PR Flow', events: 4, platform: 'GitHub', color: 'zinc' },
    {
      name: 'Dodo Payments Flow',
      events: 4,
      platform: 'Dodo',
      color: 'emerald',
    },
  ];

  const getWorkflowSteps = (name: string) => {
    const stepsMap: Record<string, { event: string; desc: string }[]> = {
      'Stripe Payment Flow': [
        { event: 'payment_intent.created', desc: 'Customer initiates payment' },
        {
          event: 'payment_intent.processing',
          desc: 'Payment is being processed',
        },
        { event: 'charge.succeeded', desc: 'Charge completed successfully' },
        { event: 'payment_intent.succeeded', desc: 'Payment intent fulfilled' },
      ],
      'DocuSign Envelope Flow': [
        {
          event: 'envelope-sent',
          desc: 'Email notification sent to recipient',
        },
        { event: 'envelope-delivered', desc: 'Recipient opened envelope' },
        { event: 'recipient-completed', desc: 'Recipient completed signing' },
        { event: 'envelope-completed', desc: 'All recipients finished' },
      ],
      'GitHub PR Flow': [
        { event: 'pull_request.opened', desc: 'Pull request created' },
        { event: 'pull_request.synchronize', desc: 'New commits pushed' },
        { event: 'check_run.completed', desc: 'CI checks passed' },
        { event: 'pull_request.closed', desc: 'PR merged (merged=true)' },
      ],
      'Dodo Payments Flow': [
        { event: 'payment.succeeded', desc: 'Payment confirmed' },
        { event: 'subscription.created', desc: 'Subscription initialized' },
        { event: 'subscription.active', desc: 'Subscription activated' },
        { event: 'refund.created', desc: 'Refund processed' },
      ],
    };
    return stepsMap[name] || stepsMap['Dodo Payments Flow'];
  };

  return (
    <section className="py-28 px-6 border-y border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A dashboard built for developers
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Clean, fast, and packed with the details you need. No bloat, no
            confusion.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-accent/5 via-transparent to-violet-500/5 rounded-3xl blur-3xl" />
          <Card
            variant="elevated"
            className="relative overflow-hidden"
          >
            {/* Dashboard Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-elevated/50">
              <div className="flex items-center gap-4">
                <Logo className="scale-90" />
                <div className="h-5 w-px bg-border" />
                <span className="text-sm text-muted">my-project</span>
              </div>
              <Badge
                variant="success"
                pulse
                size="sm"
              >
                hookone.dev/wh/a1b2c3
              </Badge>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-52 border-r border-border p-4 hidden md:block bg-surface/50">
                <div className="space-y-1">
                  {[
                    {
                      key: 'events',
                      label: 'Events',
                      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                    },
                    {
                      key: 'workflows',
                      label: 'Workflows',
                      icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
                    },
                    {
                      key: 'settings',
                      label: 'Settings',
                      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
                    },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (item.key !== 'settings') {
                          setDashboardView(item.key as 'events' | 'workflows');
                          setSelectedWorkflow(null);
                        }
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        dashboardView === item.key
                          ? 'bg-accent/10 text-amber-600'
                          : 'text-muted hover:bg-surface-elevated hover:text-foreground'
                      )}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 min-h-[400px]">
                {dashboardView === 'events' ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold">Recent Events</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Filter
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setDashboardView('workflows')}
                        >
                          + New Workflow
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      {events.map((item, i) => (
                        <DashboardEvent
                          key={i}
                          {...item}
                        />
                      ))}
                    </div>
                  </>
                ) : selectedWorkflow ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={() => setSelectedWorkflow(null)}
                        className="p-2 rounded-xl hover:bg-surface-elevated transition-colors text-muted hover:text-foreground"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <h3 className="font-semibold">{selectedWorkflow}</h3>
                      <Badge
                        variant="success"
                        size="sm"
                      >
                        Ready
                      </Badge>
                    </div>

                    <Card
                      variant="default"
                      className="p-5 mb-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted">
                          Workflow Steps
                        </span>
                        <span className="text-xs text-muted">4 events</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-3 bottom-3 w-px bg-border" />
                        <div className="space-y-4">
                          {getWorkflowSteps(selectedWorkflow).map((step, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-4 relative"
                            >
                              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs text-accent font-medium z-10">
                                {i + 1}
                              </div>
                              <div className="flex-1 pt-0.5">
                                <span className="font-mono text-sm text-foreground">
                                  {step.event}
                                </span>
                                <p className="text-xs text-muted mt-0.5">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    <div className="flex gap-3">
                      <Button
                        variant="success"
                        className="flex-1"
                      >
                        Run Workflow
                      </Button>
                      <Button variant="outline">Edit</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold">Mock Workflows</h3>
                      <Button size="sm">+ Create Custom</Button>
                    </div>
                    <div className="grid gap-3">
                      {workflows.map((workflow, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedWorkflow(workflow.name)}
                          className={cn(
                            'group flex items-center gap-4 px-4 py-4 rounded-xl text-left w-full',
                            'bg-surface-elevated/50 border border-border',
                            'hover:bg-surface-elevated hover:border-accent/20',
                            'transition-all duration-200'
                          )}
                        >
                          <div
                            className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center',
                              workflow.color === 'violet' && 'bg-violet-500/10',
                              workflow.color === 'yellow' && 'bg-yellow-500/10',
                              workflow.color === 'zinc' && 'bg-zinc-500/10',
                              workflow.color === 'emerald' &&
                                'bg-emerald-500/10'
                            )}
                          >
                            <svg
                              className={cn(
                                'w-5 h-5',
                                workflow.color === 'violet' &&
                                  'text-violet-400',
                                workflow.color === 'yellow' &&
                                  'text-yellow-400',
                                workflow.color === 'zinc' && 'text-zinc-400',
                                workflow.color === 'emerald' &&
                                  'text-emerald-400'
                              )}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-sm text-foreground">
                              {workflow.name}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted">
                                {workflow.platform}
                              </span>
                              <span className="text-xs text-muted">&bull;</span>
                              <span className="text-xs text-muted">
                                {workflow.events} events
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant="success"
                            size="sm"
                          >
                            Ready
                          </Badge>
                          <svg
                            className="w-4 h-4 text-muted group-hover:text-accent transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Mock Workflows Section
function MockWorkflowsSection() {
  const platforms = [
    { name: 'Stripe', desc: 'Payment intents, subscriptions, invoices' },
    { name: 'DodoPayments', desc: 'Payment events, refunds, disputes' },
    { name: 'DocuSign', desc: 'Envelope status, recipient events' },
    // { name: 'GitHub', desc: 'Push, PR, issue, and deployment events' },
  ];

  const steps = [
    { event: 'payment_intent.created', desc: 'Intent initialized' },
    { event: 'payment_intent.processing', desc: 'Processing payment' },
    { event: 'charge.succeeded', desc: 'Charge completed' },
    { event: 'payment_intent.succeeded', desc: 'Payment fulfilled' },
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge
              variant="success"
              pulse
              className="mb-6"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              Mock Workflows
            </Badge>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Test without signing up for anything
            </h2>

            <p className="text-muted leading-relaxed mb-8">
              Skip the account creation dance. Use our pre-built workflows to
              simulate webhooks from popular platforms. Perfect for testing your
              integration logic before going live.
            </p>

            <div className="space-y-4">
              {platforms.map((platform, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors">
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
                  <div>
                    <div className="font-medium text-sm">{platform.name}</div>
                    <div className="text-xs text-muted">{platform.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/10 via-transparent to-accent/5 rounded-3xl blur-3xl" />
            <Card
              variant="gradient"
              className="relative p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-medium">Stripe Payment Flow</h4>
                <Badge
                  variant="success"
                  size="sm"
                >
                  Ready
                </Badge>
              </div>

              <div className="space-y-3.5">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-xs text-muted font-medium">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <span className="font-mono text-sm text-foreground">
                        {step.event}
                      </span>
                      <span className="text-xs text-muted ml-2">
                        {step.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="success"
                className="w-full mt-6"
              >
                Run Workflow
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
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

// CTA Section
function CTASection() {
  const { data: session } = useSession();

  return (
    <section
      id="cta"
      className="py-28 px-6 border-t border-border/30"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to simplify your webhook testing?
        </h2>
        <p className="text-muted mb-10 text-lg">
          Get started today. No credit card required.
        </p>
        {session?.user ? (
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        ) : (
          <Button
            size="lg"
            onClick={() => signIn('google')}
          >
            Get started for free
          </Button>
        )}
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <div className="text-sm text-muted">
            Made by{' '}
            <a
              href="https://x.com/anishghosh103"
              target="_blank"
              className="text-amber-600 dark:text-amber-500 hover:underline hover:underline-offset-2"
            >
              @anishghosh103
            </a>
          </div>
          {/* <div className="flex items-center gap-8 text-sm text-muted">
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Discord
            </a>
          </div> */}
          <p className="text-sm text-muted">
            &copy; 2025 HookOne. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function Home() {
  return (
    <div className="min-h-screen bg-background grid-bg mesh-gradient">
      <Navigation />
      <HeroSection />
      <PlatformsSection />
      <FeaturesSection />
      <DashboardSection />
      <MockWorkflowsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
