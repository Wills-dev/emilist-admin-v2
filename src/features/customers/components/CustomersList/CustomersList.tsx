'use client';
import { SummaryMetrics } from '@/components/molecules/SummaryMetrics/SummaryMetrics';
import {
  UsersRound,
  ShieldCheck,
  UserRoundX,
  Award,
  Store,
} from 'lucide-react';
import type { Customer } from '@/features/customers/types/customerTypes';
import {
  CUSTOMER_METRICS,
  CUSTOMER_TOTAL,
} from '@/features/customers/fixtures/customerFixtures';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import { customerColumns } from '@/features/customers/helpers/customerColumns';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
const icons = [UsersRound, ShieldCheck, UserRoundX, Award, Store];
export function CustomersList({
  customers,
}: {
  customers: readonly Customer[];
}) {
  const table = useFixtureTable({
    rows: customers,
    pageSize: 9,
    searchText: (row) =>
      `${row.fullName} ${row.listName} ${row.username} ${row.email} ${row.id}`,
    rowStatus: (row) => row.status,
  });
  return (
    <div className="space-y-4">
      <h1 className="sr-only">Customers</h1>
      <SummaryMetrics
        metrics={CUSTOMER_METRICS.map((metric, index) => ({
          ...metric,
          icon: icons[index] || UsersRound,
        }))}
      />
      <p role="note" className="text-[10px] text-slate-500">
        Static customer presentation data · {customers.length} sample records ·
        Counts above are design fixtures. Administrative actions unavailable.
      </p>
      <TableToolbar
        label="Customer count"
        count={CUSTOMER_TOTAL}
        search={table.search}
        status={table.status}
        statuses={['Active', 'Inactive', 'Suspended']}
        onSearch={table.setSearch}
        onStatus={table.setStatus}
        action={
          <button
            type="button"
            disabled
            title="Customer creation requires backend integration"
            className="h-9 rounded-lg bg-green-500 px-3 text-xs font-medium text-white disabled:cursor-not-allowed"
          >
            + Create new customer
          </button>
        }
      />
      <DataTable
        rows={table.rows}
        columns={customerColumns}
        rowKey={(row) => row.id}
        caption="Customers"
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
