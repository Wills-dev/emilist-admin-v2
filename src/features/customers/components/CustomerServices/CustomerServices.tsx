'use client';
import { useState } from 'react';
import { UserRound, Star } from 'lucide-react';
import { DetailField } from '@/components/molecules/DetailField/DetailField';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { CustomerGallery } from '@/features/customers/components/CustomerGallery/CustomerGallery';
import { ServiceEvidence } from '@/features/customers/components/ServiceEvidence/ServiceEvidence';
import {
  SERVICE_CATEGORIES,
  SERVICE_ADDRESS,
  CARPENTRY_SERVICE,
} from '@/features/customers/fixtures/customerFixtures';
import { cn } from '@/lib/utils/cn';

const photos = Array.from(
  { length: 7 },
  (_, index) => `Service photo ${index + 1}`,
);

export function CustomerServices({ customerId }: { customerId: string }) {
  const [category, setCategory] = useState('Carpenter');
  if (customerId !== '612c54')
    return (
      <EmptyState
        title="No service fixtures"
        description="No service presentation records are supplied for this sample customer."
      />
    );
  return (
    <section
      aria-label="Services"
      className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)]"
    >
      <div className="min-w-0 overflow-hidden rounded-2xl bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div
            role="group"
            aria-label="Service categories"
            className="flex flex-wrap gap-2"
          >
            {SERVICE_CATEGORIES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
                className={cn(
                  'rounded-xl px-3 py-2 text-xs text-neutral-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none',
                  category === value
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-neutral-50',
                )}
              >
                {value}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">
            3 services offered · Sample
          </span>
        </div>
        {category === 'Carpenter' ? (
          <div className="space-y-3 p-4">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-4">
              <span
                aria-label="Business photo unavailable"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700"
              >
                <UserRound className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-slate-950">
                  {CARPENTRY_SERVICE.name}{' '}
                  <span className="ml-2 text-xs font-normal text-neutral-500 italic">
                    starts from{' '}
                    <strong className="text-emerald-600 not-italic">
                      ₦15k/day
                    </strong>
                  </span>
                </h2>
                <p className="mt-2 text-xs text-slate-500">
                  {CARPENTRY_SERVICE.location}
                </p>
              </div>
              <StatusBadge tone="success">Verified · sample</StatusBadge>
            </div>
            <p className="rounded-xl border border-slate-100 bg-neutral-50 p-3 text-xs leading-5 text-neutral-500">
              {CARPENTRY_SERVICE.description}
            </p>
            <dl className="grid gap-3 sm:grid-cols-3">
              {CARPENTRY_SERVICE.metrics.map(([label, value]) => (
                <DetailField key={label} label={label}>
                  {value}
                </DetailField>
              ))}
            </dl>
            <dl className="grid gap-3 sm:grid-cols-2">
              {SERVICE_ADDRESS.map(([label, value]) => (
                <DetailField key={label} label={label}>
                  {value}
                </DetailField>
              ))}
              <DetailField label="Service Coverage State(s)">
                <div className="flex flex-wrap gap-1">
                  {CARPENTRY_SERVICE.coverage.map((value) => (
                    <span
                      key={value}
                      className="rounded-full bg-neutral-50 px-2 text-[10px] font-normal text-neutral-500"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </DetailField>
              <DetailField label="Preferred Coverage Location(s)">
                <div className="flex flex-wrap gap-1">
                  {CARPENTRY_SERVICE.locations.map((value) => (
                    <span
                      key={value}
                      className="rounded-full bg-neutral-50 px-2 text-[10px] font-normal text-neutral-500"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </DetailField>
            </dl>
            <CustomerGallery label="Service images" items={photos} />
          </div>
        ) : (
          <div className="p-4">
            <EmptyState
              title={`${category} service details unavailable`}
              description="Only the carpentry service details were supplied for the presentation fixtures."
            />
          </div>
        )}
      </div>
      <ServiceEvidence />
      <span className="sr-only">
        <Star aria-hidden="true" />
        All service metrics and verification labels are sample presentation
        data.
      </span>
    </section>
  );
}
