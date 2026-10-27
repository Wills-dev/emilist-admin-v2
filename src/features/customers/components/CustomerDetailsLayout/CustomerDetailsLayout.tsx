import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  BadgeCheck,
  Star,
  Camera,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import type { Customer } from '@/features/customers/types/customerTypes';
import {
  customerName,
  formatNaira,
} from '@/features/customers/helpers/customerHelpers';
import { CustomerTabs } from '@/features/customers/components/CustomerTabs/CustomerTabs';
import { CopyValue } from '@/features/customers/components/CopyValue/CopyValue';
export function CustomerDetailsLayout({
  customer,
  children,
}: {
  customer: Customer;
  children: ReactNode;
}) {
  const name = customerName(customer);
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={ROUTES.customers}
          className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-neutral-500 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          <ChevronLeft className="size-3.5" />
          Back to Customers
        </Link>
        <div className="flex flex-wrap gap-3">
          {[
            'Edit User Profile',
            'Send Message',
            'Trigger Password Reset',
            'Suspend Account',
          ].map((label) => (
            <button
              key={label}
              type="button"
              disabled
              title="Requires backend integration"
              className={`rounded-xl px-4 py-2 text-[11px] disabled:cursor-not-allowed ${label === 'Suspend Account' ? 'bg-rose-50 text-rose-500' : 'bg-white text-slate-950'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <section
        aria-label="Customer profile"
        className="flex flex-col gap-6 rounded-2xl bg-white p-4 sm:p-6 xl:flex-row xl:items-center xl:justify-between"
      >
        <div className="flex min-w-0 items-center gap-5">
          <div className="relative shrink-0">
            <span
              title="Customer portrait not supplied"
              className="flex size-18 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-800"
            >
              {initials}
            </span>
            {customer.verified && (
              <BadgeCheck
                aria-label="Verified in sample data only"
                className="absolute -top-1 -right-1 size-6 rounded-full border-3 border-white bg-emerald-50 p-0.5 text-emerald-700"
              />
            )}
            <span
              aria-hidden="true"
              className="absolute -bottom-1 -left-1 rounded-full border-3 border-white bg-neutral-100 p-1.5"
            >
              <Camera className="size-3 text-neutral-400" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-[#26332a]">{name}</h1>
              {customer.rating && (
                <span className="flex items-center gap-1 rounded-full bg-neutral-50 px-2 text-[10px]">
                  <Star className="size-3 fill-orange-400 text-orange-400" />
                  {customer.rating}
                </span>
              )}
            </div>
            <p className="mt-2 text-[10px] break-all text-[#788096]">
              {customer.email}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-emerald-600">
              <CopyValue value={`@${customer.username}`} label="username" />
              <CopyValue value={customer.id} label="customer ID" />
            </div>
          </div>
        </div>
        <div className="w-full xl:w-90 xl:shrink-0">
          <div className="rounded-2xl border border-slate-100 bg-[#f8f9fb] p-3">
            <p className="text-xs text-[#788096]">Wallet Balance</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <strong className="text-lg font-bold text-[#636b65]">
                {customer.wallet === undefined
                  ? 'Not provided'
                  : formatNaira(customer.wallet)}
              </strong>
              {customer.wallet !== undefined && (
                <span className="flex items-center gap-1 rounded-full bg-white px-2 text-[10px] text-emerald-600">
                  <TrendingUp className="size-3" />
                  +4.2%
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 flex gap-3">
            {['Debit Wallet', 'Credit Wallet'].map((label, index) => (
              <button
                key={label}
                type="button"
                disabled
                title="Wallet mutations require backend integration"
                className={`flex h-7 flex-1 items-center justify-center gap-1 rounded-lg text-[11px] disabled:cursor-not-allowed ${index === 0 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-700'}`}
              >
                {label}
                <ArrowRight className="size-3" />
              </button>
            ))}
          </div>
        </div>
      </section>
      <p className="rounded-xl bg-white px-2 py-2 text-[10px] text-[#788096]">
        {customer.professions?.join(' | ') ||
          'No professional categories provided'}
        <span className="ml-3 text-slate-400">
          Sample profile · No live account data
        </span>
      </p>
      <CustomerTabs customerId={customer.id} />
      {children}
    </div>
  );
}
