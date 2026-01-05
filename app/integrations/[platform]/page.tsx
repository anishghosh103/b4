import { AuthLinkWrapper } from '@/components/features/auth-link-wrapper';
import { FAQJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { Badge, Button, Card } from '@/components/ui';
import { getPlatform, platformSlugs } from '@/lib/data/platforms';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Generate static params for all platforms
export function generateStaticParams() {
  return platformSlugs.map((platform) => ({
    platform,
  }));
}

// Generate metadata for each platform page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string }>;
}): Promise<Metadata> {
  const { platform: slug } = await params;
  const platform = getPlatform(slug);

  if (!platform) {
    return {
      title: 'Integration Not Found',
    };
  }

  return {
    title: `${platform.displayName} | HookOne`,
    description: platform.description,
    keywords: platform.keywords,
    alternates: {
      canonical: `/integrations/${slug}`,
    },
    openGraph: {
      title: `${platform.displayName} | HookOne`,
      description: platform.description,
      type: 'website',
      url: `https://hookone.dev/integrations/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${platform.displayName} | HookOne`,
      description: platform.description,
    },
  };
}

// Logo component
function Logo() {
  return (
    <div className="flex items-center gap-2">
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
      <span className="font-semibold text-lg">HookOne</span>
    </div>
  );
}

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform: slug } = await params;
  const platform = getPlatform(slug);

  if (!platform) {
    notFound();
  }

  const colorClasses: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    violet: {
      bg: 'bg-violet-500/10',
      text: 'text-violet-400',
      border: 'border-violet-500/30',
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/30',
    },
  };

  const colors = colorClasses[platform.color] || colorClasses.violet;

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <WebPageJsonLd
        name={platform.displayName}
        description={platform.description}
        url={`https://hookone.dev/integrations/${slug}`}
        breadcrumbs={[
          { name: 'Home', url: 'https://hookone.dev' },
          { name: 'Integrations', url: 'https://hookone.dev/integrations' },
          { name: platform.name },
        ]}
      />
      <FAQJsonLd faqs={platform.faq} />

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <AuthLinkWrapper>
              <Button size="sm">Get Started Free</Button>
            </AuthLinkWrapper>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className={cn('mb-6', colors.bg, colors.text, colors.border)}>
            {platform.name} Integration
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {platform.displayName}
          </h1>

          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            {platform.longDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthLinkWrapper>
              <Button size="lg">Get Your Permanent URL</Button>
            </AuthLinkWrapper>
            <Link href="/docs">
              <Button
                variant="outline"
                size="lg"
              >
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why use HookOne for {platform.name}?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {platform.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl bg-surface-elevated/50 border border-border"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    colors.bg
                  )}
                >
                  <svg
                    className={cn('w-4 h-4', colors.text)}
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
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Webhook Events Section */}
      {/* <section className="py-20 px-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Supported {platform.name} Webhook Events
          </h2>
          <p className="text-center text-muted mb-12">
            HookOne captures, stores, and lets you replay these events.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {platform.webhookEvents.map((event, i) => (
              <Card
                key={i}
                className="p-4"
              >
                <code className={cn('text-sm font-mono', colors.text)}>
                  {event.name}
                </code>
                <p className="text-sm text-muted mt-1">{event.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Setup Steps Section */}
      <section className="py-20 px-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Get Started in 4 Steps
          </h2>
          <p className="text-center text-muted mb-12">
            Set up {platform.name} webhook testing in under 5 minutes.
          </p>

          <div className="space-y-6">
            {platform.setupSteps.map((step, i) => (
              <div
                key={i}
                className="flex gap-6 items-start"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0',
                    colors.bg,
                    colors.text
                  )}
                >
                  {i + 1}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {platform.faq.map((item, i) => (
              <Card
                key={i}
                className="p-6"
              >
                <h3 className="font-semibold mb-3">{item.question}</h3>
                <p className="text-muted">{item.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to simplify {platform.name} webhook testing?
          </h2>
          <p className="text-muted mb-8">
            Get your permanent webhook URL in seconds. Free to start.
          </p>
          <AuthLinkWrapper>
            <Button size="lg">Get Started Free</Button>
          </AuthLinkWrapper>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/docs"
              className="hover:text-foreground transition-colors"
            >
              Docs
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
              Privacy
            </Link>
          </div>
          <p className="text-sm text-muted">
            &copy; 2025 HookOne. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
