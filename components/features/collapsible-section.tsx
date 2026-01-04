'use client';

import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { CopyButton } from './copy-button';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  copyValue?: string;
  className?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  copyValue,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border-b border-border', className)}>
      <div
        role="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-muted/5 dark:hover:bg-muted/10 transition-colors cursor-default"
      >
        {isOpen ? (
          <ChevronDown className="size-4 text-muted shrink-0" />
        ) : (
          <ChevronRight className="size-4 text-muted shrink-0" />
        )}
        <span className="text-sm font-medium text-foreground flex-1">
          {title}
        </span>
        {copyValue && (
          <div onClick={(e) => e.stopPropagation()}>
            <CopyButton value={copyValue} />
          </div>
        )}
      </div>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-border">{children}</div>
      </div>
    </div>
  );
}
