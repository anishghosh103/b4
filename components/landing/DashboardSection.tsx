'use client';

import { DashboardEvent } from '@/components/features';
import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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

export function DashboardSection() {
  const [dashboardView, setDashboardView] = useState<'events' | 'workflows'>(
    'events'
  );
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const events = [
    {
      event: { cliResponse: { status: 200 } } as any,
      name: 'payment_intent.succeeded',
      platform: 'stripe' as const,
      time: '2s ago',
      status: 'success' as const,
    },
    {
      event: { cliResponse: { status: 200 } } as any,
      name: 'envelope-completed',
      platform: 'docusign' as const,
      time: '1m ago',
      status: 'success' as const,
    },
    {
      event: { cliResponse: { status: 200 } } as any,
      name: 'payment.succeeded',
      platform: 'dodo' as const,
      time: '5m ago',
      status: 'success' as const,
    },
    {
      event: { cliResponse: { status: 500 } } as any,
      name: 'payment_intent.payment_failed',
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
