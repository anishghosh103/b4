import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export function UpgradeToPro({ className }: { className?: string }) {
  return (
    <Link
      href="/settings/subscription"
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/20 py-0.5 px-2 rounded-md',
        className
      )}
    >
      <Zap className="size-3" /> Upgrade to Pro
    </Link>
  );
}
