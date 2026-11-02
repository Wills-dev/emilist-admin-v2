import Link from 'next/link';
import { ReceiptText } from 'lucide-react';
import { JOB_ROUTES } from '@/constants/routes';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { formatNaira } from '@/lib/format/formatNaira';
import { formatJobDate } from '@/features/jobs/helpers/jobDetailHelpers';
import type { JobInvoice } from '@/features/jobs/types/jobDetailTypes';
export function JobInvoiceCard({
  invoice,
  jobId,
  position,
}: {
  invoice: JobInvoice;
  jobId: string;
  position: number;
}) {
  return (
    <article
      aria-label={`Invoice ${position}`}
      className="overview-card min-w-0 space-y-2 rounded-xl border-8 border-neutral-100 bg-neutral-100"
    >
      <div className="space-y-5 rounded-xl bg-white p-4">
        <header className="flex flex-wrap justify-between gap-2">
          <h3 className="text-xs text-neutral-500">Invoice {position}</h3>
          <div className="text-right">
            <p className="text-[8px] text-slate-500">Invoice No.</p>
            <p className="mt-1 text-xs font-semibold break-all text-slate-900">
              {invoice.number}
            </p>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] text-slate-500">Billed To:</p>
            <p className="mt-2 text-xs font-medium">{invoice.billedTo}</p>
            {invoice.milestoneId ? (
              <Link
                href={JOB_ROUTES.milestone(jobId, invoice.milestoneId)}
                className="mt-2 inline-block text-[10px] text-indigo-500 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                {invoice.label}
              </Link>
            ) : (
              <p className="mt-2 text-[10px] text-indigo-500">
                {invoice.label}
              </p>
            )}
          </div>
          <dl className="text-right text-[8px] text-slate-500">
            <dt>Issued on</dt>
            <dd className="mt-1 text-slate-900">
              {formatJobDate(invoice.issued)}
            </dd>
            <dt className="mt-3">Payment Due</dt>
            <dd className="mt-1 text-slate-900">
              {formatJobDate(invoice.due)}
            </dd>
          </dl>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-4">
          <div>
            <p className="mb-2 text-[8px] text-slate-500">Status</p>
            <StatusBadge
              tone={invoice.status === 'Paid' ? 'success' : 'warning'}
            >
              {invoice.status}
            </StatusBadge>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-slate-500">
              {invoice.paidOn ? 'Date' : 'Due Date'}
            </p>
            <p className="mt-2 text-[9px] font-semibold">
              {formatJobDate(invoice.paidOn || invoice.due)}
            </p>
          </div>
        </div>
        <dl className="space-y-2 rounded-xl bg-white p-4 text-[8px] text-slate-500">
          <div className="flex flex-wrap justify-between gap-2">
            <dt>Subtotal</dt>
            <dd className="text-slate-900">{formatNaira(invoice.amount)}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt>Total (NGN)</dt>
            <dd className="text-sm font-bold text-slate-900">
              {invoice.amount.toLocaleString('en-NG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </dd>
          </div>
        </dl>
      </div>
      <button
        type="button"
        disabled
        title="Invoice files and backend downloads are unavailable"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-3 text-[10px] disabled:cursor-not-allowed"
      >
        <ReceiptText className="size-4 text-neutral-500" />
        Download Invoice
      </button>
    </article>
  );
}
