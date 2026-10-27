'use client';
import { UserRoundCog } from 'lucide-react';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { useAdminRolesTable } from '@/features/settings/hooks/useAdminRolesTable/useAdminRolesTable';
import { roleColumns } from '@/features/settings/helpers/roleColumns';
export function UserPermissions() {
  const table = useAdminRolesTable();
  return (
    <div className="space-y-4">
      <h2 className="sr-only">User Permissions</h2>
      <p role="note" className="text-[10px] text-slate-500">
        Static role presentation data · not an authorization policy. Invitations
        and permission changes require backend integration.
      </p>
      <TableToolbar
        label="Admin roles"
        count={table.count}
        icon={UserRoundCog}
        search={table.search}
        status={table.status}
        statuses={['Active', 'Inactive', 'Revoked']}
        onSearch={table.setSearch}
        onStatus={table.setStatus}
        leading={
          <h3 className="flex items-center gap-2 text-[10px] tracking-widest text-emerald-600">
            <UserRoundCog className="size-3" />
            ADMIN ROLES
          </h3>
        }
        action={
          <button
            type="button"
            disabled
            title="Admin invitations require the confirmed backend invitation flow"
            className="rounded-lg bg-[#20c46b] px-3 py-2 text-xs text-white disabled:cursor-not-allowed"
          >
            + Invite new admin
          </button>
        }
      />
      <DataTable
        caption="Admin roles"
        rows={table.rows}
        columns={roleColumns}
        rowKey={(row) => row.id}
      />
      <Pagination
        page={table.page}
        pages={table.pages}
        count={table.count}
        onPageChange={table.setPage}
      />
    </div>
  );
}
