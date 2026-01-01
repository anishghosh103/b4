'use client';

import { cn } from '@/lib/utils';
import { FlaskConical, Settings, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface WebhookNavProps {
  webhookId: string;
}

export function WebhookNav({ webhookId }: WebhookNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: `/webhook/${webhookId}/events`,
      label: 'Events',
      icon: Zap,
      isActive: pathname.includes('/events'),
    },
    {
      href: `/webhook/${webhookId}/workflows`,
      label: 'Workflows',
      icon: FlaskConical,
      isActive: pathname.includes('/workflows'),
      disabled: true,
    },
    {
      href: `/webhook/${webhookId}/settings`,
      label: 'Settings',
      icon: Settings,
      isActive: pathname.includes('/settings'),
    },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 rounded-lg border border-transparent',
            'text-sm font-medium transition-colors',
            item.isActive
              ? 'bg-accent/10 text-foreground dark:text-accent border-accent/20'
              : 'text-muted hover:text-foreground hover:bg-surface-elevated',
            item.disabled
              ? 'text-muted cursor-not-allowed opacity-50 pointer-events-none'
              : ''
          )}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
