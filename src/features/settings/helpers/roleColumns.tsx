'use client';
import type { DataTableColumn } from '@/components/organisms/DataTable/DataTable';
import { RecordActions } from '@/components/molecules/RecordActions/RecordActions';
import { RecordStatus } from '@/components/molecules/RecordStatus/RecordStatus';
import { PERMISSION_LABELS } from '@/features/settings/constants/permissions';
import type { AdminRole } from '@/features/settings/types/settingsTypes';
export const roleColumns: readonly DataTableColumn<AdminRole>[] = [
  {
    id: 'date',
    header: 'Date Created',
    className: 'w-26',
    cell: (row) => row.date,
  },
  {
    id: 'time',
    header: 'Time Created',
    className: 'w-24',
    cell: (row) => row.time,
  },
  {
    id: 'name',
    header: 'Role name',
    className: 'w-28',
    cell: (row) => <span className="text-slate-950">{row.name}</span>,
  },
  {
    id: 'access',
    header: 'Access Type',
    className: 'w-22',
    cell: (row) => row.access,
  },
  {
    id: 'permissions',
    header: 'Permissions Assigned',
    className: 'w-40',
    cell: (row) =>
      row.permissions.length
        ? row.permissions.map((key) => PERMISSION_LABELS[key]).join(', ')
        : 'No Permissions',
  },
  {
    id: 'users',
    header: 'Users',
    className: 'w-14 text-center',
    cell: (row) => row.users.length,
  },
  {
    id: 'list',
    header: 'User List',
    className: 'w-48',
    cell: (row) => (
      <span className="block truncate text-[10px]" title={row.users.join(', ')}>
        {row.users.join(', ') || '–––'}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Role Status',
    className: 'w-24',
    cell: (row) => <RecordStatus status={row.status} />,
  },
  {
    id: 'actions',
    header: '',
    className: 'w-12',
    cell: (row) => (
      <RecordActions
        name={`${row.name} role`}
        actions={['View role', 'Edit permissions', 'Revoke access']}
      />
    ),
  },
];
