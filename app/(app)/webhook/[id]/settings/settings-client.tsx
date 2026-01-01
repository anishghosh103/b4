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
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SettingsClientProps {
  webhookId: string;
  uniqueId: string;
  initialName: string;
}

export function SettingsClient({
  webhookId,
  uniqueId,
  initialName,
}: SettingsClientProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasChanges = name.trim() !== initialName;

  const handleSave = async () => {
    if (!name.trim()) {
      setSaveError('Name is required');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      setSaveSuccess(true);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted mt-1">
          Manage your webhook configuration
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-surface border border-border rounded-xl">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-medium text-foreground">General</h2>
        </div>
        <div className="px-6 py-4 space-y-4">
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
            {saveError && <p className="text-sm text-red-500">{saveError}</p>}
            {saveSuccess && (
              <p className="text-sm text-emerald-500">Saved successfully</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              isLoading={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface border border-red-500/30 rounded-xl">
        <div className="px-6 py-4 border-b border-red-500/30 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="font-medium text-red-500">Danger Zone</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Delete Webhook
              </h3>
              <p className="text-sm text-muted mt-0.5">
                Permanently delete this webhook and all its events. This action
                cannot be undone.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="border-red-500/30 text-red-500 hover:bg-red-500/10 shrink-0 ml-4"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

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
