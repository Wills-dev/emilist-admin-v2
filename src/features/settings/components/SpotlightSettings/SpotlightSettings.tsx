'use client';
import { Star, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/Input/Input';
import { SettingsSection } from '@/features/settings/components/SettingsSection/SettingsSection';
import { useSpotlightSelection } from '@/features/settings/hooks/useSpotlightSelection/useSpotlightSelection';
export function SpotlightSettings() {
  const selection = useSpotlightSelection();
  const [filters, setFilters] = useState(false);
  return (
    <SettingsSection
      title="Spotlight Customers of the Week"
      description="Select the best service providers and merchants on the platform"
      action={
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <button
            type="button"
            aria-label="Toggle spotlight filters"
            aria-expanded={filters}
            onClick={() => setFilters(!filters)}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
          >
            <SlidersHorizontal className="size-4" />
          </button>
          <label className="relative min-w-0 flex-1 sm:w-52">
            <span className="sr-only">Search spotlight candidates</span>
            <Search className="absolute top-3 left-2 size-3.5 text-slate-400" />
            <Input
              value={selection.search}
              onChange={(event) => selection.setSearch(event.target.value)}
              placeholder="Search name, ID, username"
              className="h-9 min-w-0 border-slate-100 bg-white pl-7 text-[10px]"
            />
          </label>
          <button
            type="button"
            disabled
            title="Publishing requires backend integration"
            className="rounded-lg bg-[#20c46b] px-3 py-2 text-xs text-white disabled:cursor-not-allowed"
          >
            Publish
          </button>
        </div>
      }
    >
      {filters && (
        <label className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          Candidate category
          <select
            aria-label="Spotlight category"
            value={selection.category}
            onChange={(event) => selection.setCategory(event.target.value)}
            className="rounded-lg border border-slate-200 p-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <option value="all">All candidates</option>
            <option value="expert">Experts</option>
            <option value="merchant">Merchants</option>
          </select>
        </label>
      )}
      <div className="grid min-w-0 gap-3 lg:grid-cols-[1.5fr_1fr]">
        {(['expert', 'merchant'] as const).map((category) => (
          <fieldset
            key={category}
            className="min-w-0 rounded-lg bg-[#f8f9f8] p-3"
          >
            <legend className="float-left mb-3 w-full text-xs font-medium">
              {category === 'expert' ? 'Experts' : 'Merchants'} of the week
            </legend>
            <div className="clear-both flex min-w-0 gap-2 overflow-x-auto pb-2">
              {selection.candidates
                .filter((item) => item.category === category)
                .map((item) => (
                  <label
                    key={item.id}
                    className="w-44 shrink-0 cursor-pointer rounded-lg border border-dashed border-slate-200 bg-white p-2 transition-colors focus-within:ring-2 focus-within:ring-emerald-600 hover:border-emerald-400 motion-reduce:transition-none"
                  >
                    <input
                      type="radio"
                      name={`spotlight-${category}`}
                      value={item.id}
                      checked={
                        (category === 'expert'
                          ? selection.expert
                          : selection.merchant) === item.id
                      }
                      onChange={() =>
                        category === 'expert'
                          ? selection.setExpert(item.id)
                          : selection.setMerchant(item.id)
                      }
                      aria-label={`Select ${item.name} ${item.id}`}
                      className="size-3 accent-emerald-500"
                    />
                    <p
                      className="mt-3 truncate text-xs font-medium"
                      title={item.name}
                    >
                      {item.name}
                    </p>
                    <p className="mt-3 truncate text-[10px] text-emerald-600">
                      @{item.username}{' '}
                      <Star className="inline size-3 fill-orange-400 text-orange-400" />{' '}
                      <span className="text-slate-700">{item.rating}</span>
                    </p>
                    <p className="mt-3 text-[10px] text-slate-950">
                      {item.completion}%{' '}
                      {category === 'expert' ? 'Job' : 'Order'} Completion
                    </p>
                  </label>
                ))}
              {selection.candidates.filter((item) => item.category === category)
                .length === 0 && (
                <p className="py-6 text-xs text-slate-500">
                  No candidates match your filters.
                </p>
              )}
            </div>
          </fieldset>
        ))}
      </div>
      <p role="note" className="mt-3 text-[10px] text-slate-500">
        Select only one expert and one merchant per week. Preview selections are
        local; publishing is unavailable.
      </p>
    </SettingsSection>
  );
}
