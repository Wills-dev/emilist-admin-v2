'use client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { ActionDialog } from '@/components/molecules/ActionDialog/ActionDialog';
import { ROUTES } from '@/constants/routes';
import { useSidebarStore } from '@/hooks/useSidebarStore/useSidebarStore';
export function SignOutDialog({
  menuItem = false,
  onOpenChange,
}: {
  menuItem?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const { setOpen } = useSidebarStore();
  return (
    <ActionDialog
      title="Sign Out"
      description="Leave the demo and return to sign in?"
      width="sm"
      trigger={
        <button
          type="button"
          role={menuItem ? 'menuitem' : undefined}
          tabIndex={menuItem ? -1 : undefined}
          aria-label={
            menuItem ? 'Sign out' : 'Leave preview and return to sign in'
          }
          className={
            menuItem
              ? 'flex w-full items-center gap-2 rounded p-2 text-left text-xs text-rose-600 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-emerald-600'
              : 'flex w-full items-center gap-3 rounded-md bg-[#f8f9f8] px-3 py-1.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none'
          }
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </button>
      }
      confirmLabel="Sign Out"
      tone="danger"
      confirmDisabled={false}
      note=""
      onOpenChange={onOpenChange}
      onConfirm={() => {
        setOpen(false);
        router.push(ROUTES.login);
      }}
    />
  );
}
