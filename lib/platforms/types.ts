export type Platform =
  | 'stripe'
  | 'dodo'
  | 'polar'
  | 'docusign'
  | 'pandadoc'
  | 'documenso'
  | 'custom';

export interface VerificationResult {
  verified: boolean;
  error?: string;
}

export interface TransformResult {
  success: boolean;
  event_type?: string; // Unified event type (e.g., 'subscription.activated')
  original_event_type?: string; // Platform's original event type
  data?: unknown; // Normalized data
  error?: string;
}

export interface PlatformHandler {
  // Verify signature using the signing secret
  verify(
    payload: string | Buffer,
    headers: Record<string, string>,
    queryParams: Record<string, string>,
    secret: string
  ): VerificationResult;

  // Transform platform event - extracts event type and normalizes data
  transform(payload: any, headers: Record<string, string>): TransformResult;
}
