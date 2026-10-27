'use client';
import type { DataTableColumn } from '@/components/organisms/DataTable/DataTable';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
export function CustomerRecordTable<T extends { id: string; status: string }>({
  rows,
  columns,
  label,
  searchText,
  toolbar = true,
}: {
  rows: readonly T[];
  columns: readonly DataTableColumn<T>[];
  label: string;
  searchText: (row: T) => string;
  toolbar?: boolean;
}) {
  const table = useFixtureTable({
    rows,
    pageSize: 6,
    searchText,
    rowStatus: (row) => row.status,
  });
  const statuses = Array.from(new Set(rows.map((row) => row.status)));
  return (
    <section aria-label={label} className="min-w-0 space-y-3">
      {toolbar && (
        <TableToolbar
          label={label}
          count={rows.length}
          search={table.search}
          status={table.status}
          statuses={statuses}
          onSearch={table.setSearch}
          onStatus={table.setStatus}
        />
      )}
      <div className="min-w-0">
        <DataTable
          rows={table.rows}
          columns={columns}
          caption={label}
          rowKey={(row) => row.id}
        />
        <Pagination
          page={table.page}
          pages={table.pages}
          count={table.count}
          onPageChange={table.setPage}
        />
      </div>
    </section>
  );
}
