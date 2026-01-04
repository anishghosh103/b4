'use client';

import { WorkflowDefinition } from '@/lib/workflows/types';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowCardProps {
  workflow: WorkflowDefinition;
  onClick: () => void;
  disabled?: boolean;
}

const platformColors: Record<string, string> = {
  stripe: 'bg-violet-500/10 text-violet-500',
  dodo: 'bg-emerald-500/10 text-emerald-500',
  polar: 'bg-blue-500/10 text-blue-500',
  pandadoc: 'bg-green-500/10 text-green-500',
  docusign: 'bg-yellow-500/10 text-yellow-500',
  documenso: 'bg-pink-500/10 text-pink-500',
};

const platformLabels: Record<string, string> = {
  stripe: 'Stripe',
  dodo: 'Dodo',
  polar: 'Polar',
  pandadoc: 'PandaDoc',
  docusign: 'DocuSign',
  documenso: 'Documenso',
};

export function WorkflowCard({ workflow, onClick, disabled }: WorkflowCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group w-full text-left transition-all duration-200',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <Card
        className={cn(
          'p-4 hover:border-accent/30 transition-colors',
          !disabled && 'group-hover:bg-surface-elevated'
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              platformColors[workflow.platform] || 'bg-muted/10 text-muted'
            )}
          >
            <FlaskConical className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-foreground">{workflow.name}</h3>
              <Badge
                variant="success"
                size="sm"
              >
                Ready
              </Badge>
            </div>
            <p className="text-sm text-muted line-clamp-2">{workflow.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded',
                  platformColors[workflow.platform] || 'bg-muted/10 text-muted'
                )}
              >
                {platformLabels[workflow.platform] || workflow.platform}
              </span>
              <span className="text-xs text-muted">
                {workflow.steps.length} event{workflow.steps.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <svg
            className="w-5 h-5 text-muted group-hover:text-accent transition-colors mt-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>
    </button>
  );
}
