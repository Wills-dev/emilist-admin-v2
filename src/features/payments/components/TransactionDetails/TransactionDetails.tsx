'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  Download,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { CopyValue } from '@/components/molecules/CopyValue/CopyValue';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { formatNaira } from '@/lib/format/formatNaira';
import {
  paymentDetailPresentation,
  paymentDateLabel,
} from '@/features/payments/helpers/paymentDetailPresentation';
import type { Payment } from '@/features/payments/types/paymentTypes';
export function TransactionDetails({ payment }: { payment: Payment }) {
  const router = useRouter();
  useEffect(() => {
    function dismiss(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        router.push(ROUTES.payments);
      }
    }
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [router]);
  const view = paymentDetailPresentation(payment);
  const credit = payment.direction === 'Inflow';
  const DirectionIcon = credit ? ArrowDownRight : ArrowUpRight;
  const Decoration = credit ? Plus : Minus;
  const link =
    'inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs text-neutral-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none';
  return (
    <main
      aria-label="Transaction details workspace"
      className="flex h-dvh max-h-dvh flex-col items-center overflow-y-auto overscroll-contain bg-[#e5e9e7] p-4 text-[#343b36] sm:p-8"
    >
      <div className="my-auto w-full max-w-lg shrink-0 py-4">
        <nav
          aria-label="Transaction navigation"
          className="mb-3 flex items-center justify-between gap-3"
        >
          <Link href={ROUTES.payments} className={link}>
            <ChevronLeft className="size-3.5" />
            Back
          </Link>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] text-emerald-700">
            Demo Mode
          </span>
          <Link
            href={ROUTES.payments}
            aria-label="Close transaction details"
            className="rounded-lg bg-white p-2 text-neutral-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
          >
            <X className="size-4" />
          </Link>
        </nav>
        <article className="overview-enter relative isolate overflow-hidden rounded-2xl bg-white p-3 sm:p-4">
          <h1 className="sr-only">Transaction Details</h1>
          <header className="relative border-b border-dashed border-slate-200 pt-2 pb-4 text-center">
            <Decoration
              aria-hidden="true"
              strokeWidth={4}
              className={`pointer-events-none absolute -top-6 right-10 -z-10 size-24 ${credit ? 'text-emerald-50' : 'text-rose-50'}`}
            />
            <span
              className={`mx-auto flex size-12 items-center justify-center rounded-2xl border-4 ${credit ? 'border-emerald-50 bg-emerald-100 text-emerald-500' : 'border-rose-50 bg-rose-100 text-rose-500'}`}
            >
              <DirectionIcon className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-xs">{view.direction}</p>
            <p className="mt-3 text-xs text-neutral-600">
              {paymentDateLabel(payment)}
            </p>
            <div className="mt-2">
              <StatusBadge tone={view.tone}>{view.badge}</StatusBadge>
            </div>
          </header>
          <section
            aria-label="Transaction amount"
            className="relative border-b border-dashed border-slate-200 py-5 text-center"
          >
            <Decoration
              aria-hidden="true"
              strokeWidth={4}
              className={`pointer-events-none absolute top-4 left-14 -z-10 size-12 ${credit ? 'text-emerald-50' : 'text-rose-50'}`}
            />
            <p className="text-[10px] text-neutral-400">{view.amountLabel}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-[#4c554e]">
              {formatNaira(payment.amount)}
            </p>
          </section>
          <dl className="my-3 space-y-5 rounded-lg border border-slate-100 bg-gradient-to-br from-white to-neutral-50 p-3 text-xs">
            {[
              ['Counterparty', payment.counterparty],
              ['Transaction Type', payment.direction],
              ['Status', view.status],
              ['Payment Method', payment.method],
              ['Description', payment.description],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-3"
              >
                <dt className="text-[#788096]">{label}</dt>
                <dd className="min-w-0 text-right break-words">{value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-3">
              <dt className="text-[#788096]">Transaction ID</dt>
              <dd className="min-w-0 text-right">
                <CopyValue value={payment.id} label="transaction ID" />
              </dd>
            </div>
          </dl>
          <footer className="border-t border-dashed border-slate-200 pt-3">
            <button
              type="button"
              disabled
              title="Verified receipt files and backend downloads have not been supplied"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-600 disabled:cursor-not-allowed"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Download PDF
            </button>
          </footer>
        </article>
      </div>
    </main>
  );
}
