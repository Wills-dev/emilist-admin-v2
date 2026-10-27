'use client';
import { useState } from 'react';
import { Search, SlidersHorizontal, UsersRound } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
export function CustomerTableToolbar({
  label,
  count,
  search,
  status,
  statuses,
  onSearch,
  onStatus,
  create = false,
}: {
  label: string;
  count: string | number;
  search: string;
  status: string;
  statuses: readonly string[];
  onSearch: (value: string) => void;
  onStatus: (value: string) => void;
  create?: boolean;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div className="bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-emerald-600">
          <UsersRound className="size-3.5" />
          {label.toUpperCase()}: {count}
        </h2>
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
          {create && (
            <button
              type="button"
              disabled
              title="Customer creation requires backend integration"
              className="h-9 rounded-lg bg-green-500 px-3 text-xs font-medium text-white disabled:cursor-not-allowed"
            >
              + Create new customer
            </button>
          )}
        </div>
      </div>
      {filterOpen && (
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
      )}
    </div>
  );
}
