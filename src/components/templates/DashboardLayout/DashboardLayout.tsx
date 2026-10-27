import type { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/organisms/DashboardSidebar/DashboardSidebar';
import { DashboardHeader } from '@/components/organisms/DashboardHeader/DashboardHeader';
export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary p-3 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-4 sm:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
