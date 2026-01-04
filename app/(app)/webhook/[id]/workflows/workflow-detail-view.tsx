'use client';

import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  StepStatus,
  WorkflowDefinition,
  WorkflowExecutionState,
} from '@/lib/workflows/types';
import { ArrowLeft, Check, Circle, Loader2, Pencil, X } from 'lucide-react';

interface WorkflowDetailViewProps {
  workflow: WorkflowDefinition;
  customPayloads: Record<string, object>;
  executionState: WorkflowExecutionState | null;
  onBack: () => void;
  onEditPayload: (stepId: string) => void;
  onRun: () => void;
  isRunning: boolean;
}

const statusIcons: Record<StepStatus, React.ReactNode> = {
  pending: <Circle className="w-4 h-4 text-muted" />,
  running: <Loader2 className="w-4 h-4 text-accent animate-spin" />,
  completed: <Check className="w-4 h-4 text-emerald-500" />,
  failed: <X className="w-4 h-4 text-red-500" />,
};

export function WorkflowDetailView({
  workflow,
  customPayloads,
  executionState,
  onBack,
  onEditPayload,
  onRun,
  isRunning,
}: WorkflowDetailViewProps) {
  const getStepStatus = (stepId: string): StepStatus => {
    if (!executionState) return 'pending';
    const stepState = executionState.steps.find((s) => s.stepId === stepId);
    return stepState?.status || 'pending';
  };

  const hasCustomPayload = (stepId: string): boolean => {
    return stepId in customPayloads;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          disabled={isRunning}
          className="p-2 rounded-xl hover:bg-surface-elevated transition-colors text-muted hover:text-foreground disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="font-semibold text-foreground">{workflow.name}</h3>
        <Badge
          variant="success"
          size="sm"
        >
          Ready
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-muted">{workflow.description}</p>

      {/* Steps Card */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted">Workflow Steps</span>
          <span className="text-xs text-muted">
            {workflow.steps.length} event
            {workflow.steps.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="relative">
          <div className="">
            {workflow.steps.map((step, i, steps) => {
              const status = getStepStatus(step.id);
              const hasCustom = hasCustomPayload(step.id);

              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-start gap-4 relative p-3 -mx-3 rounded-lg transition-colors',
                    status === 'running' && 'bg-accent/5',
                    status === 'completed' && 'bg-emerald-500/5',
                    status === 'failed' && 'bg-red-500/5'
                  )}
                >
                  {/* Vertical line connecting steps */}
                  {steps.length - 1 !== i ? (
                    <div className="absolute left-6 top-3 bottom-3 w-px bg-border h-full" />
                  ) : null}

                  {/* Step number or status icon */}
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium z-10',
                      status === 'pending' && 'bg-gray-800 text-accent',
                      status === 'running' && 'bg-accent text-background',
                      status === 'completed' && 'bg-emerald-500 text-white',
                      status === 'failed' && 'bg-red-500 text-white'
                    )}
                  >
                    {status === 'pending' ? (
                      i + 1
                    ) : status === 'running' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : status === 'completed' ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                  </div>

                  {/* Step info */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-foreground">
                        {step.eventType}
                      </span>
                      {hasCustom && (
                        <Badge
                          variant="accent"
                          size="sm"
                        >
                          Customized
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      {step.description}
                    </p>
                    {step.delayMs > 0 && (
                      <p className="text-xs text-muted/70 mt-1">
                        Delay: {step.delayMs / 1000}s
                      </p>
                    )}
                  </div>

                  {/* Edit button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditPayload(step.id)}
                    disabled={isRunning}
                    className="shrink-0"
                  >
                    <Pencil className="w-3 h-3 mr-1.5" />
                    Edit Payload
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Execution Status */}
      {executionState && executionState.status !== 'idle' && (
        <div
          className={cn(
            'p-4 rounded-lg border',
            executionState.status === 'running' &&
              'border-accent/30 bg-accent/5',
            executionState.status === 'completed' &&
              'border-emerald-500/30 bg-emerald-500/5',
            executionState.status === 'failed' &&
              'border-red-500/30 bg-red-500/5'
          )}
        >
          <div className="flex items-center gap-2">
            {executionState.status === 'running' && (
              <>
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
                <span className="text-sm text-accent">Running workflow...</span>
              </>
            )}
            {executionState.status === 'completed' && (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-500">
                  Workflow completed successfully
                </span>
              </>
            )}
            {executionState.status === 'failed' && (
              <>
                <X className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">Workflow failed</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="success"
          className="flex-1"
          onClick={onRun}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            'Run Workflow'
          )}
        </Button>
      </div>
    </div>
  );
}
