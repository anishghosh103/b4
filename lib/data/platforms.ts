export interface Platform {
  slug: string;
  name: string;
  displayName: string;
  description: string;
  longDescription: string;
  color: string;
  features: string[];
  webhookEvents: { name: string; description: string }[];
  setupSteps: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  keywords: string[];
}

export const platforms: Record<string, Platform> = {
  stripe: {
    slug: 'stripe',
    name: 'Stripe',
    displayName: 'Stripe Webhook Testing',
    description:
      'Test Stripe webhooks locally with permanent URLs. No more ngrok restarts or URL updates.',
    longDescription:
      'HookOne provides permanent webhook URLs for Stripe integration testing. Stop updating your Stripe dashboard every time ngrok restarts. Get a stable URL, inspect payloads, replay events, and forward to localhost—all in one tool.',
    color: 'violet',
    features: [
      'Permanent webhook URL that never changes',
      'Built-in Stripe signature verification',
      'One-click event replay for debugging',
      'Forward webhooks to localhost with CLI',
      'Full payload inspection with JSON viewer',
      'Mock Stripe payment workflows',
    ],
    webhookEvents: [
      {
        name: 'payment_intent.succeeded',
        description: 'Payment completed successfully',
      },
      {
        name: 'payment_intent.payment_failed',
        description: 'Payment attempt failed',
      },
      {
        name: 'customer.subscription.created',
        description: 'New subscription started',
      },
      {
        name: 'customer.subscription.deleted',
        description: 'Subscription cancelled',
      },
      { name: 'invoice.payment_succeeded', description: 'Invoice paid' },
      { name: 'checkout.session.completed', description: 'Checkout completed' },
      { name: '...', description: 'And many more.' },
    ],
    setupSteps: [
      {
        title: 'Create a HookOne webhook',
        description:
          'Sign up for free and create a new webhook. Select Stripe as the platform.',
      },
      {
        title: 'Copy your permanent URL',
        description:
          'Your URL looks like hookone.dev/wh/abc123. This URL never changes.',
      },
      {
        title: 'Add to Stripe Dashboard',
        description:
          'Go to Stripe Dashboard → Developers → Webhooks → Add endpoint. Paste your HookOne URL.',
      },
      {
        title: 'Test locally',
        description:
          'Run `npx hookone 3000 [webhook-id] /api/stripe-webhook` to forward events to localhost.',
      },
    ],
    faq: [
      {
        question: 'How do I test Stripe webhooks locally?',
        answer:
          'Run our CLI command: `npx hookone 3000 [webhook-id] /api/stripe-webhook`. Any webhook that hits your HookOne URL will be forwarded to localhost:3000 instantly.',
      },
      {
        question: 'Does HookOne verify Stripe webhook signatures?',
        answer:
          "Yes! HookOne has built-in Stripe signature verification. Add your Stripe webhook signing secret in your webhook settings, and we'll verify every incoming event.",
      },
      {
        question: 'Can I replay Stripe webhook events?',
        answer:
          'Absolutely. Every event is stored in your event history. Click "Replay" on any event to resend it to your endpoint—perfect for debugging payment flows.',
      },
      {
        question: 'Is this better than Stripe CLI for local testing?',
        answer:
          "HookOne complements Stripe CLI. While Stripe CLI is great for triggering test events, HookOne gives you permanent URLs, event history, and replay—features Stripe CLI doesn't offer.",
      },
    ],
    keywords: [
      'stripe webhook testing',
      'test stripe webhooks locally',
      'stripe webhook localhost',
      'stripe webhook url',
      'stripe ngrok alternative',
      'stripe webhook replay',
    ],
  },
  docusign: {
    slug: 'docusign',
    name: 'DocuSign',
    displayName: 'DocuSign Webhook Testing',
    description:
      'Test DocuSign Connect webhooks locally. Get envelope status updates without the hassle.',
    longDescription:
      'HookOne makes DocuSign Connect webhook testing simple. No more struggling with ngrok URLs or missing envelope events. Get a permanent webhook URL, inspect Connect payloads, and forward to localhost for development.',
    color: 'yellow',
    features: [
      'Permanent webhook URL for DocuSign Connect',
      'Built-in DocuSign signature verification',
      'Envelope event inspection and replay',
      'Forward webhooks to localhost',
      'Full XML/JSON payload viewer',
      'Mock DocuSign envelope workflows',
    ],
    webhookEvents: [
      { name: 'envelope-sent', description: 'Envelope sent to recipients' },
      {
        name: 'envelope-delivered',
        description: 'Envelope viewed by recipient',
      },
      { name: 'envelope-completed', description: 'All recipients signed' },
      {
        name: 'recipient-completed',
        description: 'Individual recipient finished',
      },
      { name: 'envelope-declined', description: 'Recipient declined to sign' },
      { name: 'envelope-voided', description: 'Envelope was voided' },
    ],
    setupSteps: [
      {
        title: 'Create a HookOne webhook',
        description:
          'Sign up and create a webhook. Select DocuSign as the platform.',
      },
      {
        title: 'Copy your permanent URL',
        description:
          'Get your URL: hookone.dev/wh/abc123. This URL never changes.',
      },
      {
        title: 'Configure DocuSign Connect',
        description:
          'Go to DocuSign Admin → Integrations → Connect. Add your HookOne URL as the endpoint.',
      },
      {
        title: 'Test locally',
        description:
          'Run `npx hookone 3000 [webhook-id] /api/docusign` to forward events to your local server.',
      },
    ],
    faq: [
      {
        question: 'How do I test DocuSign webhooks locally?',
        answer:
          'Use our CLI: `npx hookone 3000 [webhook-id] /api/docusign`. Webhooks hitting your HookOne URL are instantly forwarded to localhost.',
      },
      {
        question: 'Does HookOne work with DocuSign Connect?',
        answer:
          'Yes! HookOne fully supports DocuSign Connect. Add your HookOne URL as a Connect endpoint and receive all envelope status updates.',
      },
      {
        question: 'Can I test without a DocuSign account?',
        answer:
          'Yes! Use our mock DocuSign workflows to simulate envelope events without needing a real DocuSign account.',
      },
    ],
    keywords: [
      'docusign webhook testing',
      'docusign connect webhook',
      'docusign localhost testing',
      'docusign webhook url',
      'docusign ngrok',
      'test docusign webhooks locally',
    ],
  },
  'dodo-payments': {
    slug: 'dodo-payments',
    name: 'DodoPayments',
    displayName: 'DodoPayments Webhook Testing',
    description:
      'Test DodoPayments webhooks locally. Perfect for payment integration development.',
    longDescription:
      'HookOne provides seamless DodoPayments webhook testing. Get permanent URLs, inspect payment events, and forward to localhost for development. Built-in signature verification ensures security.',
    color: 'emerald',
    features: [
      'Permanent webhook URL for DodoPayments',
      'Built-in DodoPayments signature verification',
      'Payment event inspection and replay',
      'Forward webhooks to localhost',
      'Full payload inspection',
      'Mock payment workflows',
    ],
    webhookEvents: [
      { name: 'payment.succeeded', description: 'Payment completed' },
      { name: 'payment.failed', description: 'Payment failed' },
      { name: 'subscription.created', description: 'New subscription' },
      { name: 'subscription.active', description: 'Subscription activated' },
      { name: 'refund.created', description: 'Refund processed' },
      { name: 'dispute.created', description: 'Dispute opened' },
      { name: '...', description: 'And many more.' },
    ],
    setupSteps: [
      {
        title: 'Create a HookOne webhook',
        description:
          'Sign up and create a webhook. Select DodoPayments as the platform.',
      },
      {
        title: 'Copy your permanent URL',
        description: 'Get your URL: hookone.dev/wh/abc123.',
      },
      {
        title: 'Configure DodoPayments',
        description:
          'Add your HookOne URL in the DodoPayments dashboard webhook settings.',
      },
      {
        title: 'Test locally',
        description:
          'Run `npx hookone 3000 [webhook-id] /api/dodo` to forward events.',
      },
    ],
    faq: [
      {
        question: 'How do I test DodoPayments webhooks locally?',
        answer:
          'Run `npx hookone 3000 [webhook-id] /api/dodo`. All webhooks are forwarded to localhost instantly.',
      },
      {
        question: 'Does HookOne verify DodoPayments signatures?',
        answer:
          'Yes! Add your DodoPayments signing secret and we verify every incoming event.',
      },
    ],
    keywords: [
      'dodo payments webhook',
      'dodopayments webhook testing',
      'dodo payments localhost',
      'test dodo payments webhooks',
    ],
  },
  pandadoc: {
    slug: 'pandadoc',
    name: 'PandaDoc',
    displayName: 'PandaDoc Webhook Testing',
    description:
      'Test PandaDoc webhooks locally. Track document status with permanent URLs.',
    longDescription:
      'HookOne simplifies PandaDoc webhook testing. Get permanent URLs for your PandaDoc integrations, inspect document events, and forward to localhost for development.',
    color: 'green',
    features: [
      'Permanent webhook URL for PandaDoc',
      'Document event inspection and replay',
      'Forward webhooks to localhost',
      'Full payload inspection',
      'Mock document workflows',
    ],
    webhookEvents: [
      {
        name: 'document_state_changed',
        description: 'Document status updated',
      },
      { name: 'document_completed', description: 'Document fully signed' },
      { name: 'document_viewed', description: 'Recipient viewed document' },
      { name: 'document_paid', description: 'Payment received' },
    ],
    setupSteps: [
      {
        title: 'Create a HookOne webhook',
        description:
          'Sign up and create a webhook. Select PandaDoc as the platform.',
      },
      {
        title: 'Copy your permanent URL',
        description: 'Get your URL: hookone.dev/wh/abc123.',
      },
      {
        title: 'Configure PandaDoc',
        description: 'Add your HookOne URL in PandaDoc webhook settings.',
      },
      {
        title: 'Test locally',
        description:
          'Run `npx hookone 3000 [webhook-id] /api/pandadoc` to forward events.',
      },
    ],
    faq: [
      {
        question: 'How do I test PandaDoc webhooks locally?',
        answer:
          'Run `npx hookone 3000 [webhook-id] /api/pandadoc` to forward webhooks to localhost.',
      },
    ],
    keywords: [
      'pandadoc webhook testing',
      'pandadoc webhook localhost',
      'test pandadoc webhooks',
    ],
  },
};

export const platformSlugs = Object.keys(platforms);

export function getPlatform(slug: string): Platform | undefined {
  return platforms[slug];
}
