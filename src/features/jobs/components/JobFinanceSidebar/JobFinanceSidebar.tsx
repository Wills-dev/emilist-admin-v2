import { NotebookText, ReceiptText, CalendarDays } from 'lucide-react';
import { formatNaira } from '@/lib/format/formatNaira';
import {
  invoiceSummary,
  paymentSummary,
  formatJobDate,
} from '@/features/jobs/helpers/jobDetailHelpers';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function JobFinanceSidebar({
  detail,
  kind,
}: {
  detail: JobDetail;
  kind: 'invoices' | 'payments';
}) {
  const invoices = invoiceSummary(detail.invoices);
  const payments = paymentSummary(detail.payments);
  const rows =
    kind === 'invoices'
      ? [
          ['Total No of Invoices', invoices.total],
          ['Milestone Invoices', invoices.milestone],
          ['Additional Invoices', invoices.additional],
          ['Paid Invoices', invoices.paid],
          ['Pending Invoices', invoices.pending],
        ]
      : [
          ['Total No of Payments', payments.total],
          ['Milestone Payments', payments.total],
          ['Additional Payments', 0],
          ['Paid', payments.paid],
          ['Pending', payments.pending],
          ['Upcoming', payments.upcoming],
        ];
  return (
    <aside
      aria-label={`${kind === 'invoices' ? 'Invoice' : 'Payments'} summary`}
      className="min-w-0 space-y-3"
    >
      <section className="rounded-lg bg-white p-3">
        <h2 className="flex items-center gap-2 rounded-lg bg-neutral-50 p-3 text-[10px] text-[#788096]">
          <NotebookText className="size-3" />
          {kind === 'invoices' ? 'Invoice Log' : 'Payments Log'}
        </h2>
        <dl className="mt-3 space-y-0 text-xs text-neutral-500">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex flex-wrap gap-1 border-t border-slate-100 py-3"
            >
              <dt>{label}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="rounded-lg bg-white p-3">
        <h2 className="flex items-center gap-2 rounded-lg bg-neutral-50 p-3 text-[10px] text-[#788096]">
          <ReceiptText className="size-3" />
          {kind === 'invoices' ? 'Invoice Payments' : 'Payments'}
        </h2>
        <dl className="mt-3 text-xs text-neutral-500">
          <div className="flex flex-wrap gap-1 border-t border-slate-100 py-3">
            <dt>Total Invoiced:</dt>
            <dd>{formatNaira(invoices.amount)}</dd>
          </div>
          <div className="border-t border-slate-100 py-3">
            <dt>Start Date:</dt>
            <dd className="mt-1">
              {detail.invoices[0]
                ? formatJobDate(detail.invoices[0].issued)
                : 'Not supplied'}
            </dd>
          </div>
          <div className="border-t border-slate-100 py-3">
            <dt>End Date:</dt>
            <dd className="mt-1">
              {detail.invoices.length
                ? formatJobDate(
                    [...detail.invoices]
                      .map((row) => row.due)
                      .sort()
                      .at(-1)!,
                  )
                : 'Not supplied'}
            </dd>
          </div>
        </dl>
        <p className="border-t border-slate-100 pt-3 text-[10px] leading-4 text-neutral-400">
          Historical synthetic dates and statuses; no live payment schedule.
        </p>
      </section>
      {kind === 'invoices' && (
        <section className="rounded-lg bg-white p-3">
          <h2 className="flex items-center gap-2 rounded-lg bg-neutral-50 p-3 text-[10px] text-[#788096]">
            <CalendarDays className="size-3" />
            Invoice Notes
          </h2>
          <p className="mt-3 text-[10px] leading-5 text-neutral-600">
            The sample includes an additional invoice for extra work. Amounts
            and approval records are synthetic; billing and downloads are not
            connected.
          </p>
        </section>
      )}
    </aside>
  );
}
