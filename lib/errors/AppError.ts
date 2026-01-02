/**
 * Custom Application Error Classes
 *
 * Provides structured error handling with HTTP status codes
 * for various business logic scenarios.
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = this.constructor.name;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Insufficient Credits Error
 * Thrown when user doesn't have enough credits for generation
 */
export class InsufficientCreditsError extends AppError {
  public required: number;
  public available: number;

  constructor(required: number, available: number) {
    super(
      `Insufficient credits. Required: ${required}, Available: ${available}`,
      402 // Payment Required
    );
    this.required = required;
    this.available = available;
  }
}

/**
 * Quota Exhausted Error
 * Thrown when user/guest has exhausted their free quota
 */
export class QuotaExhaustedError extends AppError {
  public quotaType: 'guest' | 'user';

  constructor(quotaType: 'guest' | 'user' = 'guest') {
    const message =
      quotaType === 'guest'
        ? 'Free generation quota exhausted. Please sign up or make a payment.'
        : 'Free generation quota exhausted. Please purchase credits or make a payment.';
    super(message, 403); // Forbidden
    this.quotaType = quotaType;
  }
}

/**
 * VPN Detected Error
 * Thrown when VPN/proxy is detected and free quota is denied
 */
export class VPNDetectedError extends AppError {
  constructor() {
    super(
      'VPN or proxy detected. Free generations are not available. Please make a payment.',
      403 // Forbidden
    );
  }
}

/**
 * Payment Required Error
 * Thrown when payment is needed to proceed with generation
 */
export class PaymentRequiredError extends AppError {
  public amount?: number;
  public checkoutUrl?: string;

  constructor(message?: string, amount?: number, checkoutUrl?: string) {
    super(
      message || 'Payment required to proceed with image generation.',
      402 // Payment Required
    );
    this.amount = amount;
    this.checkoutUrl = checkoutUrl;
  }
}

/**
 * Webhook Verification Error
 * Thrown when webhook signature verification fails
 */
export class WebhookVerificationError extends AppError {
  constructor(message: string = 'Webhook signature verification failed') {
    super(message, 401); // Unauthorized
  }
}

/**
 * Validation Error
 * Thrown when input validation fails
 */
export class ValidationError extends AppError {
  public errors: Record<string, string>;

  constructor(errors: Record<string, string>) {
    const messages = Object.values(errors).join(', ');
    super(`Validation failed: ${messages}`, 400); // Bad Request
    this.errors = errors;
  }
}

/**
 * Not Found Error
 * Thrown when a requested resource is not found
 */
export class NotFoundError extends AppError {
  public resource: string;

  constructor(resource: string) {
    super(`${resource} not found`, 404); // Not Found
    this.resource = resource;
  }
}

/**
 * Unauthorized Error
 * Thrown when authentication is required but not provided
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401); // Unauthorized
  }
}

/**
 * Forbidden Error
 * Thrown when user doesn't have permission for an action
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403); // Forbidden
  }
}

/**
 * Service Error
 * Thrown when external service fails (IPLocate, Dodo Payments, etc.)
 */
export class ServiceError extends AppError {
  public service: string;

  constructor(service: string, message: string) {
    super(`${service} service error: ${message}`, 503); // Service Unavailable
    this.service = service;
  }
}

/**
 * Rate Limit Error
 * Thrown when user exceeds rate limits
 */
export class RateLimitError extends AppError {
  public retryAfter?: number; // Seconds

  constructor(retryAfter?: number) {
    super(
      retryAfter
        ? `Rate limit exceeded. Retry after ${retryAfter} seconds.`
        : 'Rate limit exceeded.',
      429 // Too Many Requests
    );
    this.retryAfter = retryAfter;
  }
}

/**
 * Subscription Limit Error
 * Thrown when user exceeds their subscription tier limit
 */
export class SubscriptionLimitError extends AppError {
  public limitType: string;
  public current: number;
  public limit: number;
  public tier: string;

  constructor(limitType: string, current: number, limit: number, tier: string) {
    const limitNames: Record<string, string> = {
      maxWebhooks: 'webhook',
      maxEventsPerMonth: 'monthly event',
      maxMockWorkflows: 'mock workflow',
    };
    const limitName = limitNames[limitType] || limitType;

    super(
      `${tier === 'free' ? 'Free tier' : 'Plan'} limit reached: ${current}/${limit} ${limitName}${limit !== 1 ? 's' : ''}. Upgrade for more.`,
      403 // Forbidden
    );
    this.limitType = limitType;
    this.current = current;
    this.limit = limit;
    this.tier = tier;
  }
}
