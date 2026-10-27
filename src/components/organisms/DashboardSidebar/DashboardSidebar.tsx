'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import {
  House,
  UsersRound,
  NotebookText,
  HandCoins,
  Wallet,
  MessageSquare,
  Files,
  CircleHelp,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useSidebarStore } from '@/hooks/useSidebarStore/useSidebarStore';
import { Button } from '@/components/ui/Button/Button';
import { ROUTES } from '@/constants/routes';
import type { DashboardProfile } from '@/types/DashboardProfile';
import { cn } from '@/lib/utils/cn';
const primaryItems = [
  { label: 'Overview', icon: House, href: ROUTES.dashboard },
  { label: 'Customers', icon: UsersRound, href: ROUTES.customers },
  { label: 'Jobs', icon: NotebookText },
  { label: 'Materials', icon: HandCoins },
  { label: 'Payments', icon: Wallet },
  { label: 'Support', icon: MessageSquare },
];
const secondaryItems = [
  { label: 'Reports', icon: Files },
  { label: 'Internal Tickets', icon: CircleHelp },
  { label: 'Settings', icon: Settings },
];
const itemClass =
  'flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-left text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none';
export function DashboardSidebar({ profile }: { profile: DashboardProfile }) {
  const { open, setOpen } = useSidebarStore();
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const content = (
    <>
      <nav aria-label="Main navigation" className="space-y-3">
        {primaryItems.map(({ label, icon: Icon, ...item }) =>
          item.href ? (
            <Link
              key={label}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                itemClass,
                isActive(item.href)
                  ? 'bg-[#edfdf5] text-[#00a952]'
                  : 'bg-[#f8f9f8] text-[#343b36] hover:bg-emerald-50',
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.5} />
              {label}
            </Link>
          ) : (
            <button
              key={label}
              disabled
              title="This section is not connected"
              className={cn(
                itemClass,
                'cursor-not-allowed bg-[#f8f9f8] text-[#343b36]',
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.5} />
              {label}
            </button>
          ),
        )}
      </nav>
      <div className="mt-auto space-y-3 pt-12">
        <nav
          aria-label="Workspace tools"
          className="space-y-3 border-t border-[#f0f2f0] pt-4"
        >
          {secondaryItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              disabled
              title="This section is not connected"
              className={cn(
                itemClass,
                'cursor-not-allowed bg-[#f8f9f8] text-[#343b36]',
              )}
            >
              <Icon className="size-4" strokeWidth={1.5} />
              {label}
            </button>
          ))}
          <Link
            href={ROUTES.login}
            onClick={() => setOpen(false)}
            className={cn(
              itemClass,
              'bg-[#f8f9f8] text-red-600 hover:bg-red-50',
            )}
            aria-label="Leave preview and return to sign in"
          >
            <LogOut className="size-4" strokeWidth={1.5} />
            Sign out
          </Link>
        </nav>
        <div className="flex items-center gap-3 border-t border-[#f0f2f0] pt-5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#727987] text-xs text-white">
            {profile.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs text-[#26332a]">
              {profile.displayName}
            </p>
            <p className="mt-1 text-[10px] text-[#7a827c]">
              {profile.role} · Sample profile
            </p>
          </div>
        </div>
      </div>
    </>
  );
  return (
    <>
      <aside className="hidden h-full w-52 shrink-0 flex-col overflow-y-auto border-r border-[#f0f2f0] bg-white p-4 pt-6 lg:flex">
        {content}
      </aside>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="drawer-backdrop fixed inset-0 z-30 bg-black/25" />
          <Dialog.Content
            id="dashboard-navigation"
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              document.getElementById('navigation-trigger')?.focus();
            }}
            className="drawer-panel fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-y-auto border-r bg-white px-4 pt-16 pb-5 shadow-lg"
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
