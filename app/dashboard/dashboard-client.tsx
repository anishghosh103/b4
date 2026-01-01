'use client';

import { UserMenu } from '@/components/features';
import {
  DeleteConfirmDialog,
  EmptyState,
  WebhookCard,
  WebhookFormDialog,
} from '@/components/features';
import type { WebhookData } from '@/components/features/webhook-card';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
        <svg
          className="w-5 h-5 text-background"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <span className="font-semibold text-lg">HookOne</span>
    </Link>
  );
}

interface DashboardClientProps {
  initialWebhooks: WebhookData[];
}

export function DashboardClient({ initialWebhooks }: DashboardClientProps) {
  const [webhooks, setWebhooks] = useState<WebhookData[]>(initialWebhooks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookData | null>(null);
  const [deletingWebhook, setDeletingWebhook] = useState<WebhookData | null>(null);

  const handleCreate = async (name: string) => {
    const response = await fetch('/api/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create webhook');
    }

    const newWebhook = await response.json();
    setWebhooks((prev) => [newWebhook, ...prev]);
  };

  const handleEdit = async (name: string) => {
    if (!editingWebhook) return;

    const response = await fetch(`/api/webhooks/${editingWebhook._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update webhook');
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
    <div className="min-h-screen bg-background grid-bg mesh-gradient">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Webhooks</h1>
            <p className="text-muted mt-1">
              Manage your webhook endpoints
            </p>
          </div>
          {webhooks.length > 0 && (
            <Button variant="primary" onClick={() => setIsFormOpen(true)}>
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
      </main>

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
    </div>
  );
}
