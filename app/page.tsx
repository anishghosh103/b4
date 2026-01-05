import {
  FeatureCard,
  PlatformLogo,
} from '@/components/features';
import {
  Navigation,
  HeroSection,
  ComparisonSection,
  DashboardSection,
  PricingSection,
  FAQSection,
  CTASection,
} from '@/components/landing';
import { HomepageJsonLd } from '@/components/seo/JsonLd';
import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Logo component (static - can be server component)
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

// Problem Section (static content - server rendered for SEO)
function ProblemSection() {
  const painPoints = [
    '"I updated my webhook URL in Stripe for the 100th time this month"',
    '"My teammate restarted ngrok and broke my test"',
    '"I can\'t replay that webhook event—it\'s gone forever"',
    '"I have 5 different sandbox accounts just to test payments"',
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">
          Sound familiar?
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-surface-elevated/50 border border-border text-left"
            >
              <p className="text-muted italic text-sm leading-relaxed">
                {point}
              </p>
            </div>
          ))}
        </div>

        <p className="text-muted">
          If any of these hit home, you&apos;re not alone.{' '}
          <span className="text-foreground font-medium">
            Webhook testing shouldn&apos;t be this painful.
          </span>
        </p>
      </div>
    </section>
  );
}

// Platforms Section (static - server rendered for SEO)
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
        </div>
      </div>
    </section>
  );
}

// Features Section (static content - server rendered for SEO)
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
      title: 'Set once. Never touch again.',
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
      title: 'Test locally without the URL dance',
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
      title: 'Replay any webhook. Debug anything.',
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
      title: 'See exactly what came in',
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
      title: 'Test without sandbox accounts',
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
      title: 'Bank-level security, zero config',
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

// Mock Workflows Section (static - server rendered for SEO)
function MockWorkflowsSection() {
  const platforms = [
    { name: 'Stripe', desc: 'Payment intents, subscriptions, invoices' },
    { name: 'DodoPayments', desc: 'Payment events, refunds, disputes' },
    { name: 'DocuSign', desc: 'Envelope status, recipient events' },
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

// Footer (static - server rendered for SEO)
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span>&middot;</span>
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
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted">
            <Link
              href="/docs"
              className="hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-sm text-muted">
            &copy; 2025 HookOne. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component (Server Component)
export default function Home() {
  return (
    <div className="min-h-screen bg-background grid-bg mesh-gradient">
      {/* JSON-LD Structured Data for SEO */}
      <HomepageJsonLd />

      {/* Client Components */}
      <Navigation />
      <HeroSection />

      {/* Server Components (static content - SEO optimized) */}
      <ProblemSection />
      <PlatformsSection />
      <FeaturesSection />

      {/* Client Components */}
      <ComparisonSection />
      <DashboardSection />

      {/* Server Components */}
      <MockWorkflowsSection />

      {/* Client Components */}
      <PricingSection />
      <FAQSection />
      <CTASection />

      {/* Server Component */}
      <Footer />
    </div>
  );
}
