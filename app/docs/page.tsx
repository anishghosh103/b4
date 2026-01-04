import { AppHeader } from '@/components/features';
import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Documentation - Getting Started | HookOne',
  description:
    'Learn how to set up HookOne, create your permanent webhook URL, and relay webhooks to localhost with our CLI.',
  keywords: [
    'hookone docs',
    'webhook testing guide',
    'hookone cli',
    'webhook localhost relay setup',
  ],
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background grid-bg mesh-gradient">
      <AppHeader
        left={
          <Link href="/">
            <Logo />
          </Link>
        }
        right={<ThemeSwitcher />}
      />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Getting Started with HookOne
        </h1>
        <p className="text-lg text-muted mb-12">
          Set up your permanent webhook URL in under a minute. No configuration
          files, no expiring tunnels.
        </p>

        {/* Quick Start */}
        <section className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold">Quick Start</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sign in with Google</h3>
                <p className="text-muted">
                  Click the &quot;Get Started&quot; button on the homepage and
                  sign in with your Google account. No credit card required for
                  the free tier.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Copy your permanent webhook URL
                </h3>
                <p className="text-muted mb-3">
                  After signing in, you&apos;ll see your dashboard with a
                  permanent webhook URL like:
                </p>
                <div className="code-block">
                  <div className="code-header">
                    <div className="code-dot bg-red-500/80" />
                    <div className="code-dot bg-yellow-500/80" />
                    <div className="code-dot bg-green-500/80" />
                    <span className="ml-2 text-xs text-muted">webhook url</span>
                  </div>
                  <div className="p-4 font-mono text-sm break-all">
                    https://hookone.dev/wh/a1b2c3d4
                  </div>
                </div>
                <p className="text-muted mt-3">
                  Use this URL in your webhook provider (Stripe, DocuSign,
                  etc.). It never expires or changes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Relay webhooks to localhost
                </h3>
                <p className="text-muted mb-3">
                  Run the CLI command to forward incoming webhooks to your local
                  development server:
                </p>
                <div className="code-block">
                  <div className="code-header">
                    <div className="code-dot bg-red-500/80" />
                    <div className="code-dot bg-yellow-500/80" />
                    <div className="code-dot bg-green-500/80" />
                    <span className="ml-2 text-xs text-muted">terminal</span>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <span className="text-muted">$</span>{' '}
                    <span className="text-emerald-400">npx</span>{' '}
                    <span className="text-foreground">
                      hookone 3000 a1b2c3d4 /api/webhook
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLI Usage */}
        <section className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold">CLI Usage</h2>
          <p className="text-muted">
            The HookOne CLI forwards webhooks from your permanent URL to your
            local development server.
          </p>

          <div className="code-block">
            <div className="code-header">
              <div className="code-dot bg-red-500/80" />
              <div className="code-dot bg-yellow-500/80" />
              <div className="code-dot bg-green-500/80" />
              <span className="ml-2 text-xs text-muted">syntax</span>
            </div>
            <div className="p-4 font-mono text-sm">
              npx hookone &lt;port&gt; &lt;webhook-id&gt; [path]
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="font-semibold">Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-semibold">
                      Parameter
                    </th>
                    <th className="text-left py-3 pr-4 font-semibold">
                      Required
                    </th>
                    <th className="text-left py-3 font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4 font-mono text-foreground">
                      port
                    </td>
                    <td className="py-3 pr-4">Yes</td>
                    <td className="py-3">
                      Your local server port (e.g., 3000, 8080)
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4 font-mono text-foreground">
                      webhook-id
                    </td>
                    <td className="py-3 pr-4">Yes</td>
                    <td className="py-3">
                      Your 8-character webhook ID from the dashboard
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-foreground">
                      path
                    </td>
                    <td className="py-3 pr-4">No</td>
                    <td className="py-3">Local endpoint path (default: /)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <h3 className="font-semibold">Examples</h3>
            <div className="space-y-3">
              <div className="code-block">
                <div className="code-header">
                  <div className="code-dot bg-red-500/80" />
                  <div className="code-dot bg-yellow-500/80" />
                  <div className="code-dot bg-green-500/80" />
                  <span className="ml-2 text-xs text-muted">
                    Next.js / Express
                  </span>
                </div>
                <div className="p-4 font-mono text-sm">
                  npx hookone 3000 a1b2c3d4 /api/webhook
                </div>
              </div>

              <div className="code-block">
                <div className="code-header">
                  <div className="code-dot bg-red-500/80" />
                  <div className="code-dot bg-yellow-500/80" />
                  <div className="code-dot bg-green-500/80" />
                  <span className="ml-2 text-xs text-muted">
                    Django / Flask
                  </span>
                </div>
                <div className="p-4 font-mono text-sm">
                  npx hookone 8000 a1b2c3d4 /webhooks/stripe
                </div>
              </div>

              <div className="code-block">
                <div className="code-header">
                  <div className="code-dot bg-red-500/80" />
                  <div className="code-dot bg-yellow-500/80" />
                  <div className="code-dot bg-green-500/80" />
                  <span className="ml-2 text-xs text-muted">Rails</span>
                </div>
                <div className="p-4 font-mono text-sm">
                  npx hookone 3000 a1b2c3d4 /stripe/webhooks
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Viewing Events */}
        <section className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold">Viewing Events</h2>
          <p className="text-muted">
            Every webhook sent to your URL is captured and displayed in your
            dashboard in real-time.
          </p>

          <div className="space-y-4">
            <h3 className="font-semibold">Event Details</h3>
            <p className="text-muted">For each event, you can inspect:</p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>HTTP headers (including signature headers)</li>
              <li>Request body (JSON, form data, raw)</li>
              <li>Timestamp and source IP</li>
              <li>Platform detection (Stripe, DocuSign, etc.)</li>
            </ul>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="font-semibold">Replaying Events</h3>
            <p className="text-muted">
              Click the replay button on any event to resend it to your local
              server. This is useful for:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Debugging webhook handlers without triggering real events</li>
              <li>Testing error handling and edge cases</li>
              <li>Developing offline with previously captured events</li>
            </ul>
          </div>
        </section>

        {/* Mock Workflows */}
        <section className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold">Mock Workflows</h2>
          <p className="text-muted">
            Test your webhook handlers without creating sandbox accounts or
            triggering real transactions. Mock workflows send realistic webhook
            payloads to your URL.
          </p>

          <div className="space-y-4 mt-6">
            <h3 className="font-semibold">Available Platforms</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-lg border border-border/50 bg-surface-elevated/50">
                <p className="font-semibold">Stripe</p>
                <p className="text-sm text-muted">
                  Payment intents, subscriptions, invoices
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-surface-elevated/50 opacity-50">
                <p className="font-semibold">DocuSign</p>
                <p className="text-sm text-muted">
                  Envelope events, recipient updates
                </p>
                <span className="text-xs py-1 text-muted font-medium">
                  Coming Soon
                </span>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-surface-elevated/50 opacity-50">
                <p className="font-semibold">DodoPayments</p>
                <p className="text-sm text-muted">
                  Payment and subscription events
                </p>
                <span className="text-xs py-1 text-muted font-medium">
                  Coming Soon
                </span>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-surface-elevated/50 opacity-50">
                <p className="font-semibold">Polar</p>
                <p className="text-sm text-muted">Checkout and order events</p>
                <span className="text-xs py-1 text-muted font-medium">
                  Coming Soon
                </span>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-surface-elevated/50 opacity-50">
                <p className="font-semibold">PandaDoc</p>
                <p className="text-sm text-muted">
                  Document status, recipient actions
                </p>
                <span className="text-xs py-1 text-muted font-medium">
                  Coming Soon
                </span>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-surface-elevated/50 opacity-50">
                <p className="font-semibold">Documenso</p>
                <p className="text-sm text-muted">
                  Document and signing events
                </p>
                <span className="text-xs py-1 text-muted font-medium">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="font-semibold">Running a Mock Workflow</h3>
            <ol className="list-decimal list-inside text-muted space-y-2 ml-4">
              <li>Go to your webhook&apos;s Workflows tab</li>
              <li>Select a platform and event type</li>
              <li>Click &quot;Run Workflow&quot;</li>
              <li>
                The mock event will be sent to your webhook URL and appear in
                your event stream
              </li>
            </ol>
          </div>
        </section>

        {/* Platform Integration */}
        <section className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold">Platform Integration</h2>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-3">Stripe</h3>
              <ol className="list-decimal list-inside text-muted space-y-2 ml-4">
                <li>
                  Go to{' '}
                  <a
                    href="https://dashboard.stripe.com/webhooks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Stripe Dashboard &rarr; Webhooks
                  </a>
                </li>
                <li>Click &quot;Add endpoint&quot;</li>
                <li>
                  Paste your HookOne URL:{' '}
                  <code className="text-xs bg-surface-elevated px-1.5 py-0.5 rounded">
                    https://hookone.dev/wh/your-id
                  </code>
                </li>
                <li>Select the events you want to receive</li>
                <li>Click &quot;Add endpoint&quot;</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-3">DocuSign</h3>
              <ol className="list-decimal list-inside text-muted space-y-2 ml-4">
                <li>
                  Go to{' '}
                  <a
                    href="https://admindemo.docusign.com/connect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    DocuSign Admin &rarr; Connect
                  </a>
                </li>
                <li>Create a new Connect configuration</li>
                <li>Set the URL to your HookOne webhook URL</li>
                <li>Configure the envelope events you want to receive</li>
                <li>Save the configuration</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold">Free vs Pro</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-border/50 bg-surface-elevated/50">
              <h3 className="font-semibold text-lg mb-4">Free</h3>
              <p className="text-sm text-muted mb-4">
                Perfect for side projects and learning
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li>1 permanent webhook URL</li>
                <li>1,000 events / month</li>
                <li>7-day event history</li>
                <li>CLI localhost relay</li>
                <li>10 mock workflow runs</li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border border-accent/50 bg-accent/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Pro</h3>
                <span className="text-accent font-bold">$12/mo</span>
              </div>
              <p className="text-sm text-muted mb-4">
                For professional developers and teams
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li>Unlimited webhook URLs</li>
                <li>Unlimited events</li>
                <li>30-day event history</li>
                <li>Priority localhost relay</li>
                <li>Unlimited mock workflow runs</li>
                <li>Production URL relay</li>
                <li>Webhook signature verification</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-muted">
            <Link
              href="/#pricing"
              className="text-accent hover:underline"
            >
              View full pricing details &rarr;
            </Link>
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <p className="text-muted text-sm">
            Have questions?{' '}
            <a
              href="https://x.com/anishghosh103"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Reach out on X
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
