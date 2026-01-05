'use client';

import { EventStream } from '@/components/features';
import { Badge, Button, Card } from '@/components/ui';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();

  const copyCommand = async () => {
    await navigator.clipboard.writeText(
      `npx hookone 3000 53709ded /api/webhook`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge
              variant="accent"
              pulse
              className="mb-6 animate-slide-up opacity-0"
              style={{ animationFillMode: 'forwards' }}
            >
              Stop updating webhook URLs
            </Badge>

            <h1
              className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 animate-slide-up opacity-0 delay-100"
              style={{ animationFillMode: 'forwards' }}
            >
              One webhook URL. <span className="text-accent">Forever.</span>
            </h1>

            <p
              className="text-lg text-muted leading-normal mb-8 max-w-lg animate-slide-up opacity-0 delay-200"
              style={{ animationFillMode: 'forwards' }}
            >
              Get a permanent webhook URL that never changes. Stop updating
              Stripe, DocuSign, and payment providers every time ngrok restarts.
              Inspect, replay, and relay to localhost—all for free.
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
                  Get your permanent URL
                </Button>
              )}
            </div>
          </div>

          {/* Live Event Stream */}
          <div
            className="relative animate-slide-in-right opacity-0 delay-300 space-y-4"
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
            {/* CLI Install */}
            <div
              className="animate-slide-up opacity-0 delay-400"
              style={{ animationFillMode: 'forwards' }}
            >
              <div
                className="code-block cursor-pointer group"
                onClick={copyCommand}
              >
                <div className="code-header">
                  <div className="code-dot bg-red-500/80" />
                  <div className="code-dot bg-yellow-500/80" />
                  <div className="code-dot bg-green-500/80" />
                  <span className="ml-2 text-xs text-muted">terminal</span>
                  <span className="ml-auto text-xs text-muted group-hover:text-accent transition-colors">
                    {copied ? 'Copied!' : 'Click to copy'}
                  </span>
                </div>
                <div className="p-4 font-mono text-sm">
                  <span className="text-muted">$</span>{' '}
                  <span className="text-emerald-400">npx</span>{' '}
                  <span className="text-foreground">
                    hookone 3000 53709ded /api/webhook
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
