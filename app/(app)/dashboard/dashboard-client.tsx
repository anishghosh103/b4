'use client';

import {
  DeleteConfirmDialog,
  EmptyState,
  WebhookCard,
  WebhookFormDialog,
} from '@/components/features';
import type { WebhookData } from '@/components/features/webhook-card';
import { Button } from '@/components/ui';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

interface DashboardClientProps {
  initialWebhooks: WebhookData[];
}

export function DashboardClient({ initialWebhooks }: DashboardClientProps) {
  const [webhooks, setWebhooks] = useState<WebhookData[]>(initialWebhooks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookData | null>(
    null
  );
  const [deletingWebhook, setDeletingWebhook] = useState<WebhookData | null>(
    null
  );

  const handleCreate = async (data: {
    name: string;
    type: string;
    destinationUrl: string;
    cliEnabled: boolean;
    signingSecret: string;
  }) => {
    const response = await fetch('/api/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to create webhook');
    }

    const newWebhook = await response.json();
    setWebhooks((prev) => [newWebhook, ...prev]);
  };

  const handleEdit = async (data: {
    name: string;
    type: string;
    destinationUrl: string;
    cliEnabled: boolean;
    signingSecret: string;
  }) => {
    if (!editingWebhook) return;

    // Only send signingSecret if it was changed
    const payload: Record<string, any> = {
      name: data.name,
      type: data.type,
      destinationUrl: data.destinationUrl || null,
      cliEnabled: data.cliEnabled,
    };
    if (data.signingSecret) {
      payload.signingSecret = data.signingSecret;
    }

    const response = await fetch(`/api/webhooks/${editingWebhook._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to update webhook');
    }

    const updatedWebhook = await response.json();
    setWebhooks((prev) =>
      prev.map((w) => (w._id === updatedWebhook._id ? updatedWebhook : w))
    );
    setEditingWebhook(null);
  };

  const handleDelete = async () => {
    if (!deletingWebhook) return;

    const response = await fetch(`/api/webhooks/${deletingWebhook._id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete webhook');
    }

    setWebhooks((prev) => prev.filter((w) => w._id !== deletingWebhook._id));
    setDeletingWebhook(null);
  };

  const openEditDialog = (webhook: WebhookData) => {
    setEditingWebhook(webhook);
  };

  const openDeleteDialog = (webhook: WebhookData) => {
    setDeletingWebhook(webhook);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Webhooks</h1>
          <p className="text-muted mt-1">Manage your webhook endpoints</p>
        </div>
        {webhooks.length > 0 && (
          <Button
            variant="primary"
            onClick={() => setIsFormOpen(true)}
          >
            <PlusIcon className="size-4" />
            Create Webhook
          </Button>
        )}
      </div>

      {webhooks.length === 0 ? (
        <EmptyState onCreateClick={() => setIsFormOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {webhooks.map((webhook) => (
            <WebhookCard
              key={webhook._id}
              webhook={webhook}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <WebhookFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreate}
      />

      {/* Edit Dialog */}
      <WebhookFormDialog
        open={!!editingWebhook}
        onOpenChange={(open) => !open && setEditingWebhook(null)}
        webhook={editingWebhook}
        onSubmit={handleEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingWebhook}
        onOpenChange={(open) => !open && setDeletingWebhook(null)}
        webhookName={deletingWebhook?.name || ''}
        onConfirm={handleDelete}
      />
    </>
  );
}
