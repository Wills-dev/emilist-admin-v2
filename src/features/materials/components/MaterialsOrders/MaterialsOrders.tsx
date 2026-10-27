'use client';
import { MaterialsTabs } from '@/features/materials/components/MaterialsTabs/MaterialsTabs';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { useOrdersTable } from '@/features/materials/hooks/useOrdersTable/useOrdersTable';
import { orderColumns } from '@/features/materials/helpers/materialColumns';
export function MaterialsOrders() {
  const table = useOrdersTable();
  return (
    <div className="space-y-4">
      <h2 className="sr-only">Material Orders</h2>
      <TableToolbar
        leading={<MaterialsTabs />}
        filterControls={
          <label className="mt-3 flex items-center gap-3 text-xs text-slate-500">
            Payment
            <select
              aria-label="Filter by payment"
              value={table.payment}
              onChange={(event) => table.setPayment(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white p-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <option value="all">All payments</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </label>
        }
        label="Order samples"
        count={table.count}
        search={table.search}
        status={table.status}
        statuses={['In Transit', 'Delivered', 'Cancelled', 'Returned']}
        onSearch={table.setSearch}
        onStatus={table.setStatus}
      />
      <DataTable
        rows={table.rows}
        columns={orderColumns}
        rowKey={(row) => row.id}
        caption="Material Orders"
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
