export interface Competitor {
  slug: string;
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  heroHeadline: string;
  heroDescription: string;
  comparisonTable: {
    feature: string;
    hookone: string | boolean;
    competitor: string | boolean;
  }[];
  hookoneAdvantages: { title: string; description: string }[];
  competitorLimitations: string[];
  faq: { question: string; answer: string }[];
  keywords: string[];
}

export const competitors: Record<string, Competitor> = {
  ngrok: {
    slug: 'ngrok',
    name: 'ngrok',
    displayName: 'HookOne vs ngrok',
    tagline: 'The ngrok alternative built for webhooks',
    description:
      'Compare HookOne to ngrok for webhook testing. Get permanent URLs, event replay, and built-in signature verification—all for free.',
    heroHeadline: 'Stop paying $240/year for a static ngrok URL',
    heroDescription:
      'ngrok is great for tunneling, but webhook testing needs more. HookOne gives you permanent URLs that never change, full event history with replay, and built-in signature verification—without the enterprise price tag.',
    comparisonTable: [
      { feature: 'Permanent webhook URL', hookone: 'Free', competitor: '$8/mo (static domain)' },
      { feature: 'Event history & replay', hookone: true, competitor: false },
      { feature: 'Signature verification', hookone: 'Built-in', competitor: 'Manual' },
      { feature: 'Localhost forwarding', hookone: true, competitor: true },
      { feature: 'Mock workflows', hookone: true, competitor: false },
      { feature: 'Payload inspection', hookone: 'Full UI', competitor: 'CLI only' },
      { feature: 'Free tier', hookone: '1 URL, 1000 events/mo', competitor: 'URL changes on restart' },
      { feature: 'Team collaboration', hookone: '$12/mo', competitor: '$20/mo' },
    ],
    hookoneAdvantages: [
      {
        title: 'Permanent URLs on free tier',
        description: 'Your webhook URL never changes—even on the free plan. Set it once in Stripe, DocuSign, or any platform and forget about it.',
      },
      {
        title: 'Full event history',
        description: 'See every webhook that hit your endpoint. Inspect payloads, headers, and timing. Replay any event with one click.',
      },
      {
        title: 'Built-in signature verification',
        description: 'HookOne verifies Stripe, DocuSign, and DodoPayments signatures automatically. No code changes needed.',
      },
      {
        title: 'Mock workflows',
        description: 'Test your integration without real accounts. Simulate full payment flows, document signing, and more.',
      },
      {
        title: 'Purpose-built for webhooks',
        description: 'ngrok is a general tunneling tool. HookOne is built specifically for webhook testing with features like event replay and platform integrations.',
      },
    ],
    competitorLimitations: [
      'Free tier URLs change every time ngrok restarts',
      'Static domains require paid plan ($8/month)',
      'No built-in webhook signature verification',
      'No event history or replay capability',
      'No mock workflow testing',
      'Payload inspection only via CLI',
      'Not optimized for webhook use cases',
    ],
    faq: [
      {
        question: 'Is HookOne a complete ngrok replacement?',
        answer: 'For webhook testing, yes. HookOne provides permanent URLs, event history, replay, and signature verification—features ngrok doesn\'t offer. For general tunneling (non-webhook use cases), ngrok may still be useful.',
      },
      {
        question: 'Why is HookOne cheaper than ngrok?',
        answer: 'HookOne is focused specifically on webhooks, which lets us offer more value at lower prices. We don\'t need to support general tunneling infrastructure.',
      },
      {
        question: 'Can I use HookOne and ngrok together?',
        answer: 'Absolutely! Many developers use HookOne for webhook testing and ngrok for other tunneling needs. They complement each other well.',
      },
      {
        question: 'How do I migrate from ngrok to HookOne?',
        answer: '1) Sign up for HookOne (free). 2) Create a webhook and copy your permanent URL. 3) Update your webhook URL in Stripe/DocuSign/etc. 4) Run `npx hookone [port] [id]` instead of ngrok.',
      },
    ],
    keywords: [
      'ngrok alternative',
      'ngrok vs hookone',
      'free ngrok alternative',
      'ngrok webhook testing',
      'permanent webhook url',
      'ngrok replacement',
      'better than ngrok',
    ],
  },
  'webhook-site': {
    slug: 'webhook-site',
    name: 'webhook.site',
    displayName: 'HookOne vs webhook.site',
    tagline: 'More than just webhook inspection',
    description:
      'Compare HookOne to webhook.site. Get localhost forwarding, event replay, and signature verification—not just inspection.',
    heroHeadline: 'Inspect, replay, AND forward to localhost',
    heroDescription:
      'webhook.site shows you what came in. HookOne lets you replay it, route it to localhost, test with mock events, and verify signatures—all without leaving your development workflow.',
    comparisonTable: [
      { feature: 'Webhook inspection', hookone: true, competitor: true },
      { feature: 'Localhost forwarding', hookone: 'CLI included', competitor: 'Paid add-on' },
      { feature: 'Event replay', hookone: true, competitor: false },
      { feature: 'Signature verification', hookone: 'Built-in', competitor: false },
      { feature: 'Mock workflows', hookone: true, competitor: false },
      { feature: 'Platform integrations', hookone: 'Stripe, DocuSign, etc.', competitor: 'Generic only' },
      { feature: 'Free tier', hookone: '1 URL, 1000 events/mo', competitor: 'Limited features' },
    ],
    hookoneAdvantages: [
      {
        title: 'Localhost forwarding included',
        description: 'Forward webhooks to your local dev server with `npx hookone`. No paid add-ons needed.',
      },
      {
        title: 'One-click event replay',
        description: 'Click replay on any event to resend it to your endpoint. Perfect for debugging edge cases.',
      },
      {
        title: 'Built-in signature verification',
        description: 'Verify Stripe, DocuSign, and other webhook signatures automatically.',
      },
      {
        title: 'Mock workflows',
        description: 'Simulate full webhook flows from Stripe, DocuSign, and more—without real accounts.',
      },
    ],
    competitorLimitations: [
      'No built-in localhost forwarding (requires paid add-on)',
      'No event replay capability',
      'No signature verification',
      'No mock workflow testing',
      'No platform-specific features',
      'Limited to inspection only',
    ],
    faq: [
      {
        question: 'Is HookOne better than webhook.site?',
        answer: 'For development, yes. webhook.site is great for quick inspection, but HookOne adds localhost forwarding, event replay, mock workflows, and signature verification—everything you need for development.',
      },
      {
        question: 'Does HookOne have webhook inspection?',
        answer: 'Yes! HookOne shows full payload inspection with JSON viewer, headers, and metadata—plus the ability to replay events and forward to localhost.',
      },
    ],
    keywords: [
      'webhook.site alternative',
      'webhook site vs hookone',
      'webhook testing tool',
      'webhook localhost forwarding',
      'webhook replay',
    ],
  },
};

export const competitorSlugs = Object.keys(competitors);

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors[slug];
}
