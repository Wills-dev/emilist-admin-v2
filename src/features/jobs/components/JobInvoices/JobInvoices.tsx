'use client';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
import { JobTabs } from '@/features/jobs/components/JobTabs/JobTabs';
import { JobInvoiceCard } from '@/features/jobs/components/JobInvoiceCard/JobInvoiceCard';
import { JobFinanceSidebar } from '@/features/jobs/components/JobFinanceSidebar/JobFinanceSidebar';
import { useJobInvoices } from '@/features/jobs/hooks/useJobInvoices/useJobInvoices';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function JobInvoices({ detail }: { detail: JobDetail }) {
  const table = useJobInvoices(detail);
  return (
    <section aria-label="Job invoices" className="min-w-0 space-y-3">
      <TableToolbar
        leading={<JobTabs jobId={detail.job.id} />}
        label="Job invoices"
        count={table.count}
        search={table.search}
        status={table.status}
        statuses={['Paid', 'Unpaid']}
        onSearch={table.setSearch}
        onStatus={table.setStatus}
      />
      <div className="grid min-w-0 items-start gap-4 min-[75rem]:grid-cols-[minmax(0,4fr)_minmax(12rem,1fr)]">
        <div className="min-w-0 rounded-xl bg-white p-3">
          {table.rows.length ? (
            <div className="overview-stagger grid min-w-0 gap-4 md:grid-cols-2">
              {table.rows.map((invoice) => (
                <JobInvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  jobId={detail.job.id}
                  position={
                    detail.invoices.findIndex((row) => row.id === invoice.id) +
                    1
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No invoice samples"
              description="No invoices match your filters, or no invoice fixtures have been supplied for this job."
            />
          )}
          <div className="mt-4">
            <Pagination
              page={table.page}
              pages={table.pages}
              count={table.count}
              onPageChange={table.setPage}
            />
          </div>
        </div>
        <JobFinanceSidebar detail={detail} kind="invoices" />
      </div>
    </section>
  );
}
