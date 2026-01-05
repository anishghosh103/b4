'use client';

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Children, cloneElement, isValidElement, ReactNode } from 'react';

export function AuthLinkWrapper({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const childrenWithClick = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child, { onClick: () => signIn('google') } as any);
  });
  return session?.user ? (
    <Link href="/dashboard">{children}</Link>
  ) : (
    childrenWithClick
  );
}
