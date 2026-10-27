'use client';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import { ADMIN_ROLES } from '@/features/settings/fixtures/settingsFixtures';
import { PERMISSION_LABELS } from '@/features/settings/constants/permissions';
export function useAdminRolesTable() {
  return useFixtureTable({
    rows: ADMIN_ROLES,
    pageSize: 6,
    searchText: (row) =>
      `${row.name} ${row.access} ${row.users.join(' ')} ${row.permissions.map((key) => PERMISSION_LABELS[key]).join(' ')}`,
    rowStatus: (row) => row.status,
  });
}
