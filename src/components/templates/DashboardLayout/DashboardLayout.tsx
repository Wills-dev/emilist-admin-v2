import type { DashboardProfile } from '@/types/DashboardProfile';
import type { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/organisms/DashboardSidebar/DashboardSidebar';
import { DashboardHeader } from '@/components/organisms/DashboardHeader/DashboardHeader';
export function DashboardLayout({
  children,
  profile,
  date,
}: {
  children: ReactNode;
  profile: DashboardProfile;
  date: string;
}) {
  return (
    <div className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#f5f7f5] text-[#343b36]">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-white p-3 text-emerald-700 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <DashboardHeader date={date} initials={profile.initials} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <DashboardSidebar profile={profile} />
        <main
          id="main-content"
          tabIndex={0}
          aria-label="Administration workspace"
          className="relative min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-3"
        >
          <div className="mx-auto max-w-400">{children}</div>
        </main>
      </div>
    </div>
  );
}
