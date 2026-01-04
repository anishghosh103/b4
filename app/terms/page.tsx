import { AppHeader } from '@/components/features';
import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | HookOne',
  description:
    'Terms of Service for HookOne - webhook testing platform. Read our terms for using the service.',
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-muted mb-12">Last updated: January 2025</p>

        <article className="space-y-12">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">1. Introduction</h2>
            <p className="text-muted leading-relaxed">
              Welcome to HookOne. These Terms of Service (&quot;Terms&quot;)
              govern your use of the HookOne website and services (collectively,
              the &quot;Service&quot;) operated by HookOne (&quot;we&quot;,
              &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p className="text-muted leading-relaxed">
              By accessing or using the Service, you agree to be bound by these
              Terms. If you disagree with any part of the Terms, you may not
              access the Service.
            </p>
          </section>

          {/* Description of Service */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">2. Description of Service</h2>
            <p className="text-muted leading-relaxed">
              HookOne provides webhook testing and management tools for
              developers, including:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Permanent webhook URLs that never expire</li>
              <li>
                CLI tool for relaying webhooks to localhost development servers
              </li>
              <li>Webhook event inspection, replay, and storage</li>
              <li>
                Mock workflows for testing without sandbox accounts
              </li>
              <li>Integration with third-party platforms (Stripe, DocuSign, etc.)</li>
            </ul>
            <p className="text-muted leading-relaxed">
              The Service is offered in both free and paid tiers with different
              feature limits and capabilities.
            </p>
          </section>

          {/* User Accounts */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">3. User Accounts</h2>
            <p className="text-muted leading-relaxed">
              To use the Service, you must create an account using Google OAuth
              authentication. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
            <p className="text-muted leading-relaxed">
              You must be at least 18 years old or the legal age of majority in
              your jurisdiction to use this Service. We reserve the right to
              terminate accounts that violate these Terms.
            </p>
          </section>

          {/* Acceptable Use */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. Acceptable Use</h2>
            <p className="text-muted leading-relaxed">
              You agree to use the Service only for lawful purposes. You may
              not:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Use the Service for any illegal activities</li>
              <li>Transmit malware, viruses, or malicious code</li>
              <li>
                Attempt to gain unauthorized access to our systems or other
                users&apos; accounts
              </li>
              <li>Circumvent rate limits or usage restrictions</li>
              <li>Resell or redistribute the Service without authorization</li>
              <li>
                Use the Service to process production traffic without an
                appropriate subscription
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Service
              </li>
            </ul>
          </section>

          {/* Webhook Data */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. Webhook Data Handling</h2>
            <p className="text-muted leading-relaxed">
              When you use HookOne, we capture and store webhook data sent to
              your permanent URLs, including HTTP headers, request bodies, and
              metadata.
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>
                <strong>Free tier:</strong> Events are retained for 7 days
              </li>
              <li>
                <strong>Pro tier:</strong> Events are retained for 30 days
              </li>
            </ul>
            <p className="text-muted leading-relaxed">
              You are solely responsible for ensuring that webhook data you
              receive through the Service does not contain sensitive information
              that should not be stored, or for using the Service appropriately
              given the nature of such data. We are not obligated to monitor the
              content of webhooks transmitted through our Service.
            </p>
          </section>

          {/* Payment Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">6. Payment Terms</h2>
            <p className="text-muted leading-relaxed">
              The Pro tier is available for $12 per month, billed monthly
              through Stripe.
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>
                Subscriptions automatically renew unless cancelled before the
                next billing cycle
              </li>
              <li>
                You may cancel your subscription at any time from your account
                settings
              </li>
              <li>
                Refunds are handled on a case-by-case basis at our discretion
              </li>
              <li>
                We reserve the right to change pricing with 30 days notice
              </li>
            </ul>
            <p className="text-muted leading-relaxed">
              All payment processing is handled securely through Stripe. We do
              not store your full credit card details.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">7. Intellectual Property</h2>
            <p className="text-muted leading-relaxed">
              The Service, including its original content, features, and
              functionality, is owned by HookOne and is protected by
              international copyright, trademark, and other intellectual
              property laws.
            </p>
            <p className="text-muted leading-relaxed">
              You retain all rights to your webhook data and any content you
              transmit through the Service. By using the Service, you grant us a
              limited license to store and process your webhook data solely for
              the purpose of providing the Service.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">8. Disclaimers</h2>
            <p className="text-muted leading-relaxed">
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER
              EXPRESS OR IMPLIED.
            </p>
            <p className="text-muted leading-relaxed">
              We do not guarantee that the Service will be uninterrupted,
              secure, or error-free. We are not responsible for any issues
              arising from third-party webhook providers or the content of
              webhooks you receive.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">9. Limitation of Liability</h2>
            <p className="text-muted leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, HOOKONE SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
              INCURRED DIRECTLY OR INDIRECTLY.
            </p>
            <p className="text-muted leading-relaxed">
              Our total liability for any claims arising from or related to the
              Service shall not exceed the amount you paid us in the twelve (12)
              months preceding the claim.
            </p>
          </section>

          {/* Indemnification */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">10. Indemnification</h2>
            <p className="text-muted leading-relaxed">
              You agree to indemnify, defend, and hold harmless HookOne and its
              officers, directors, employees, and agents from any claims,
              liabilities, damages, losses, and expenses arising from your use
              of the Service or violation of these Terms.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">11. Changes to Terms</h2>
            <p className="text-muted leading-relaxed">
              We reserve the right to modify these Terms at any time. We will
              provide notice of material changes by posting the updated Terms on
              this page with a new &quot;Last updated&quot; date. Your continued
              use of the Service after such changes constitutes acceptance of
              the new Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">12. Governing Law</h2>
            <p className="text-muted leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which HookOne operates, without
              regard to its conflict of law provisions.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">13. Contact Us</h2>
            <p className="text-muted leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
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
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
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
