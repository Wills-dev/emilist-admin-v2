'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JOB_ROUTES, type JobTab } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';
const tabs: readonly { key: JobTab; label: string }[] = [
  { key: 'details', label: 'Job Details' },
  { key: 'applicants', label: 'Applicants' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'payments', label: 'Payments' },
];
export function JobTabs({ jobId }: { jobId: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Job sections"
      className="max-w-full min-w-0 overflow-x-auto"
    >
      <div className="flex w-max items-center rounded-full bg-neutral-50 p-1">
        {tabs.map((tab) => {
          const href = JOB_ROUTES.tab(jobId, tab.key);
          return (
            <Link
              key={tab.key}
              href={href}
              scroll={false}
              aria-current={pathname === href ? 'page' : undefined}
              className={cn(
                'shrink-0 rounded-full px-3 py-2.5 text-[10px] text-neutral-500 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none',
                pathname === href && 'bg-white text-slate-950 shadow-xs',
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
