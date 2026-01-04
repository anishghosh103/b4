import { AppHeader } from '@/components/features';
import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | HookOne',
  description:
    'Privacy Policy for HookOne - learn how we collect, use, and protect your data when using our webhook testing platform.',
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted mb-12">Last updated: January 2025</p>

        <article className="space-y-12">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">1. Introduction</h2>
            <p className="text-muted leading-relaxed">
              HookOne (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
              respects your privacy and is committed to protecting your personal
              data. This Privacy Policy explains how we collect, use, and
              safeguard your information when you use our webhook testing
              platform (the &quot;Service&quot;).
            </p>
            <p className="text-muted leading-relaxed">
              By using HookOne, you agree to the collection and use of
              information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">2. Information We Collect</h2>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                2.1 Account Information
              </h3>
              <p className="text-muted leading-relaxed">
                When you sign in with Google OAuth, we collect:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 ml-4">
                <li>Email address</li>
                <li>Name</li>
                <li>Google profile ID</li>
                <li>Profile picture URL</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">2.2 Webhook Data</h3>
              <p className="text-muted leading-relaxed">
                When webhooks are sent to your HookOne URL, we capture and
                store:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 ml-4">
                <li>HTTP headers</li>
                <li>Request body/payload</li>
                <li>Source IP address</li>
                <li>Timestamps</li>
                <li>Platform metadata (e.g., Stripe event type, DocuSign envelope ID)</li>
              </ul>
              <p className="text-muted leading-relaxed">
                This data is stored temporarily based on your subscription tier
                (7 days for free, 30 days for Pro) and then automatically
                deleted.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">2.3 Usage Data</h3>
              <p className="text-muted leading-relaxed">
                We collect aggregated usage information including:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 ml-4">
                <li>Feature usage statistics</li>
                <li>CLI connection logs</li>
                <li>Dashboard interactions</li>
                <li>Error logs for debugging</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">2.4 Payment Information</h3>
              <p className="text-muted leading-relaxed">
                If you subscribe to the Pro tier, payment processing is handled
                by Stripe. We store:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 ml-4">
                <li>Stripe customer ID</li>
                <li>Subscription status and tier</li>
                <li>Billing period information</li>
              </ul>
              <p className="text-muted leading-relaxed">
                We do not store your full credit card number or CVV. All
                sensitive payment data is handled directly by Stripe.
              </p>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
            <p className="text-muted leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Provide, operate, and maintain the Service</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send you service-related communications</li>
              <li>Respond to customer support inquiries</li>
              <li>Improve and optimize the Service</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. Data Retention</h2>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>
                <strong>Webhook events:</strong> 7 days (free tier) or 30 days
                (Pro tier), then automatically deleted
              </li>
              <li>
                <strong>Account data:</strong> Retained for the duration of your
                account plus a reasonable period for backup and legal compliance
              </li>
              <li>
                <strong>Payment records:</strong> Retained as required by
                applicable tax and accounting laws
              </li>
            </ul>
            <p className="text-muted leading-relaxed">
              You can request deletion of your account and associated data at
              any time by contacting us.
            </p>
          </section>

          {/* Data Sharing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. Data Sharing</h2>
            <p className="text-muted leading-relaxed">
              We do not sell your personal data. We share information only with:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>
                <strong>Google:</strong> For authentication (OAuth)
              </li>
              <li>
                <strong>Stripe:</strong> For payment processing
              </li>
              <li>
                <strong>Vercel:</strong> For hosting and infrastructure
              </li>
              <li>
                <strong>MongoDB Atlas:</strong> For database storage
              </li>
            </ul>
            <p className="text-muted leading-relaxed">
              We may also disclose information if required by law, court order,
              or governmental authority.
            </p>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">6. Data Security</h2>
            <p className="text-muted leading-relaxed">
              We implement appropriate security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>All data transmitted over HTTPS encryption</li>
              <li>Secure database storage with access controls</li>
              <li>Regular security reviews and updates</li>
              <li>Limited employee access to personal data</li>
            </ul>
            <p className="text-muted leading-relaxed">
              While we strive to protect your data, no method of transmission
              over the Internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">7. Your Rights</h2>
            <p className="text-muted leading-relaxed">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your webhook data</li>
              <li>Object to processing of your data</li>
            </ul>
            <p className="text-muted leading-relaxed">
              To exercise these rights, please contact us using the information
              provided below.
            </p>
          </section>

          {/* Cookies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">8. Cookies and Tracking</h2>
            <p className="text-muted leading-relaxed">
              We use cookies and similar technologies for:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>
                <strong>Session cookies:</strong> To maintain your authenticated
                session
              </li>
              <li>
                <strong>Preference cookies:</strong> To remember your settings
                (e.g., theme preference)
              </li>
              <li>
                <strong>Analytics:</strong> We use Vercel Analytics for
                privacy-focused, aggregated usage metrics
              </li>
            </ul>
            <p className="text-muted leading-relaxed">
              We do not use third-party advertising trackers or sell data to
              advertisers.
            </p>
          </section>

          {/* International Users */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">9. International Users</h2>
            <p className="text-muted leading-relaxed">
              If you access the Service from outside the United States, please
              be aware that your data may be transferred to and processed in the
              United States or other countries where our service providers
              operate.
            </p>
            <p className="text-muted leading-relaxed">
              By using the Service, you consent to this transfer. We take
              appropriate safeguards to ensure your data is protected in
              accordance with this Privacy Policy.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">10. Children&apos;s Privacy</h2>
            <p className="text-muted leading-relaxed">
              The Service is not intended for users under the age of 13 (or 16
              in some jurisdictions). We do not knowingly collect personal
              information from children. If you believe a child has provided us
              with personal data, please contact us immediately.
            </p>
          </section>

          {/* Changes */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">11. Changes to This Policy</h2>
            <p className="text-muted leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new Privacy
              Policy on this page and updating the &quot;Last updated&quot;
              date.
            </p>
            <p className="text-muted leading-relaxed">
              We encourage you to review this Privacy Policy periodically for
              any changes.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">12. Contact Us</h2>
            <p className="text-muted leading-relaxed">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us at{' '}
              <a
                href="https://x.com/anishghosh103"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                @anishghosh103 on X
              </a>
              .
            </p>
          </section>
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link href="/docs" className="text-accent hover:underline">
              Documentation
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
