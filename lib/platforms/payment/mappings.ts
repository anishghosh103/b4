import { PaymentEventType } from '../../types/unified-events';

// Stripe event mappings
export const STRIPE_EVENT_MAPPINGS: Record<string, PaymentEventType> = {
  'customer.subscription.created': 'subscription.activated',
  'customer.subscription.updated': 'subscription.renewed',
  'customer.subscription.deleted': 'subscription.cancelled',
  'invoice.paid': 'payment.completed',
  'invoice.payment_succeeded': 'payment.completed',
  'invoice.payment_failed': 'payment.failed',
  'payment_intent.succeeded': 'payment.completed',
  'payment_intent.payment_failed': 'payment.failed',
};

// Dodo event mappings
export const DODO_EVENT_MAPPINGS: Record<string, PaymentEventType> = {
  'subscription.active': 'subscription.activated',
  'subscription.renewed': 'subscription.renewed',
  'subscription.cancelled': 'subscription.cancelled',
  'subscription.failed': 'subscription.failed',
  'subscription.expired': 'subscription.cancelled',
  'payment.succeeded': 'payment.completed',
  'payment.failed': 'payment.failed',
};

// Polar event mappings
export const POLAR_EVENT_MAPPINGS: Record<string, PaymentEventType> = {
  'subscription.created': 'subscription.activated',
  'subscription.updated': 'subscription.renewed',
  'subscription.revoked': 'subscription.cancelled',
  'order.created': 'payment.completed',
};
