type OrganizationSchema = {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
};

type SoftwareApplicationSchema = {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    ratingCount: string;
  };
};

type FAQSchema = {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
};

type WebPageSchema = {
  '@context': 'https://schema.org';
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  breadcrumb?: {
    '@type': 'BreadcrumbList';
    itemListElement: Array<{
      '@type': 'ListItem';
      position: number;
      name: string;
      item?: string;
    }>;
  };
};

// Organization Schema for HookOne
export function OrganizationJsonLd() {
  const schema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HookOne',
    url: 'https://hookone.dev',
    description:
      'Permanent webhook URLs for developers. Test Stripe, DocuSign, and payment webhooks locally.',
    sameAs: [
      'https://twitter.com/hookone',
      'https://github.com/hookone',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Software Application Schema
export function SoftwareApplicationJsonLd() {
  const schema: SoftwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HookOne',
    description:
      'Permanent webhook URLs for developers. Test webhooks locally, inspect payloads, replay events, and relay to localhost.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema - pass your FAQ items
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const schema: FAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebPage Schema with optional breadcrumbs
interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function WebPageJsonLd({
  name,
  description,
  url,
  breadcrumbs,
}: {
  name: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const schema: WebPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        ...(item.url && { item: item.url }),
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Combined schema for homepage
export function HomepageJsonLd() {
  const faqs: FAQItem[] = [
    {
      question: 'What is HookOne?',
      answer:
        'HookOne provides permanent webhook URLs for developers. Unlike ngrok, your webhook URLs never change, so you never need to update your Stripe, DocuSign, or other integrations.',
    },
    {
      question: 'How is HookOne different from ngrok?',
      answer:
        'ngrok URLs change every time you restart it (on free tier). HookOne gives you permanent URLs that never change, plus features like event replay, payload inspection, and mock workflows.',
    },
    {
      question: 'Is HookOne free?',
      answer:
        'Yes! HookOne offers a free tier with 1 permanent webhook URL, 1,000 events/month, and 7-day event history. Pro tier at $12/month includes unlimited URLs and events.',
    },
    {
      question: 'What platforms does HookOne support?',
      answer:
        'HookOne supports Stripe, DocuSign, DodoPayments, PandaDoc, Documenso, Polar, and custom webhooks. Each platform has built-in signature verification.',
    },
    {
      question: 'How do I test webhooks locally with HookOne?',
      answer:
        'Simply run our CLI command: npx hookone [port] [webhook-id] [path]. This relays webhooks from your permanent URL to your localhost for testing.',
    },
    {
      question: 'Can I replay webhook events?',
      answer:
        'Yes! HookOne stores your webhook event history so you can replay any event with one click. This is invaluable for debugging payment flows and testing edge cases.',
    },
  ];

  return (
    <>
      <OrganizationJsonLd />
      <SoftwareApplicationJsonLd />
      <FAQJsonLd faqs={faqs} />
    </>
  );
}
