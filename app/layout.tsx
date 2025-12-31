import type { Metadata } from 'next';
import { Inter_Tight, Schibsted_Grotesk, Space_Mono } from 'next/font/google';
import { SessionProvider } from '@/components/session-provider';
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
  title: 'HookOne - Webhook Testing Made Simple',
  description:
    'Get a permanent URL for all your webhooks. Inspect payloads, replay events, and relay to localhost. No more ngrok URL shuffling.',
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
      </body>
    </html>
  );
}
