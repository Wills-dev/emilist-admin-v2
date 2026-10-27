'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CUSTOMER_ROUTES } from '@/constants/routes';
import { CUSTOMER_TABS } from '@/features/customers/constants/customerTabs';
import { cn } from '@/lib/utils/cn';
export function CustomerTabs({ customerId }: { customerId: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Customer profile sections"
      className="min-w-0 overflow-x-auto bg-white p-4"
    >
      <div className="flex w-max max-w-none items-center rounded-2xl bg-neutral-50 p-1">
        {CUSTOMER_TABS.map((tab) => {
          const href = CUSTOMER_ROUTES.tab(customerId, tab.key);
          return (
            <Link
              key={tab.key}
              href={href}
              scroll={false}
              aria-current={pathname === href ? 'page' : undefined}
              className={cn(
                'shrink-0 rounded-xl px-3 py-2.5 text-[10px] text-neutral-500 transition-colors duration-150 hover:bg-white focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none',
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
