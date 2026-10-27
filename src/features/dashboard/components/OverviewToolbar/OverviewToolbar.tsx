'use client';
import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
export function OverviewToolbar() {
  const [range, setRange] = useState('30');
  return (
    <section className="overview-enter flex flex-wrap items-end justify-between gap-4 bg-white p-3 xl:p-4">
      <div>
        <p className="flex flex-wrap items-center gap-1.5 text-[10px] leading-none font-medium tracking-widest text-[#00ad59]">
          <LayoutDashboard className="size-3" />
          OVERVIEW
          <span
            role="note"
            className="font-normal tracking-normal text-[#788096]"
          >
            Static UI preview · Synthetic presentation data
          </span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl leading-tight font-semibold tracking-tight text-[#0c1710]">
            Welcome, Admin
          </h1>
          <span className="rounded bg-neutral-50 px-1.5 py-1 text-xs text-[#3f4943]">
            ID:{' '}
            <span className="text-[#00ad59]">{OVERVIEW_FIXTURES.adminId}</span>
          </span>
        </div>
        <p className="mt-2 text-xs text-[#788096]">
          Take a look at the operational numbers that need attention today
        </p>
      </div>
      <label className="text-xs text-[#576079]">
        <span className="sr-only">Date range</span>
        <select
          value={range}
          onChange={(event) => setRange(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-neutral-50 px-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 motion-reduce:transition-none"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <span className="sr-only">
          Presentation data does not change with date selection.
        </span>
      </label>
    </section>
  );
}
