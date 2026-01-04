import { auth } from '@/lib/auth';
import Webhook, { IWebhook } from '@/lib/models/Webhook';
import dbConnect from '@/lib/mongodb';
import {
  canTriggerWorkflow,
  incrementWorkflowUsage,
} from '@/lib/services/subscriptionService';
import { forwardWebhookToServer } from '@/lib/webhook-forwarder';
import { getWorkflowById } from '@/lib/workflows/definitions';
import {
  createStripeMockContext,
  generateStripeMockPayload,
} from '@/lib/workflows/mock-data/stripe';
import {
  TriggerWorkflowRequest,
  WorkflowProgressEvent,
} from '@/lib/workflows/types';
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: webhookUniqueId } = await params;
  const body: TriggerWorkflowRequest = await request.json();
  const { workflowId, customPayloads } = body;

  await dbConnect();

  // 2. Get webhook and verify ownership
  const webhook = await Webhook.findOne({
    uniqueId: webhookUniqueId,
    userId: session.user.id,
  }).lean<IWebhook & { _id: Types.ObjectId }>();

  if (!webhook) {
    return Response.json({ error: 'Webhook not found' }, { status: 404 });
  }

  // 3. Get workflow definition
  const workflow = getWorkflowById(workflowId);
  if (!workflow) {
    return Response.json({ error: 'Workflow not found' }, { status: 404 });
  }

  // 4. Validate platform match
  if (webhook.type !== workflow.platform && webhook.type !== 'custom') {
    return Response.json(
      { error: `This workflow requires a ${workflow.platform} webhook` },
      { status: 400 }
    );
  }

  // 5. Check CLI is enabled
  if (!webhook.cliEnabled) {
    return Response.json(
      { error: 'CLI forwarding must be enabled for this webhook' },
      { status: 400 }
    );
  }

  // 6. Check quota
  const quotaCheck = await canTriggerWorkflow(session.user.id);
  if (!quotaCheck.allowed) {
    return Response.json(
      { error: 'Workflow quota exceeded. Please upgrade to continue.' },
      { status: 403 }
    );
  }

  // 7. Increment usage before execution
  await incrementWorkflowUsage(session.user.id);

  // 8. Return SSE stream for execution progress
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: WorkflowProgressEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      try {
        // Generate mock context for consistent IDs
        const mockContext = createStripeMockContext();

        for (let i = 0; i < workflow.steps.length; i++) {
          const step = workflow.steps[i];

          // Wait for delay (except first step)
          if (step.delayMs > 0) {
            await new Promise((r) => setTimeout(r, step.delayMs));
          }

          send({
            type: 'step_started',
            stepId: step.id,
            stepIndex: i,
            timestamp: new Date().toISOString(),
          });

          // Use custom payload if provided, else generate mock
          let payload: object;
          if (customPayloads && customPayloads[step.id]) {
            payload = customPayloads[step.id];
          } else {
            const generated = generateStripeMockPayload(
              step.eventType,
              mockContext
            );
            if (!generated) {
              send({
                type: 'step_failed',
                stepId: step.id,
                stepIndex: i,
                error: `Unknown event type: ${step.eventType}`,
                timestamp: new Date().toISOString(),
              });
              send({
                type: 'workflow_failed',
                error: `Step ${step.name} failed`,
                timestamp: new Date().toISOString(),
              });
              controller.close();
              return;
            }
            payload = generated;
          }

          // Forward to CLI (no signature since this is mock data)
          const result = await forwardWebhookToServer({
            webhookId: webhookUniqueId,
            eventId: new Types.ObjectId(),
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: payload,
          });

          if (!result.success && !result.queued) {
            send({
              type: 'step_failed',
              stepId: step.id,
              stepIndex: i,
              error: result.error || 'Failed to forward to CLI',
              timestamp: new Date().toISOString(),
            });
            send({
              type: 'workflow_failed',
              error: `Step ${step.name} failed`,
              timestamp: new Date().toISOString(),
            });
            controller.close();
            return;
          }

          send({
            type: 'step_completed',
            stepId: step.id,
            stepIndex: i,
            timestamp: new Date().toISOString(),
          });
        }

        send({
          type: 'workflow_completed',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        send({
          type: 'workflow_failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
