import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export function AuthTabs({ invitation = false }: { invitation?: boolean }) {
  return (
    <nav
      aria-label="Authentication"
      className="mb-10 inline-flex rounded-2xl bg-neutral-50 p-1 text-xs text-neutral-600"
    >
      <Link
        href="/login"
        aria-current={!invitation ? 'page' : undefined}
        className={cn(
          'rounded-xl px-4 py-2.5 focus-visible:outline-2 focus-visible:outline-emerald-600',
          !invitation && 'bg-white text-slate-950 shadow-xs',
        )}
      >
        Sign in
      </Link>
      <Link
        href="/accept-invite"
        aria-current={invitation ? 'page' : undefined}
        className={cn(
          'rounded-xl px-4 py-2.5 focus-visible:outline-2 focus-visible:outline-emerald-600',
          invitation && 'bg-white text-slate-950 shadow-xs',
        )}
      >
        Accept invite
      </Link>
    </nav>
  );
}
