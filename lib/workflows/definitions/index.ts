import { Platform } from '../../platforms/types';
import { WorkflowDefinition } from '../types';
import { stripeSubscriptionFlow } from './stripe-subscription-flow';

// All available workflow definitions
const workflows: WorkflowDefinition[] = [stripeSubscriptionFlow];

// Get a workflow by its ID
export function getWorkflowById(id: string): WorkflowDefinition | undefined {
  return workflows.find((w) => w.id === id);
}

// Get all workflows for a specific platform
export function getWorkflowsForPlatform(
  platform: Platform
): WorkflowDefinition[] {
  return workflows.filter(
    (w) => w.platform === platform || platform === 'custom'
  );
}

// Get all available workflows
export function getAllWorkflows(): WorkflowDefinition[] {
  return workflows;
}

// Export individual workflows for direct import if needed
export { stripeSubscriptionFlow };
