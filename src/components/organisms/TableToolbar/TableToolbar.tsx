'use client';
import { useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Search, SlidersHorizontal, UsersRound } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
export function TableToolbar({
  label,
  count,
  search,
  status,
  statuses,
  onSearch,
  onStatus,
  action,
  leading,
  icon: Icon = UsersRound,
  filterControls,
}: {
  label: string;
  count: string | number;
  search: string;
  status: string;
  statuses: readonly string[];
  onSearch: (value: string) => void;
  onStatus: (value: string) => void;
  action?: ReactNode;
  leading?: ReactNode;
  icon?: LucideIcon;
  filterControls?: ReactNode;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div className="bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {leading || (
          <h2 className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-emerald-600">
            <Icon aria-hidden="true" className="size-3.5" />
            {label.toUpperCase()}: {count}
          </h2>
        )}
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <button
            type="button"
            aria-label="Toggle status filter"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-100 text-slate-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
          >
            <SlidersHorizontal className="size-4" />
          </button>
          <div className="relative min-w-0 flex-1 sm:w-56">
            <Search
              aria-hidden="true"
              className="absolute top-3 left-2 size-3.5 text-slate-400"
            />
            <Input
              aria-label={`Search ${label.toLowerCase()}`}
              maxLength={200}
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search name, ID, email, username"
              className="h-9 rounded-lg border-slate-100 bg-white pl-7 text-[10px]"
            />
          </div>
          {action}
        </div>
      </div>
      {filterOpen && (
        <div className="flex flex-wrap gap-3 motion-safe:animate-[overview-enter_200ms_ease-out]">
          <label className="mt-3 flex items-center gap-3 text-xs text-slate-500">
            Status
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(event) => onStatus(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white p-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <option value="all">All statuses</option>
              {statuses.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          {filterControls}
        </div>
      )}
    </div>
  );
}
