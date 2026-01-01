'use client';

import { Button } from '@/components/ui/button';
import { WebhookIcon, PlusIcon } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
        <WebhookIcon className="size-8 text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No webhooks yet
      </h3>
      <p className="text-muted text-center max-w-sm mb-6">
        Create your first webhook to start receiving events from external services.
      </p>
      <Button variant="primary" onClick={onCreateClick}>
        <PlusIcon className="size-4" />
        Create Webhook
      </Button>
    </div>
  );
}
