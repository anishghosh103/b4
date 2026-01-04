'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { platformColors, platformLabels, platforms } from '@/lib/platforms';
import { Platform } from '@/lib/platforms/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { WebhookData } from './webhook-card';

const WEBHOOK_TYPES: Record<
  Platform,
  {
    name: string;
    category: 'custom' | 'payment' | 'esign';
    description: string;
  }
> = {
  custom: {
    name: 'Custom',
    category: 'custom',
    description: 'Pass original payload as-is',
  },
  stripe: {
    name: 'Stripe',
    category: 'payment',
    description: 'Payment and subscription events',
  },
  dodo: {
    name: 'Dodo Payments',
    category: 'payment',
    description: 'Payment and subscription events',
  },
  polar: {
    name: 'Polar',
    category: 'payment',
    description: 'Payment and subscription events',
  },
  pandadoc: {
    name: 'PandaDoc',
    category: 'esign',
    description: 'Document signing events',
  },
  docusign: {
    name: 'DocuSign',
    category: 'esign',
    description: 'Document signing events',
  },
  documenso: {
    name: 'Documenso',
    category: 'esign',
    description: 'Document signing events',
  },
};

interface WebhookFormData {
  name: string;
  type: Platform;
  destinationUrl: string;
  cliEnabled: boolean;
  signingSecret: string;
}

interface WebhookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webhook?: WebhookData | null;
  onSubmit: (data: WebhookFormData) => Promise<void>;
}

export function WebhookFormDialog({
  open,
  onOpenChange,
  webhook,
  onSubmit,
}: WebhookFormDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Platform>('custom');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [cliEnabled, setCliEnabled] = useState(true);
  const [signingSecret, setSigningSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!webhook;

  useEffect(() => {
    if (open) {
      setName(webhook?.name || '');
      setType(webhook?.type || 'custom');
      setDestinationUrl(webhook?.destinationUrl || '');
      setCliEnabled(webhook?.cliEnabled ?? true);
      setSigningSecret('');
      setShowSecret(false);
      setError('');
    }
  }, [open, webhook]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (destinationUrl && !destinationUrl.match(/^https?:\/\//)) {
      setError('Destination URL must be a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit({
        name: name.trim(),
        type,
        destinationUrl: destinationUrl.trim(),
        cliEnabled,
        signingSecret: signingSecret.trim(),
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const requiresSecret = type !== 'custom';

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Webhook' : 'Create Webhook'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your webhook configuration.'
              : 'Create a new webhook endpoint to receive events.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="pb-6 space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="webhook-name"
                className="text-sm font-medium mb-2 block"
              >
                Name
              </label>
              <Input
                id="webhook-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Webhook"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Type */}
            <div>
              <label
                htmlFor="webhook-type"
                className="text-sm font-medium mb-2 block"
              >
                Platform
              </label>
              <div className="relative">
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem
                        key={platform}
                        value={platform}
                      >
                        <span
                          className={cn(
                            'inline-block size-2 rounded-full bg-(--platform-background)',
                            platformColors[platform]
                          )}
                        ></span>
                        {platformLabels[platform]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted mt-1">
                {WEBHOOK_TYPES[type].description}
              </p>
            </div>

            {/* Signing Secret (for non-custom types) */}
            {/* {requiresSecret && (
              <div>
                <label
                  htmlFor="signing-secret"
                  className="text-sm font-medium mb-2 block"
                >
                  Signing Secret
                  {isEditing && (
                    <span className="text-muted font-normal ml-1">
                      (leave empty to keep current)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <Input
                    id="signing-secret"
                    type={showSecret ? 'text' : 'password'}
                    value={signingSecret}
                    onChange={(e) => setSigningSecret(e.target.value)}
                    placeholder={isEditing ? '••••••••••••' : 'whsec_...'}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                  >
                    {showSecret ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted mt-1">
                  Used to verify webhook signatures from{' '}
                  {WEBHOOK_TYPES[type].name}
                </p>
              </div>
            )} */}

            {/* Destination URL */}
            {/* <div>
              <label
                htmlFor="destination-url"
                className="text-sm font-medium mb-2 block"
              >
                Destination URL
                <span className="text-muted font-normal ml-1">(optional)</span>
              </label>
              <Input
                id="destination-url"
                type="url"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://your-app.com/webhooks"
                disabled={isLoading}
              />
              <p className="text-xs text-muted mt-1">
                Forward webhooks to this URL in addition to CLI
              </p>
            </div> */}

            {/* CLI Enabled */}
            {/* <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="cli-enabled"
                  className="text-sm font-medium"
                >
                  CLI Forwarding
                </label>
                <p className="text-xs text-muted">
                  Forward events to connected CLI clients
                </p>
              </div>
              <Switcher
                checked={cliEnabled}
                onCheckChange={setCliEnabled}
              />
            </div> */}

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              {isEditing ? 'Save Changes' : 'Create Webhook'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
