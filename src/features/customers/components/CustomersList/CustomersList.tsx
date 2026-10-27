'use client';
import {
  UsersRound,
  ShieldCheck,
  UserRoundX,
  Award,
  Store,
  TrendingUp,
} from 'lucide-react';
import type { Customer } from '@/features/customers/types/customerTypes';
import {
  CUSTOMER_METRICS,
  CUSTOMER_TOTAL,
} from '@/features/customers/fixtures/customerFixtures';
import { useFixtureTable } from '@/features/customers/hooks/useFixtureTable/useFixtureTable';
import { customerColumns } from '@/features/customers/helpers/customerColumns';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { CustomerTableToolbar } from '@/features/customers/components/CustomerTableToolbar/CustomerTableToolbar';
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
      <div className="overview-stagger grid gap-3 sm:grid-cols-2 min-[70rem]:grid-cols-5">
        {CUSTOMER_METRICS.map((metric, index) => {
          const Icon = icons[index] || UsersRound;
          return (
            <section
              key={metric.label}
              aria-label={metric.label}
              className="overview-card min-w-0 rounded-lg bg-white p-3"
            >
              <h2 className="flex items-center gap-2 text-xs text-[#4c554e]">
                <Icon className="size-3.5" />
                {metric.label}
              </h2>
              <div className="mt-5 flex items-center justify-between gap-2">
                <strong className="text-lg font-bold tracking-tight">
                  {metric.value}
                </strong>
                <span className="flex items-center rounded-full bg-emerald-50 px-1 text-[9px] text-emerald-600">
                  <TrendingUp className="mr-1 size-2.5" />
                  +4.2%
                </span>
              </div>
            </section>
          );
        })}
      </div>
      <p role="note" className="text-[10px] text-slate-500">
        Static customer presentation data · {customers.length} sample records ·
        Counts above are design fixtures. Administrative actions unavailable.
      </p>
      <CustomerTableToolbar
        label="Customer count"
        count={CUSTOMER_TOTAL}
        search={table.search}
        status={table.status}
        statuses={['Active', 'Inactive', 'Suspended']}
        onSearch={table.setSearch}
        onStatus={table.setStatus}
        create
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
