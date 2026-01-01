import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2', className)}
    >
      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
        <svg
          className="w-5 h-5 text-background"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <span className="hidden sm:inline font-semibold text-lg">HookOne</span>
    </Link>
  );
}
