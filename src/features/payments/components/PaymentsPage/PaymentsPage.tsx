'use client';
import {
  Wallet,
  Banknote,
  Clock,
  CircleX,
  ChartNoAxesCombined,
  CreditCard,
} from 'lucide-react';
import { SummaryMetrics } from '@/components/molecules/SummaryMetrics/SummaryMetrics';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import {
  PAYMENT_METRICS,
  PAYMENT_COUNT,
} from '@/features/payments/fixtures/paymentFixtures';
import { paymentColumns } from '@/features/payments/helpers/paymentColumns';
import { usePaymentsTable } from '@/features/payments/hooks/usePaymentsTable/usePaymentsTable';
const icons = [Wallet, Banknote, Clock, CircleX, ChartNoAxesCombined];
export function PaymentsPage() {
  const table = usePaymentsTable();
  return (
    <div className="space-y-4">
      <h1 className="sr-only">Payments</h1>
      <SummaryMetrics
        metrics={PAYMENT_METRICS.map((metric, index) => ({
          ...metric,
          icon: icons[index] || Wallet,
        }))}
      />
      <p role="note" className="text-[10px] text-slate-500">
        Static financial presentation data · 9 sample transactions. No financial
        operations are available.
      </p>
      <TableToolbar
        label="Transaction count"
        icon={CreditCard}
        count={PAYMENT_COUNT}
        search={table.search}
        status={table.status}
        statuses={['Pending', 'Successful', 'Failed']}
        onSearch={table.setSearch}
        onStatus={table.setStatus}
      />
      <DataTable
        caption="Payments"
        rows={table.rows}
        columns={paymentColumns}
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
