'use client';
import { useRef } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { CustomerRecordTable } from '@/features/customers/components/CustomerRecordTable/CustomerRecordTable';
import { subscriptionColumns } from '@/features/customers/helpers/customerColumns';
import {
  CUSTOMER_SUBSCRIPTIONS,
  CUSTOMER_PLANS,
} from '@/features/customers/fixtures/customerFixtures';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';

export function CustomerSubscriptions({ customerId }: { customerId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  if (customerId !== '612c54')
    return (
      <EmptyState
        title="No subscription fixtures"
        description="No subscription presentation records are supplied for this customer."
      />
    );
  function browse(direction: number) {
    ref.current?.scrollBy({
      left: direction * 300,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }
  return (
    <section aria-label="Subscriptions" className="min-w-0 space-y-4">
      <div className="min-w-0 bg-white p-2">
        <div
          ref={ref}
          role="region"
          aria-label="Subscription plans"
          tabIndex={0}
          className="flex min-w-0 gap-3 overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          {CUSTOMER_PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`w-76 shrink-0 rounded-lg border-8 border-[#f5f7f5] p-4 ${plan.active ? 'bg-[#f7fff7]' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Star
                    className={`size-6 fill-current ${plan.name === 'Gold' ? 'text-amber-300' : plan.name === 'Premium' ? 'text-emerald-200' : 'text-neutral-300'}`}
                  />
                  <div>
                    {plan.active && (
                      <p className="text-[10px] text-emerald-700">
                        Current Plan
                      </p>
                    )}
                    <h2 className="text-sm font-medium">
                      {plan.name} Plan{' '}
                      <StatusBadge tone={plan.active ? 'success' : 'neutral'}>
                        {plan.active ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </h2>
                  </div>
                </div>
                <span className="text-[10px]">
                  {plan.active ? 'Day 2 of 30' : '30/30'}
                </span>
              </div>
              <p className="mt-4 border-b border-slate-100 pb-3">
                <strong
                  className={`text-xl font-bold ${plan.active ? 'text-green-800' : 'text-neutral-600'}`}
                >
                  {plan.amount}
                </strong>
                <span className="ml-1 text-[10px] text-neutral-500">
                  /month
                </span>
              </p>
            </article>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            aria-label="Previous subscription plans"
            onClick={() => browse(-1)}
            className="rounded p-2 text-slate-500 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next subscription plans"
            onClick={() => browse(1)}
            className="rounded p-2 text-slate-500 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <ArrowRight className="size-4" />
          </button>
          <span className="self-center text-[10px] text-slate-400">
            Static plans · Billing actions unavailable
          </span>
        </div>
      </div>
      <CustomerRecordTable
        rows={CUSTOMER_SUBSCRIPTIONS}
        columns={subscriptionColumns}
        label="Subscription history"
        searchText={(row) => `${row.description} ${row.receipt}`}
        toolbar={false}
      />
    </section>
  );
}
