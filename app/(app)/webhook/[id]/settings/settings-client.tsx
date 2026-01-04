'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switcher } from '@/components/ui/switcher';
import { Platform } from '@/lib/platforms/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, Check, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const WEBHOOK_TYPES: Record<
  Platform,
  { name: string; category: string; description: string }
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

interface SettingsClientProps {
  webhookId: string;
  uniqueId: string;
  initialName: string;
  initialType: Platform;
  initialDestinationUrl: string;
  initialCliEnabled: boolean;
}

export function SettingsClient({
  webhookId,
  uniqueId,
  initialName,
  initialType,
  initialDestinationUrl,
  initialCliEnabled,
}: SettingsClientProps) {
  const router = useRouter();

  // General settings
  const [name, setName] = useState(initialName);

  // Webhook type
  const [type, setType] = useState<Platform>(initialType);

  // Destinations
  const [destinationUrl, setDestinationUrl] = useState(initialDestinationUrl);
  const [cliEnabled, setCliEnabled] = useState(initialCliEnabled);

  // Signing secret
  const [signingSecret, setSigningSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasChanges =
    name.trim() !== initialName ||
    type !== initialType ||
    destinationUrl !== initialDestinationUrl ||
    cliEnabled !== initialCliEnabled ||
    signingSecret !== '';

  const handleReset = () => {
    setName(initialName);
    setType(initialType);
    setDestinationUrl(initialDestinationUrl);
    setCliEnabled(initialCliEnabled);
    setSigningSecret('');
    setSaveError('');
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setSaveError('Name is required');
      return;
    }

    if (destinationUrl && !destinationUrl.match(/^https?:\/\//)) {
      setSaveError('Destination URL must be a valid URL');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const payload: Record<string, any> = {
        name: name.trim(),
        type,
        destinationUrl: destinationUrl.trim() || null,
        cliEnabled,
      };

      if (signingSecret) {
        payload.signingSecret = signingSecret;
      }

      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      setSaveSuccess(true);
      setSigningSecret('');
      router.refresh();
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete webhook');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      setIsDeleting(false);
    }
  };

  const requiresSecret = type !== 'custom';

  return (
    <div className={cn('space-y-8', hasChanges && 'pb-24')}>
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted mt-1">
          Manage your webhook configuration
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-surface border border-border rounded-xl">
        <div className="px-4 sm:px-6 py-4 border-b border-border">
          <h2 className="font-medium text-foreground">General</h2>
        </div>
        <div className="px-4 sm:px-6 py-4 space-y-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="webhook-name"
              className="text-sm font-medium text-foreground px-1"
            >
              Webhook Name
            </label>
            <Input
              id="webhook-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaveError('');
                setSaveSuccess(false);
              }}
              placeholder="Enter webhook name"
            />
          </div>
          <WebhookUrl uniqueId={uniqueId} />

          {/* Webhook Type */}
          {/* <div className="flex flex-col gap-2">
            <label
              htmlFor="webhook-type"
              className="text-sm font-medium text-foreground px-1"
            >
              Webhook Type
            </label>
            <div className="relative">
              <select
                id="webhook-type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value as Platform);
                  setSaveError('');
                  setSaveSuccess(false);
                }}
                className="w-full h-10 px-3 pr-10 rounded-lg border border-border bg-background text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <optgroup label="Custom">
                  <option value="custom">Custom - Pass-through</option>
                </optgroup>
                <optgroup label="Payment Platforms">
                  <option value="stripe">Stripe</option>
                  <option value="dodo">Dodo Payments</option>
                  <option value="polar">Polar</option>
                </optgroup>
                <optgroup label="E-Sign Platforms">
                  <option value="pandadoc">PandaDoc</option>
                  <option value="docusign">DocuSign</option>
                  <option value="documenso">Documenso</option>
                </optgroup>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
            <p className="text-xs text-muted px-1">
              {WEBHOOK_TYPES[type].description}
            </p>
          </div> */}
        </div>
      </div>

      {/* Signing Secret (for non-custom types) */}
      {requiresSecret && (
        <div className="bg-surface border border-border rounded-xl">
          <div className="px-4 sm:px-6 py-4 border-b border-border">
            <h2 className="font-medium text-foreground">
              Signature Verification
            </h2>
          </div>
          <div className="px-4 sm:px-6 py-4 space-y-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="signing-secret"
                className="text-sm font-medium text-foreground px-1"
              >
                Signing Secret
                <span className="text-muted font-normal ml-1">
                  (leave empty to keep current)
                </span>
              </label>
              <div className="relative">
                <Input
                  id="signing-secret"
                  type={showSecret ? 'text' : 'password'}
                  value={signingSecret}
                  onChange={(e) => {
                    setSigningSecret(e.target.value);
                    setSaveError('');
                    setSaveSuccess(false);
                  }}
                  placeholder="whsec_..."
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
              <p className="text-xs text-muted px-1">
                Used to verify webhook signatures from{' '}
                {WEBHOOK_TYPES[type].name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Destinations */}
      <div className="bg-surface border border-border rounded-xl">
        <div className="px-4 sm:px-6 py-4 border-b border-border">
          <h2 className="font-medium text-foreground">Destinations</h2>
        </div>
        <div className="px-4 sm:px-6 py-4 space-y-4">
          {/* Production URL */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="destination-url"
              className="text-sm font-medium text-foreground px-1"
            >
              Production URL
            </label>
            <Input
              id="destination-url"
              type="url"
              value={destinationUrl}
              onChange={(e) => {
                setDestinationUrl(e.target.value);
                setSaveError('');
                setSaveSuccess(false);
              }}
              placeholder="https://your-app.com/webhooks"
            />
            <p className="text-xs text-muted px-1">
              Forward webhooks to this URL
            </p>
          </div>

          {/* CLI Forwarding */}
          <div className="flex items-center justify-between px-1 py-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                CLI Forwarding
              </label>
              <p className="text-xs text-muted">
                Forward events to connected CLI clients
              </p>
            </div>
            <Switcher
              checked={cliEnabled}
              onCheckChange={(checked) => {
                setCliEnabled(checked);
                setSaveError('');
                setSaveSuccess(false);
              }}
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface border border-red-500/30 rounded-xl">
        <div className="px-4 sm:px-6 py-4 border-b border-red-500/30 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="font-medium text-red-500">Danger Zone</h2>
        </div>
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Delete Webhook
              </h3>
              <p className="text-sm text-muted mt-0.5">
                Permanently delete this webhook and all its events.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="border-red-500/30 text-red-500 hover:bg-red-500/10 w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-t border-border px-4 sm:px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <p className="text-sm text-muted">You have unsaved changes</p>
              {saveError && <p className="text-sm text-red-500">{saveError}</p>}
              {saveSuccess && (
                <p className="text-sm text-emerald-500 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Saved
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="ghost"
                onClick={handleReset}
                className="flex-1 sm:flex-none"
              >
                Discard
              </Button>
              <Button
                onClick={handleSave}
                isLoading={isSaving}
                className="flex-1 sm:flex-none"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
                {initialName}
              </span>
              ? This will permanently delete the webhook and all associated
              events. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Webhook'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function WebhookUrl({ uniqueId }: { uniqueId: string }) {
  const [copied, setCopied] = useState(false);
  const urlSpanRef = useRef<HTMLSpanElement>(null);

  const handleSelectAll = () => {
    if (urlSpanRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(urlSpanRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };
  const url = `${process.env.NEXT_PUBLIC_WEBHOOK_BASE_URL}/${uniqueId}`;
  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="webhook-url"
        className="text-sm font-medium text-foreground px-1"
      >
        Webhook URL
      </label>
      <div
        id="webhook-url"
        className={cn(
          'w-full flex items-center rounded-xl transition-all duration-200',
          'text-emerald-600 dark:text-emerald-400 placeholder:text-muted',
          'focus:outline-none focus:ring-2 focus:ring-accent/30',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'bg-muted/5 border border-border',
          'hover:border-border/80 focus:border-accent/50',
          'px-4 py-2 text-sm',
          'cursor-default'
        )}
      >
        <div
          className="flex-1"
          onClick={handleSelectAll}
        >
          <span
            ref={urlSpanRef}
            className="break-all"
          >
            {`${process.env.NEXT_PUBLIC_WEBHOOK_BASE_URL}/${uniqueId}`}
          </span>
        </div>
        <button
          className="inline-flex items-center gap-2 border border-border hover:border-emerald-400 dark:hover:border-emerald-800 active:scale-[0.98] py-1 px-2 text-xs rounded-md transition-all"
          onClick={handleCopy}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
