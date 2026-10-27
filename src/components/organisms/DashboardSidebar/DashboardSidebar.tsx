'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { LayoutDashboard, PanelLeftClose, X } from 'lucide-react';
import { useSidebarStore } from '@/hooks/useSidebarStore/useSidebarStore';
import { Button } from '@/components/ui/Button/Button';

export function DashboardSidebar() {
  const { open, setOpen } = useSidebarStore();
  const pathname = usePathname();
  const content = (
    <>
      <Link
        href="/dashboard"
        onClick={() => setOpen(false)}
        className="text-lg font-semibold tracking-tight"
      >
        Emilist{' '}
        <span className="text-sm font-normal text-muted-foreground">Admin</span>
      </Link>
      <p className="mt-8 px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        Workspace
      </p>
      <nav aria-label="Main navigation" className="mt-3">
        <Link
          href="/dashboard"
          aria-current={pathname === '/dashboard' ? 'page' : undefined}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-md bg-muted px-3 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring"
        >
          <LayoutDashboard className="size-4" />
          Overview
        </Link>
      </nav>
      <div className="mt-auto flex items-center gap-2 border-t pt-5 text-xs text-muted-foreground">
        <PanelLeftClose className="size-4" />
        Administration workspace
      </div>
    </>
  );
  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card p-5 md:flex">
        {content}
      </aside>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-30 bg-black/30" />
          <Dialog.Content
            id="dashboard-navigation"
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              document.getElementById('navigation-trigger')?.focus();
            }}
            className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card p-5 shadow-lg"
          >
            <Dialog.Title className="sr-only">
              Workspace navigation
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-2"
                aria-label="Close navigation"
              >
                <X />
              </Button>
            </Dialog.Close>
            {content}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
