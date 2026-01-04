import { Platform } from '../platforms/types';

// A single step in a workflow
export interface WorkflowStep {
  id: string;
  eventType: string;
  name: string;
  description: string;
  delayMs: number;
}

// Workflow definition (static, defined in code)
export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  platform: Platform;
  steps: WorkflowStep[];
}

// Execution state for UI (client-side only, not persisted)
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface StepExecutionState {
  stepId: string;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface WorkflowExecutionState {
  workflowId: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  steps: StepExecutionState[];
  startedAt?: string;
  completedAt?: string;
  currentStepIndex: number;
}

// API request/response types
export interface TriggerWorkflowRequest {
  workflowId: string;
  customPayloads?: Record<string, object>;
}

// SSE event types for real-time progress
export interface WorkflowProgressEvent {
  type:
    | 'step_started'
    | 'step_completed'
    | 'step_failed'
    | 'workflow_completed'
    | 'workflow_failed';
  stepId?: string;
  stepIndex?: number;
  error?: string;
  timestamp: string;
}
