'use client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminLogout } from '@/features/auth/hooks/useAdminLogout/useAdminLogout';
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
  const logout = useAdminLogout();
  async function signOut() {
    if (logout.isPending) return;
    try {
      await logout.mutateAsync();
      setOpen(false);
      router.replace(ROUTES.login);
      router.refresh();
    } catch {
      toast.error('Unable to sign out. Please try again.');
    }
  }
  const { setOpen } = useSidebarStore();
  return (
    <ActionDialog
      title="Sign Out"
      description="Clear this browser’s sign-in and return to the login screen?"
      width="sm"
      trigger={
        <button
          type="button"
          disabled={logout.isPending}
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
      confirmDisabled={logout.isPending}
      note=""
      onOpenChange={onOpenChange}
      onConfirm={() => {
        void signOut();
      }}
    />
  );
}
