'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    const root = document.documentElement;
    let resolved: 'light' | 'dark';

    root.classList.add('disable-transitions');
    root.offsetHeight;

    if (newTheme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      resolved = newTheme;
    }
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    root.offsetHeight;
    root.classList.remove('disable-transitions');
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border w-[104px] h-[36px]" />
    );
  }

  const options = [
    { value: 'light' as const, icon: SunIcon, label: 'Light' },
    { value: 'dark' as const, icon: MoonIcon, label: 'Dark' },
    { value: 'system' as const, icon: SystemIcon, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            'relative p-2 rounded-lg transition-all duration-200',
            'hover:text-foreground',
            theme === option.value
              ? 'text-foreground bg-surface-elevated shadow-sm'
              : 'text-muted'
          )}
          aria-label={option.label}
        >
          <option.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SystemIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect
        x="2"
        y="3"
        width="20"
        height="14"
        rx="2"
      />
      <path d="M8 21h8m-4-4v4" />
    </svg>
  );
}
