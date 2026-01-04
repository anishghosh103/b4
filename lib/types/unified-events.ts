// Unified event types for payment platforms
export type PaymentEventType =
  | 'subscription.activated'
  | 'subscription.cancelled'
  | 'subscription.failed'
  | 'subscription.renewed'
  | 'subscription.upgraded'
  | 'payment.completed'
  | 'payment.failed';

// Unified event types for e-sign platforms
export type EsignEventType =
  | 'document.sent'
  | 'document.signed'
  | 'document.completed'
  | 'document.cancelled';

export type UnifiedEventType = PaymentEventType | EsignEventType;

// Platform identifiers
export type PaymentPlatform = 'stripe' | 'dodo' | 'polar';
export type EsignPlatform = 'pandadoc' | 'docusign' | 'documenso';
export type Platform = PaymentPlatform | EsignPlatform | 'custom';

// Unified metadata structure (same for all webhook types)
export interface WebhookMetadata {
  webhook_id: string;
  platform: Platform;
  event_type: UnifiedEventType | string | null; // null for custom
  original_event_type: string | null; // null for custom
  received_at: string;
  method: string;
  query_params: Record<string, string>;
  verified: boolean; // false for custom
}

// The unified event schema (same shape for ALL webhook types)
export interface UnifiedEvent<T = unknown> {
  metadata: WebhookMetadata;
  data: T | null; // normalized data, null for custom
  original_payload: unknown; // always the raw incoming payload
}

// Normalized data schemas
export interface NormalizedSubscriptionData {
  subscription_id: string;
  customer_id?: string;
  customer_email?: string;
  plan_id?: string;
  plan_name?: string;
  amount?: number;
  currency?: string;
  interval?: 'month' | 'year';
  status?: string;
  current_period_start?: string;
  current_period_end?: string;
}

export interface NormalizedPaymentData {
  payment_id: string;
  amount: number;
  currency: string;
  customer_id?: string;
  customer_email?: string;
  status: string;
  payment_method?: string;
}

export interface NormalizedDocumentData {
  document_id: string;
  document_name?: string;
  sender_email?: string;
  recipients?: Array<{
    email: string;
    name?: string;
    status?: string;
    signed_at?: string;
  }>;
  status: string;
  created_at?: string;
  completed_at?: string;
}
