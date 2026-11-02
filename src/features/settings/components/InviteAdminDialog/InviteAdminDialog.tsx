import { ActionDialog } from '@/components/molecules/ActionDialog/ActionDialog';
import { InviteAdminForm } from '@/features/settings/components/InviteAdminForm/InviteAdminForm';
export function InviteAdminDialog() {
  return (
    <ActionDialog
      title="Invite New Admin"
      width="sm"
      trigger={
        <button
          type="button"
          className="rounded-lg bg-[#20c46b] px-3 py-2 text-xs text-white transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
        >
          + Invite new admin
        </button>
      }
      confirmLabel="Invite Admin"
    >
      <InviteAdminForm />
    </ActionDialog>
  );
}
