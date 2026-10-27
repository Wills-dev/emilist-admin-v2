'use client';
import {
  CircleDashed,
  MessageCircleWarning,
  Files,
  CirclePause,
  Clock,
  LifeBuoy,
} from 'lucide-react';
import { SummaryMetrics } from '@/components/molecules/SummaryMetrics/SummaryMetrics';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import {
  SUPPORT_METRICS,
  TICKET_COUNT,
} from '@/features/support/fixtures/supportFixtures';
import { supportColumns } from '@/features/support/helpers/supportColumns';
import { useSupportTable } from '@/features/support/hooks/useSupportTable/useSupportTable';
const icons = [CircleDashed, MessageCircleWarning, Files, CirclePause, Clock];
export function SupportPage() {
  const table = useSupportTable();
  return (
    <div className="space-y-4">
      <h1 className="sr-only">Support</h1>
      <SummaryMetrics
        metrics={SUPPORT_METRICS.map((metric, index) => ({
          ...metric,
          icon: icons[index] || Clock,
        }))}
      />
      <p role="note" className="text-[10px] text-slate-500">
        Static ticket presentation data · 9 samples. Times are fixed
        elapsed-time examples, not operational SLAs. Ticket actions unavailable.
      </p>
      <TableToolbar
        label="Ticket count"
        icon={LifeBuoy}
        count={TICKET_COUNT}
        search={table.search}
        status={table.status}
        statuses={['Pending', 'Resolved', 'Overdue']}
        onSearch={table.setSearch}
        onStatus={table.setStatus}
        filterControls={
          <label className="mt-3 flex items-center gap-3 text-xs text-slate-500">
            Priority
            <select
              aria-label="Filter by priority"
              value={table.priority}
              onChange={(event) => table.setPriority(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white p-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <option value="all">All priorities</option>
              {['Critical', 'High', 'Medium', 'Low'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        }
      />
      <DataTable
        caption="Support tickets"
        rows={table.rows}
        columns={supportColumns}
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
