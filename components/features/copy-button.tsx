'use client';

import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
  value: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function CopyButton({ value, className, size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const iconSize = size === 'sm' ? 'size-3.5' : 'size-4';

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'rounded-md transition-all duration-200',
        'hover:bg-muted/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        size === 'sm' ? 'p-1.5' : 'p-2',
        copied ? 'text-emerald-500' : 'text-muted hover:text-foreground',
        className
      )}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? <Check className={iconSize} /> : <Copy className={iconSize} />}
    </button>
  );
}
