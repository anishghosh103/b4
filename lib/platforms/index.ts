import { documensoHandler } from './esign/documenso';
import { docusignHandler } from './esign/docusign';
import { pandadocHandler } from './esign/pandadoc';
import { dodoHandler } from './payment/dodo';
import { polarHandler } from './payment/polar';
import { stripeHandler } from './payment/stripe';
import { Platform, PlatformHandler } from './types';

const handlers: Record<Exclude<Platform, 'custom'>, PlatformHandler> = {
  stripe: stripeHandler,
  dodo: dodoHandler,
  polar: polarHandler,
  pandadoc: pandadocHandler,
  docusign: docusignHandler,
  documenso: documensoHandler,
};

export function getHandler(type: Platform): PlatformHandler | null {
  if (type === 'custom') return null;
  return handlers[type] || null;
}

export type {
  PlatformHandler,
  TransformResult,
  VerificationResult,
} from './types';

export const platformColors: Record<Platform, string> = {
  stripe:
    '[--platform-background:var(--color-violet-500)] [--platform-foreground:var(--color-violet-600)] dark:[--platform-foreground:var(--color-violet-400)] [--platform-border:var(--color-violet-500)]',
  docusign:
    '[--platform-background:var(--color-yellow-500)] [--platform-foreground:var(--color-yellow-600)] dark:[--platform-foreground:var(--color-yellow-400)] [--platform-border:var(--color-yellow-500)]',
  dodo: '[--platform-background:var(--color-emerald-500)] [--platform-foreground:var(--color-emerald-600)] dark:[--platform-foreground:var(--color-emerald-400)] [--platform-border:var(--color-emerald-500)]',
  polar:
    '[--platform-background:var(--color-blue-500)] [--platform-foreground:var(--color-blue-600)] dark:[--platform-foreground:var(--color-blue-400)] [--platform-border:var(--color-blue-500)]',
  pandadoc:
    '[--platform-background:var(--color-green-500)] [--platform-foreground:var(--color-green-600)] dark:[--platform-foreground:var(--color-green-400)] [--platform-border:var(--color-green-500)]',
  documenso:
    '[--platform-background:var(--color-pink-500)] [--platform-foreground:var(--color-pink-600)] dark:[--platform-foreground:var(--color-pink-400)] [--platform-border:var(--color-pink-500)]',
  custom:
    '[--platform-background:var(--color-zinc-500)] [--platform-foreground:var(--color-zinc-600)] dark:[--platform-foreground:var(--color-zinc-400)] [--platform-border:var(--color-zinc-500)]',
};

export const platformLabels: Record<Platform, string> = {
  stripe: 'Stripe',
  docusign: 'DocuSign',
  dodo: 'Dodo Payments',
  polar: 'Polar',
  pandadoc: 'PandaDoc',
  documenso: 'Documenso',
  custom: 'Custom',
};

export const platforms: Platform[] = [
  'custom',
  'stripe',
  'dodo',
  // 'polar',
  'docusign',
  'pandadoc',
  // 'documenso',
];
