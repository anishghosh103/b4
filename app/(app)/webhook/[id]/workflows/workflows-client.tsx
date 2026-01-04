'use client';

import { useState, useCallback } from 'react';
import { Platform } from '@/lib/platforms/types';
import {
  WorkflowDefinition,
  WorkflowExecutionState,
  WorkflowProgressEvent,
  StepExecutionState,
} from '@/lib/workflows/types';
import { getWorkflowsForPlatform } from '@/lib/workflows/definitions';
import {
  createStripeMockContext,
  generateStripeMockPayload,
} from '@/lib/workflows/mock-data/stripe';
import { WorkflowCard } from './workflow-card';
import { WorkflowDetailView } from './workflow-detail-view';
import { PayloadEditorSheet } from './payload-editor-sheet';
import { FlaskConical } from 'lucide-react';

interface WorkflowsClientProps {
  webhookId: string;
  webhookType: Platform;
}

export function WorkflowsClient({ webhookId, webhookType }: WorkflowsClientProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(
    null
  );
  const [customPayloads, setCustomPayloads] = useState<Record<string, object>>({});
  const [executionState, setExecutionState] = useState<WorkflowExecutionState | null>(
    null
  );
  const [isRunning, setIsRunning] = useState(false);

  // Payload editor state
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Mock context for generating default payloads
  const [mockContext] = useState(() => createStripeMockContext());

  const workflows = getWorkflowsForPlatform(webhookType);

  const handleSelectWorkflow = (workflow: WorkflowDefinition) => {
    setSelectedWorkflow(workflow);
    setCustomPayloads({});
    setExecutionState(null);
  };

  const handleBack = () => {
    if (isRunning) return;
    setSelectedWorkflow(null);
    setCustomPayloads({});
    setExecutionState(null);
  };

  const handleEditPayload = (stepId: string) => {
    setEditingStepId(stepId);
    setIsEditorOpen(true);
  };

  const handleSavePayload = (stepId: string, payload: object) => {
    setCustomPayloads((prev) => ({ ...prev, [stepId]: payload }));
  };

  const handleResetPayload = (stepId: string) => {
    setCustomPayloads((prev) => {
      const next = { ...prev };
      delete next[stepId];
      return next;
    });
  };

  const getDefaultPayload = (stepId: string): object | null => {
    if (!selectedWorkflow) return null;
    const step = selectedWorkflow.steps.find((s) => s.id === stepId);
    if (!step) return null;
    return generateStripeMockPayload(step.eventType, mockContext);
  };

  const handleRunWorkflow = useCallback(async () => {
    if (!selectedWorkflow || isRunning) return;

    setIsRunning(true);

    // Initialize execution state
    const initialState: WorkflowExecutionState = {
      workflowId: selectedWorkflow.id,
      status: 'running',
      currentStepIndex: 0,
      startedAt: new Date().toISOString(),
      steps: selectedWorkflow.steps.map((s) => ({
        stepId: s.id,
        status: 'pending' as const,
      })),
    };
    setExecutionState(initialState);

    try {
      const response = await fetch(`/api/webhooks/${webhookId}/workflows/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: selectedWorkflow.id,
          customPayloads: Object.keys(customPayloads).length > 0 ? customPayloads : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setExecutionState((prev) =>
          prev ? { ...prev, status: 'failed' } : null
        );
        setIsRunning(false);
        return;
      }

      // Read SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setExecutionState((prev) =>
          prev ? { ...prev, status: 'failed' } : null
        );
        setIsRunning(false);
        return;
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: WorkflowProgressEvent = JSON.parse(line.slice(6));
              handleProgressEvent(event);
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      setExecutionState((prev) =>
        prev ? { ...prev, status: 'failed' } : null
      );
    } finally {
      setIsRunning(false);
    }
  }, [selectedWorkflow, webhookId, customPayloads, isRunning]);

  const handleProgressEvent = (event: WorkflowProgressEvent) => {
    setExecutionState((prev) => {
      if (!prev) return prev;

      switch (event.type) {
        case 'step_started':
          return {
            ...prev,
            currentStepIndex: event.stepIndex ?? prev.currentStepIndex,
            steps: prev.steps.map((s, i) =>
              i === event.stepIndex
                ? { ...s, status: 'running' as const, startedAt: event.timestamp }
                : s
            ),
          };
        case 'step_completed':
          return {
            ...prev,
            steps: prev.steps.map((s, i) =>
              i === event.stepIndex
                ? { ...s, status: 'completed' as const, completedAt: event.timestamp }
                : s
            ),
          };
        case 'step_failed':
          return {
            ...prev,
            status: 'failed',
            steps: prev.steps.map((s) =>
              s.stepId === event.stepId
                ? { ...s, status: 'failed' as const, error: event.error }
                : s
            ),
          };
        case 'workflow_completed':
          return { ...prev, status: 'completed', completedAt: event.timestamp };
        case 'workflow_failed':
          return { ...prev, status: 'failed' };
        default:
          return prev;
      }
    });
  };

  // Get the step being edited
  const editingStep = selectedWorkflow?.steps.find((s) => s.id === editingStepId);

  // Empty state when no workflows available
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-4">
          <FlaskConical className="w-6 h-6 text-muted" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No workflows available
        </h3>
        <p className="text-sm text-muted max-w-sm">
          Workflows are not available for {webhookType} webhooks yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {selectedWorkflow ? (
        <WorkflowDetailView
          workflow={selectedWorkflow}
          customPayloads={customPayloads}
          executionState={executionState}
          onBack={handleBack}
          onEditPayload={handleEditPayload}
          onRun={handleRunWorkflow}
          isRunning={isRunning}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Mock Workflows</h2>
          </div>

          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onClick={() => handleSelectWorkflow(workflow)}
              />
            ))}
          </div>
        </div>
      )}

      <PayloadEditorSheet
        step={editingStep || null}
        defaultPayload={editingStepId ? getDefaultPayload(editingStepId) : null}
        currentPayload={editingStepId ? customPayloads[editingStepId] || null : null}
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        onSave={handleSavePayload}
        onReset={handleResetPayload}
      />
    </>
  );
}
