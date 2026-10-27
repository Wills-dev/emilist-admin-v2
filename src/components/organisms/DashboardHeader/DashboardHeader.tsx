'use client';
import Image from 'next/image';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { useSidebarStore } from '@/hooks/useSidebarStore/useSidebarStore';
export function DashboardHeader({
  demoMode = false,
  date,
  initials,
}: {
  demoMode?: boolean;
  date: string;
  initials: string;
}) {
  const { open, setOpen } = useSidebarStore();
  return (
    <header className="flex h-18 shrink-0 items-center justify-between gap-3 border-b border-[#f0f2f0] bg-white px-4 sm:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          id="navigation-trigger"
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="dashboard-navigation"
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </Button>
        <Image
          src="/images/branding/emilist-logo.svg"
          alt="Emilist"
          width={163}
          height={38}
          priority
          className={demoMode ? 'h-auto w-20 sm:w-36' : 'h-auto w-28 sm:w-36'}
        />
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] whitespace-nowrap text-emerald-800">
          {demoMode ? 'Demo Mode' : 'Admin'}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        <span className="hidden rounded-full bg-neutral-50 px-4 py-1 text-xs text-[#66728b] sm:inline">
          {date} <span className="sr-only">(sample date)</span>
        </span>
        <button
          type="button"
          disabled
          aria-label="Notifications unavailable in preview"
          className="text-[#717a73]"
        >
          <Bell className="size-4" strokeWidth={1.5} />
        </button>
        <span
          aria-label="Sample profile"
          className="flex size-8 items-center justify-center rounded-full bg-[#727987] text-xs text-white"
        >
          {initials}
        </span>
      </div>
    </header>
  );
}
