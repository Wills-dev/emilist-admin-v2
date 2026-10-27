'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
export function MaterialsTabs() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Materials sections"
      className="flex gap-1 rounded-full bg-[#f8f9f8] p-1"
    >
      {[
        { label: 'Product Catalog', href: ROUTES.materials },
        { label: 'Orders', href: ROUTES.materialOrders },
      ].map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={pathname === tab.href ? 'page' : undefined}
          className={`rounded-full px-3 py-2 text-[10px] transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none ${pathname === tab.href ? 'bg-white text-slate-950 ring-1 ring-slate-100' : 'text-[#7a827c]'}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
