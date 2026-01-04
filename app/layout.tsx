import { SessionProvider } from '@/components/session-provider';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Inter_Tight, Schibsted_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';

const heading = Inter_Tight({
  variable: '--font-heading',
  subsets: ['latin'],
});

const body = Schibsted_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
});

const mono = Space_Mono({
  weight: ['400'],
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Permanent Webhook URLs for Developers | HookOne - ngrok Alternative',
  description:
    'Get a permanent webhook URL that never changes. Test Stripe, DocuSign, and payment webhooks locally. Inspect payloads, replay events, and relay to localhost. Free to start.',
  keywords: [
    'webhook testing',
    'permanent webhook url',
    'ngrok alternative',
    'test stripe webhooks locally',
    'webhook localhost relay',
    'replay webhook events',
    'webhook testing tool',
  ],
  openGraph: {
    title: 'Permanent Webhook URLs for Developers | HookOne',
    description:
      'Get a permanent webhook URL that never changes. Test Stripe, DocuSign, and payment webhooks locally. Free to start.',
    type: 'website',
    siteName: 'HookOne',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Permanent Webhook URLs for Developers | HookOne',
    description:
      'Get a permanent webhook URL that never changes. Test Stripe, DocuSign, and payment webhooks locally. Free to start.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches) || (!theme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${heading.variable} ${body.variable} ${mono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
