'use client';
import { useState } from 'react';
import { Search, UsersRound } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
export function QuickSearch() {
  const [search, setSearch] = useState('');
  return (
    <section
      aria-label="Quick Search"
      className="overview-card rounded-lg bg-white p-2.5 xl:p-3"
    >
      <h2 className="flex items-center gap-2 text-xs font-medium text-[#343b36]">
        <UsersRound className="size-3.5" />
        Quick Search
      </h2>
      <p className="mt-2 text-xs text-[#788096]">Find customers quickly</p>
      <form
        role="search"
        className="relative mt-2 xl:mt-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 left-2 size-3.5 text-slate-500"
        />
        <Input
          aria-label="Search customers"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, ID, email, username"
          className="h-8 rounded-lg border-slate-200 bg-white pr-2 pl-7 text-[10px]"
        />
      </form>
      {search && (
        <p role="status" className="mt-2 text-[10px] leading-4 text-slate-500">
          Customer search requires a connected service.
        </p>
      )}
    </section>
  );
}
