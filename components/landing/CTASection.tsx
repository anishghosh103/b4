'use client';

import { Button } from '@/components/ui';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

export function CTASection() {
  const { data: session } = useSession();

  return (
    <section
      id="cta"
      className="py-28 px-6 border-t border-border/30"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to stop updating webhook URLs?
        </h2>
        <p className="text-muted mb-10 text-lg">
          Get your permanent URL today. No credit card required.
        </p>
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
    </section>
  );
}
