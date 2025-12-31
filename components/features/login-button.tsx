'use client';

import { Button } from '@/components/ui';
import { signIn } from 'next-auth/react';

export function LoginButton() {
  return <Button onClick={() => signIn('google')}>Sign in</Button>;
}
