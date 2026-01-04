'use client';

import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface JsonViewerProps {
  data: unknown;
  maxHeight?: string;
  className?: string;
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-violet-500 dark:text-violet-400'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-foreground'; // key
          match = match.slice(0, -1) + '<span class="text-muted">:</span>';
        } else {
          cls = 'text-emerald-600 dark:text-emerald-400'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-amber-600 dark:text-amber-400'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-red-500 dark:text-red-400'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export function JsonViewer({
  data,
  maxHeight = 'max-h-64',
  className,
}: JsonViewerProps) {
  const formattedJson = useMemo(() => {
    if (data === undefined || data === null) {
      return '<span class="text-muted italic">No data</span>';
    }
    try {
      const jsonString =
        typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      return syntaxHighlight(jsonString);
    } catch {
      return '<span class="text-red-500">Invalid JSON</span>';
    }
  }, [data]);

  return (
    <div
      className={cn(
        'rounded-lg bg-muted/5 border border-border overflow-auto',
        maxHeight,
        className
      )}
    >
      <pre
        className="p-3 text-xs font-mono leading-relaxed whitespace-pre-wrap break-all"
        dangerouslySetInnerHTML={{ __html: formattedJson }}
      />
    </div>
  );
}
