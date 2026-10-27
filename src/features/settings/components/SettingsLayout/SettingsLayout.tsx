'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
export function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="space-y-4">
      <h1 className="sr-only">Settings</h1>
      <nav
        aria-label="Settings sections"
        className="flex flex-wrap gap-1 bg-white p-3"
      >
        {[
          { name: 'Platform Configuration', href: ROUTES.settings },
          { name: 'User Permissions', href: ROUTES.settingsPermissions },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={pathname === tab.href ? 'page' : undefined}
            className={`rounded-full px-3 py-2 text-[10px] transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none ${pathname === tab.href ? 'bg-white text-slate-950 ring-1 ring-slate-100' : 'bg-neutral-50 text-neutral-500'}`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
