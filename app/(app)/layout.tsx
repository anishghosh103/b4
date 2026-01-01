import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background grid-bg mesh-gradient">
      {children}
    </div>
  );
}
