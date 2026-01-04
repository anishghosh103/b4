'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui';
import { WorkflowStep } from '@/lib/workflows/types';
import { AlertCircle, RotateCcw, Wand2 } from 'lucide-react';

interface PayloadEditorSheetProps {
  step: WorkflowStep | null;
  defaultPayload: object | null;
  currentPayload: object | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (stepId: string, payload: object) => void;
  onReset: (stepId: string) => void;
}

export function PayloadEditorSheet({
  step,
  defaultPayload,
  currentPayload,
  open,
  onOpenChange,
  onSave,
  onReset,
}: PayloadEditorSheetProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initialize with current or default payload when opening
  useEffect(() => {
    if (open && step) {
      const payload = currentPayload || defaultPayload;
      if (payload) {
        setJsonText(JSON.stringify(payload, null, 2));
      } else {
        setJsonText('{}');
      }
      setError(null);
    }
  }, [open, step, currentPayload, defaultPayload]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch {
      setError('Invalid JSON - cannot format');
    }
  };

  const handleReset = () => {
    if (step && defaultPayload) {
      setJsonText(JSON.stringify(defaultPayload, null, 2));
      setError(null);
      onReset(step.id);
    }
  };

  const handleSave = () => {
    if (!step) return;

    try {
      const parsed = JSON.parse(jsonText);
      setError(null);
      onSave(step.id, parsed);
      onOpenChange(false);
    } catch {
      setError('Invalid JSON - please fix before saving');
    }
  };

  const validateJson = (text: string) => {
    try {
      JSON.parse(text);
      setError(null);
    } catch {
      setError('Invalid JSON');
    }
  };

  if (!step) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="sm:max-w-xl flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle>Edit Payload</SheetTitle>
          <SheetDescription>
            <span className="font-mono text-xs bg-surface-elevated px-2 py-1 rounded">
              {step.eventType}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden py-4">
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFormat}
            >
              <Wand2 className="w-3 h-3 mr-1.5" />
              Format JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="w-3 h-3 mr-1.5" />
              Reset to Default
            </Button>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-red-500/10 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Textarea */}
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              validateJson(e.target.value);
            }}
            className="w-full h-[calc(100%-4rem)] p-4 font-mono text-sm bg-surface border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
            spellCheck={false}
          />
        </div>

        <SheetFooter className="border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!!error}
          >
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
