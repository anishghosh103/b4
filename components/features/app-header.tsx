import { ReactNode } from 'react';

interface AppHeaderProps {
  left: ReactNode;
  right?: ReactNode;
}

export function AppHeader({ left, right }: AppHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-background/70 backdrop-blur-xl z-50 sticky top-0">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {left}
        {right && <div className="flex items-center gap-3">{right}</div>}
      </div>
    </header>
  );
}
