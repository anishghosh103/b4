'use client';

import { Platform } from '@/lib/platforms/types';
import { cn, formatRelativeTime } from '@/lib/utils';
import { ChevronRight, WebhookIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export interface WebhookData {
  _id: string;
  name: string;
  uniqueId: string;
  path: string;
  type: Platform;
  destinationUrl: string | null;
  cliEnabled: boolean;
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
        'group py-3 px-4 bg-card border rounded-2xl hover:border-muted/50 hover:shadow-xs transition-all'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="size-9 p-2.5 rounded-full bg-white dark:bg-zinc-800 border text-muted">
          <WebhookIcon className="size-full" />
        </div>
        <div className="flex-1 space-y-0.5">
          <h4 className="font-medium text-foreground truncate text-sm">
            {webhook.name}
          </h4>
          <code className="flex text-xs text-muted">
            {formatRelativeTime(webhook.createdAt)}
          </code>
        </div>
        <div className="size-8 p-1.5 rounded-full border border-border group-hover:border-muted/50 text-muted/50 group-hover:text-muted/80 transition-all">
          <ChevronRight className="size-full" />
        </div>
      </div>
    </Link>
  );
}
