// Context passed between events to maintain consistency
export interface StripeMockContext {
  customerId: string;
  subscriptionId: string;
  invoiceId: string;
  priceId: string;
  productId: string;
  customerEmail: string;
  timestamp: number;
  paymentMethodId: string;
  chargeId: string;
}

// Generate a random ID with a prefix
function generateId(prefix: string, length: number = 24): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${result}`;
}

// Generate a new mock context with consistent IDs
export function createStripeMockContext(): StripeMockContext {
  return {
    customerId: generateId('cus', 14),
    subscriptionId: generateId('sub', 24),
    invoiceId: generateId('in', 24),
    priceId: generateId('price', 24),
    productId: generateId('prod', 24),
    customerEmail: 'test@example.com',
    timestamp: Math.floor(Date.now() / 1000),
    paymentMethodId: generateId('pm', 24),
    chargeId: generateId('ch', 24),
  };
}

// Stripe event structure
export interface StripeEvent {
  id: string;
  object: 'event';
  api_version: string;
  created: number;
  data: {
    object: Record<string, unknown>;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: { id: string | null; idempotency_key: string | null };
  type: string;
}

// Generate customer.subscription.created event
export function generateCustomerSubscriptionCreated(
  ctx: StripeMockContext
): StripeEvent {
  const created = ctx.timestamp;
  const periodEnd = created + 30 * 24 * 60 * 60; // 30 days

  return {
    id: generateId('evt', 24),
    object: 'event',
    api_version: '2023-10-16',
    created,
    data: {
      object: {
        id: ctx.subscriptionId,
        object: 'subscription',
        application: null,
        application_fee_percent: null,
        automatic_tax: { enabled: false, liability: null },
        billing_cycle_anchor: created,
        billing_cycle_anchor_config: null,
        billing_thresholds: null,
        cancel_at: null,
        cancel_at_period_end: false,
        canceled_at: null,
        cancellation_details: { comment: null, feedback: null, reason: null },
        collection_method: 'charge_automatically',
        created,
        currency: 'usd',
        customer: ctx.customerId,
        days_until_due: null,
        default_payment_method: ctx.paymentMethodId,
        default_source: null,
        default_tax_rates: [],
        description: null,
        discount: null,
        discounts: [],
        ended_at: null,
        invoice_settings: { account_tax_ids: null, issuer: { type: 'self' } },
        items: {
          object: 'list',
          data: [
            {
              id: generateId('si', 14),
              object: 'subscription_item',
              billing_thresholds: null,
              created,
              current_period_end: periodEnd,
              current_period_start: created,
              discounts: [],
              metadata: {},
              plan: {
                id: ctx.priceId,
                object: 'plan',
                active: true,
                aggregate_usage: null,
                amount: 2900,
                amount_decimal: '2900',
                billing_scheme: 'per_unit',
                created,
                currency: 'usd',
                interval: 'month',
                interval_count: 1,
                livemode: false,
                metadata: {},
                nickname: null,
                product: ctx.productId,
                tiers_mode: null,
                transform_usage: null,
                trial_period_days: null,
                usage_type: 'licensed',
              },
              price: {
                id: ctx.priceId,
                object: 'price',
                active: true,
                billing_scheme: 'per_unit',
                created,
                currency: 'usd',
                custom_unit_amount: null,
                livemode: false,
                lookup_key: null,
                metadata: {},
                nickname: null,
                product: ctx.productId,
                recurring: {
                  aggregate_usage: null,
                  interval: 'month',
                  interval_count: 1,
                  trial_period_days: null,
                  usage_type: 'licensed',
                },
                tax_behavior: 'unspecified',
                tiers_mode: null,
                transform_quantity: null,
                type: 'recurring',
                unit_amount: 2900,
                unit_amount_decimal: '2900',
              },
              quantity: 1,
              subscription: ctx.subscriptionId,
              tax_rates: [],
            },
          ],
          has_more: false,
          total_count: 1,
          url: `/v1/subscription_items?subscription=${ctx.subscriptionId}`,
        },
        latest_invoice: ctx.invoiceId,
        livemode: false,
        metadata: {},
        next_pending_invoice_item_invoice: null,
        on_behalf_of: null,
        pause_collection: null,
        payment_settings: {
          payment_method_options: null,
          payment_method_types: null,
          save_default_payment_method: 'on_subscription',
        },
        pending_invoice_item_interval: null,
        pending_setup_intent: null,
        pending_update: null,
        plan: {
          id: ctx.priceId,
          object: 'plan',
          active: true,
          aggregate_usage: null,
          amount: 2900,
          amount_decimal: '2900',
          billing_scheme: 'per_unit',
          created,
          currency: 'usd',
          interval: 'month',
          interval_count: 1,
          livemode: false,
          metadata: {},
          nickname: null,
          product: ctx.productId,
          tiers_mode: null,
          transform_usage: null,
          trial_period_days: null,
          usage_type: 'licensed',
        },
        quantity: 1,
        schedule: null,
        start_date: created,
        status: 'active',
        test_clock: null,
        transfer_data: null,
        trial_end: null,
        trial_settings: {
          end_behavior: { missing_payment_method: 'create_invoice' },
        },
        trial_start: null,
      },
    },
    livemode: false,
    pending_webhooks: 1,
    request: { id: generateId('req', 14), idempotency_key: null },
    type: 'customer.subscription.created',
  };
}

// Generate invoice.paid event
export function generateInvoicePaid(ctx: StripeMockContext): StripeEvent {
  const created = ctx.timestamp;
  const periodEnd = created + 30 * 24 * 60 * 60;

  return {
    id: generateId('evt', 24),
    object: 'event',
    api_version: '2023-10-16',
    created: created + 1, // Slightly after subscription created
    data: {
      object: {
        id: ctx.invoiceId,
        object: 'invoice',
        account_country: 'US',
        account_name: 'Test Company',
        account_tax_ids: null,
        amount_due: 2900,
        amount_paid: 2900,
        amount_remaining: 0,
        amount_shipping: 0,
        application: null,
        application_fee_amount: null,
        attempt_count: 1,
        attempted: true,
        auto_advance: false,
        automatic_tax: { enabled: false, liability: null, status: null },
        billing_reason: 'subscription_create',
        charge: ctx.chargeId,
        collection_method: 'charge_automatically',
        created,
        currency: 'usd',
        custom_fields: null,
        customer: ctx.customerId,
        customer_address: null,
        customer_email: ctx.customerEmail,
        customer_name: null,
        customer_phone: null,
        customer_shipping: null,
        customer_tax_exempt: 'none',
        customer_tax_ids: [],
        default_payment_method: null,
        default_source: null,
        default_tax_rates: [],
        description: null,
        discount: null,
        discounts: [],
        due_date: null,
        effective_at: created,
        ending_balance: 0,
        footer: null,
        from_invoice: null,
        hosted_invoice_url: `https://invoice.stripe.com/i/${generateId(
          'inv',
          24
        )}`,
        invoice_pdf: `https://pay.stripe.com/invoice/${generateId(
          'inv',
          24
        )}/pdf`,
        issuer: { type: 'self' },
        last_finalization_error: null,
        latest_revision: null,
        lines: {
          object: 'list',
          data: [
            {
              id: generateId('il', 24),
              object: 'line_item',
              amount: 2900,
              amount_excluding_tax: 2900,
              currency: 'usd',
              description: 'Pro Plan',
              discount_amounts: [],
              discountable: true,
              discounts: [],
              invoice: ctx.invoiceId,
              livemode: false,
              metadata: {},
              period: { end: periodEnd, start: created },
              plan: {
                id: ctx.priceId,
                object: 'plan',
                active: true,
                amount: 2900,
                currency: 'usd',
                interval: 'month',
                interval_count: 1,
                product: ctx.productId,
              },
              price: {
                id: ctx.priceId,
                object: 'price',
                active: true,
                currency: 'usd',
                product: ctx.productId,
                recurring: { interval: 'month', interval_count: 1 },
                type: 'recurring',
                unit_amount: 2900,
              },
              proration: false,
              proration_details: { credited_items: null },
              quantity: 1,
              subscription: ctx.subscriptionId,
              subscription_item: generateId('si', 14),
              tax_amounts: [],
              tax_rates: [],
              type: 'subscription',
              unit_amount_excluding_tax: '2900',
            },
          ],
          has_more: false,
          total_count: 1,
          url: `/v1/invoices/${ctx.invoiceId}/lines`,
        },
        livemode: false,
        metadata: {},
        next_payment_attempt: null,
        number: `INV-${Date.now()}`,
        on_behalf_of: null,
        paid: true,
        paid_out_of_band: false,
        payment_intent: generateId('pi', 24),
        payment_settings: {
          default_mandate: null,
          payment_method_options: null,
          payment_method_types: null,
        },
        period_end: created,
        period_start: created,
        post_payment_credit_notes_amount: 0,
        pre_payment_credit_notes_amount: 0,
        quote: null,
        receipt_number: null,
        rendering: null,
        rendering_options: null,
        shipping_cost: null,
        shipping_details: null,
        starting_balance: 0,
        statement_descriptor: null,
        status: 'paid',
        status_transitions: {
          finalized_at: created,
          marked_uncollectible_at: null,
          paid_at: created,
          voided_at: null,
        },
        subscription: ctx.subscriptionId,
        subscription_details: { metadata: {} },
        subtotal: 2900,
        subtotal_excluding_tax: 2900,
        tax: null,
        test_clock: null,
        total: 2900,
        total_discount_amounts: [],
        total_excluding_tax: 2900,
        total_tax_amounts: [],
        transfer_data: null,
        webhooks_delivered_at: created,
      },
    },
    livemode: false,
    pending_webhooks: 1,
    request: { id: generateId('req', 14), idempotency_key: null },
    type: 'invoice.paid',
  };
}

// Map event type to generator function
export function generateStripeMockPayload(
  eventType: string,
  ctx: StripeMockContext
): StripeEvent | null {
  switch (eventType) {
    case 'customer.subscription.created':
      return generateCustomerSubscriptionCreated(ctx);
    case 'invoice.paid':
      return generateInvoicePaid(ctx);
    default:
      return null;
  }
}
