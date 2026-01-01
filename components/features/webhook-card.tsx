'use client';

import { cn } from '@/lib/utils';
import { WebhookIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export interface WebhookData {
  _id: string;
  name: string;
  uniqueId: string;
  path: string;
  createdAt: string;
}

interface WebhookCardProps {
  webhook: WebhookData;
  onEdit: (webhook: WebhookData) => void;
  onDelete: (webhook: WebhookData) => void;
}

export function WebhookCard({ webhook, onEdit, onDelete }: WebhookCardProps) {
  const [copied, setCopied] = useState(false);
  const webhookUrl = `hookone.dev/wh/${webhook.uniqueId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${webhookUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link
      href={`/webhook/${webhook.uniqueId}`}
      className={cn(
        'py-3 px-4 bg-card border rounded-2xl hover:border-muted/50 hover:shadow-md transition-all'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="size-9 p-2.5 rounded-full bg-white dark:bg-zinc-800 border text-muted">
          <WebhookIcon className="size-full" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground truncate text-sm">
            {webhook.name}
          </h4>
          <code className="flex text-sm text-muted font-mono truncate -mt-0.5">
            {webhookUrl}
          </code>
        </div>
      </div>
    </Link>
  );
}
