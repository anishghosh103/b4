import { WorkflowDefinition } from '../types';

export const stripeSubscriptionFlow: WorkflowDefinition = {
  id: 'stripe-subscription-flow',
  name: 'Stripe Subscription Flow',
  description:
    'Simulates a customer subscribing and their first invoice being paid',
  platform: 'stripe',
  steps: [
    {
      id: 'subscription-created',
      eventType: 'customer.subscription.created',
      name: 'Subscription Created',
      description: 'Customer signs up for a subscription',
      delayMs: 0,
    },
    {
      id: 'invoice-paid',
      eventType: 'invoice.paid',
      name: 'Invoice Paid',
      description: 'First invoice is automatically paid',
      delayMs: 2000,
    },
  ],
};
