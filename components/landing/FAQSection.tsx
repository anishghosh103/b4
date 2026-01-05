'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How is HookOne different from ngrok?',
      answer:
        'ngrok is a general-purpose tunneling tool—great for exposing localhost, but webhooks are an afterthought. HookOne is built specifically for webhooks: permanent URLs that never change, full event history with replay, built-in signature verification, and platform-aware parsing for Stripe, DocuSign, and more. Plus, you get a permanent URL on the free tier—no $240/year for a static domain.',
    },
    {
      question: 'Can I use HookOne for free?',
      answer:
        'Yes! The free tier includes 1 permanent webhook URL, 1,000 events/month, 7-day event history, CLI localhost relay, and 3 mock workflows. Perfect for side projects and learning.',
    },
    {
      question: 'Does my webhook URL ever expire?',
      answer:
        'Never. Your HookOne webhook URL is permanent. Set it once in Stripe, DocuSign, or any platform, and never update it again—even if you restart your computer, switch networks, or take a vacation.',
    },
    {
      question: 'How do I test Stripe webhooks locally?',
      answer:
        'Run `hookone 3000 [your-webhook-id]` in your terminal. Any webhook that hits your HookOne URL will be forwarded to localhost:3000 instantly. No ngrok sessions, no URL updates, no configuration.',
    },
    {
      question: 'Can multiple team members use the same webhook?',
      answer:
        'Yes! On the Pro plan, you can invite team members to collaborate on webhooks. Everyone sees the same event history and can replay events independently.',
    },
    {
      question: 'Is HookOne secure for production webhooks?',
      answer:
        'Absolutely. We support HTTPS only, built-in signature verification for Stripe/DocuSign/Dodo, and automatic secret rotation. Your webhook data is encrypted in transit and at rest.',
    },
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently asked questions
          </h2>
          <p className="text-muted">
            Everything you need to know about HookOne.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-elevated/50 transition-colors"
              >
                <span className="font-medium  pr-4">{faq.question}</span>
                <svg
                  className={cn(
                    'w-5 h-5 text-muted flex-shrink-0 transition-transform',
                    openIndex === i && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className=" text-muted leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
