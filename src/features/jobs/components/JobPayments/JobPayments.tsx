'use client';
import { CircleCheck, Repeat2 } from 'lucide-react';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { JobTabs } from '@/features/jobs/components/JobTabs/JobTabs';
import { JobFinanceSidebar } from '@/features/jobs/components/JobFinanceSidebar/JobFinanceSidebar';
import { useJobPayments } from '@/features/jobs/hooks/useJobPayments/useJobPayments';
import { paymentSummary } from '@/features/jobs/helpers/jobDetailHelpers';
import { jobPaymentColumns } from '@/features/jobs/helpers/jobPaymentColumns';
import { formatNaira } from '@/lib/format/formatNaira';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function JobPayments({ detail }: { detail: JobDetail }) {
  const table = useJobPayments(detail);
  const summary = paymentSummary(detail.payments);
  return (
    <section aria-label="Job payments" className="min-w-0 space-y-3">
      <TableToolbar
        leading={<JobTabs jobId={detail.job.id} />}
        label="Job payments"
        count={table.count}
        search={table.search}
        status={table.status}
        statuses={['Paid', 'Pending', 'Upcoming']}
        onSearch={table.setSearch}
        onStatus={table.setStatus}
      />
      <div className="grid min-w-0 items-start gap-4 min-[75rem]:grid-cols-[minmax(0,4fr)_minmax(12rem,1fr)]">
        <div className="min-w-0 rounded-xl bg-white p-3">
          <div className="min-w-0 rounded-xl border border-slate-100 p-3">
            <div className="overview-stagger mb-4 grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: 'Completed Payments',
                  icon: CircleCheck,
                  amount: summary.completedAmount,
                  count: summary.paid,
                  note: 'Paid in the sample period',
                },
                {
                  label: 'Upcoming Payments',
                  icon: Repeat2,
                  amount: summary.upcomingAmount,
                  count: summary.pending + summary.upcoming,
                  note: 'Sample scheduled payments',
                },
              ].map(({ label, icon: Icon, amount, count, note }) => (
                <section
                  key={label}
                  className="overview-card rounded-xl bg-neutral-50 p-4"
                >
                  <div className="flex justify-between gap-3">
                    <Icon
                      className={`size-4 ${label.startsWith('Completed') ? 'text-emerald-500' : 'text-orange-400'}`}
                    />
                    <span className="rounded-full bg-white px-2 py-1 text-[9px] text-slate-500">
                      {count}
                    </span>
                  </div>
                  <h2 className="mt-3 text-sm font-semibold">{label}</h2>
                  <p className="mt-1 text-[10px] text-neutral-400">{note}</p>
                  <p className="mt-7 text-2xl font-bold tracking-tight text-neutral-600">
                    {formatNaira(amount)}
                  </p>
                </section>
              ))}
            </div>
            <DataTable
              caption="Job payments"
              rows={table.rows}
              columns={jobPaymentColumns}
              rowKey={(row) => row.id}
              tableClassName="min-w-160"
            />
          </div>
          <div className="mt-4">
            <Pagination
              page={table.page}
              pages={table.pages}
              count={table.count}
              onPageChange={table.setPage}
            />
          </div>
        </div>
        <JobFinanceSidebar detail={detail} kind="payments" />
      </div>
    </section>
  );
}
