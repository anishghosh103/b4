'use client';

import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { FormEvent, useState } from 'react';

interface WaitlistFormProps {
  variant?: 'default' | 'large';
  className?: string;
}

export function WaitlistForm({
  variant = 'default',
  className,
}: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl',
          'bg-linear-to-r from-emerald-400/10 to-emerald-400/5 dark:from-emerald-500/10 dark:to-emerald-500/5',
          'border border-emerald-500/30',
          'animate-slide-up',
          variant === 'large' ? 'px-6 py-5' : 'px-4 py-4',
          className
        )}
      >
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-emerald-500 dark:text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <p
            className={cn(
              'font-medium text-emerald-600 dark:text-emerald-400',
              variant === 'large' ? 'text-lg' : 'text-base'
            )}
          >
            You&apos;re on the list!
          </p>
          <p className="text-sm text-emerald-500/80 dark:text-emerald-400/70">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col sm:flex-row gap-3 relative', className)}
    >
      <div className="relative flex-1">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          inputSize={variant === 'large' ? 'lg' : 'md'}
          disabled={status === 'loading'}
          required
          className={cn(
            'pr-4',
            status === 'error' && 'border-red-500/50 focus:ring-red-500/20'
          )}
        />
        {/* Decorative glow */}
        <div className="absolute inset-0 -z-10 rounded-xl bg-accent/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
      </div>

      <Button
        type="submit"
        variant="primary"
        size={variant === 'large' ? 'lg' : 'md'}
        isLoading={status === 'loading'}
        className="whitespace-nowrap"
      >
        {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
      </Button>

      {status === 'error' && (
        <p
          className={cn(
            'absolute -bottom-6 left-0 text-red-400 text-sm',
            'animate-slide-up'
          )}
        >
          {message}
        </p>
      )}
    </form>
  );
}
