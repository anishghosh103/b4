'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>('system');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const options = [
    { value: 'light' as const, icon: SunIcon, label: 'Light' },
    { value: 'dark' as const, icon: MoonIcon, label: 'Dark' },
    { value: 'system' as const, icon: SystemIcon, label: 'System' },
  ];

  const currentOption = options.find((o) => o.value === theme) || options[2];
  const CurrentIcon = currentOption.icon;

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="p-2 rounded-lg bg-surface border border-border w-8 h-8" />
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-1.5 rounded-lg transition-all duration-200',
          'bg-surface border border-border',
          'hover:bg-surface-elevated hover:shadow-sm',
          isOpen && 'bg-surface-elevated shadow-sm'
        )}
        aria-label={`Theme: ${currentOption.label}. Click to change.`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <CurrentIcon className="size-4 text-foreground" />
      </button>

      {/* Dropdown Menu */}
      <div
        className={cn(
          'absolute right-0 top-full mt-2 z-50',
          'min-w-[140px] p-1 space-y-0.5',
          'bg-surface border border-border rounded-xl shadow-lg',
          'transition-all duration-200 origin-top-right',
          isOpen
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        )}
        role="listbox"
        aria-label="Select theme"
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setTheme(option.value);
              setIsOpen(false);
            }}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-1.5 rounded-md',
              'transition-colors duration-150',
              'text-sm font-medium',
              theme === option.value
                ? 'bg-primary/10 text-primary'
                : 'text-muted hover:text-foreground hover:bg-surface-elevated'
            )}
            role="option"
            aria-selected={theme === option.value}
          >
            <option.icon className="w-4 h-4" />
            <span>{option.label}</span>
            {theme === option.value && (
              <CheckIcon className="w-4 h-4 ml-auto" />
            )}
          </button>
        ))}
      </div>
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}
