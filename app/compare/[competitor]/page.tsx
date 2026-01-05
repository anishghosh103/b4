import { AuthLinkWrapper } from '@/components/features/auth-link-wrapper';
import { FAQJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { Badge, Button, Card } from '@/components/ui';
import { competitorSlugs, getCompetitor } from '@/lib/data/competitors';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Generate static params for all competitors
export function generateStaticParams() {
  return competitorSlugs.map((competitor) => ({
    competitor,
  }));
}

// Generate metadata for each comparison page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ competitor: string }>;
}): Promise<Metadata> {
  const { competitor: slug } = await params;
  const competitor = getCompetitor(slug);

  if (!competitor) {
    return {
      title: 'Comparison Not Found',
    };
  }

  return {
    title: `${competitor.displayName} - ${competitor.tagline}`,
    description: competitor.description,
    keywords: competitor.keywords,
    alternates: {
      canonical: `/compare/${slug}`,
    },
    openGraph: {
      title: `${competitor.displayName} | HookOne`,
      description: competitor.description,
      type: 'website',
      url: `https://hookone.dev/compare/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${competitor.displayName} | HookOne`,
      description: competitor.description,
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

// Check/X icons
function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-emerald-400"
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
  );
}

function XIcon() {
  return (
    <svg
      className="w-5 h-5 text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function renderValue(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value ? <CheckIcon /> : <XIcon />;
  }
  return <span className="text-sm">{value}</span>;
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ competitor: string }>;
}) {
  const { competitor: slug } = await params;
  const competitor = getCompetitor(slug);

  if (!competitor) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <WebPageJsonLd
        name={competitor.displayName}
        description={competitor.description}
        url={`https://hookone.dev/compare/${slug}`}
        breadcrumbs={[
          { name: 'Home', url: 'https://hookone.dev' },
          { name: 'Compare', url: 'https://hookone.dev/compare' },
          { name: `vs ${competitor.name}` },
        ]}
      />
      <FAQJsonLd faqs={competitor.faq} />

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
          <Badge
            variant="accent"
            className="mb-6"
          >
            {competitor.tagline}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {competitor.heroHeadline}
          </h1>

          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            {competitor.heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthLinkWrapper>
              <Button size="lg">Try HookOne Free</Button>
            </AuthLinkWrapper>
            <Link href="#comparison">
              <Button
                variant="outline"
                size="lg"
              >
                See Comparison
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section
        id="comparison"
        className="py-20 px-6 border-t border-border/30"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 font-medium">
                    <span className="text-accent">HookOne</span>
                  </th>
                  <th className="text-center py-4 px-4 font-medium text-muted">
                    {competitor.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitor.comparisonTable.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50"
                  >
                    <td className="py-4 px-4">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        {renderValue(row.hookone)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-muted">
                      <div className="flex justify-center">
                        {renderValue(row.competitor)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* HookOne Advantages */}
      <section className="py-20 px-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Why Developers Choose HookOne
          </h2>
          <p className="text-center text-muted mb-12">
            Here&apos;s why HookOne is the better choice for webhook testing.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {competitor.hookoneAdvantages.map((advantage, i) => (
              <Card
                key={i}
                className="p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
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
                    <h3 className="font-semibold mb-2">{advantage.title}</h3>
                    <p className="text-sm text-muted">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Limitations */}
      <section className="py-20 px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {competitor.name} Limitations
          </h2>

          <div className="space-y-4">
            {competitor.competitorLimitations.map((limitation, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated/50 border border-border"
              >
                <XIcon />
                <span className="text-muted">{limitation}</span>
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
            {competitor.faq.map((item, i) => (
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
            Ready to switch from {competitor.name}?
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
