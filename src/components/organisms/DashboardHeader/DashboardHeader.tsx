'use client';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { useSidebarStore } from '@/hooks/useSidebarStore/useSidebarStore';

export function DashboardHeader() {
  const { open, setOpen } = useSidebarStore();
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 sm:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        id="navigation-trigger"
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="dashboard-navigation"
        onClick={() => setOpen(!open)}
      >
        <Menu />
      </Button>
      <p className="text-sm font-medium">Administration</p>
      <span className="ml-auto rounded-full border px-3 py-1 text-xs text-muted-foreground">
        Foundation
      </span>
    </header>
  );
}
