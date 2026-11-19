'use client';

import Link from 'next/link';
import { useId } from 'react';
import { LoaderCircle, RefreshCw } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { AccountMenu } from '@/features/auth/components/AccountMenu/AccountMenu';
import { useCurrentUserView } from '@/features/auth/hooks/useCurrentUserView/useCurrentUserView';
import { CurrentUserSkeleton } from '@/features/auth/components/CurrentUserSkeleton/CurrentUserSkeleton';
import { useCurrentUserStore } from '@/features/auth/hooks/useCurrentUserStore/useCurrentUserStore';

export function CurrentUserIdentity({
  placement,
}: {
  placement: 'header' | 'sidebar';
}) {
  const emailId = useId();
  const view = useCurrentUserView();
  const user = useCurrentUserStore((state) => state.user);
  if (view.pending || (!view.error && !user))
    return <CurrentUserSkeleton placement={placement} />;
  const initials =
    user?.fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || '—';
  const refresh = view.refreshing ? (
    <span role="status" aria-label="Refreshing profile">
      <LoaderCircle
        aria-hidden="true"
        className="size-3 animate-spin text-neutral-500"
      />
    </span>
  ) : view.error ? (
    <button
      type="button"
      onClick={view.retry}
      aria-label="Retry loading profile"
      title="Profile could not be refreshed. Try again."
      className="rounded p-1 text-neutral-600 focus-visible:outline-2 focus-visible:outline-emerald-600"
    >
      <RefreshCw aria-hidden="true" className="size-3" />
    </button>
  ) : null;
  if (placement === 'header')
    return (
      <div className="flex items-center gap-2">
        {refresh}
        <AccountMenu
          initials={initials}
          fullName={user?.fullName}
          email={user?.email}
          role={user?.role}
        />
      </div>
    );
  if (!user)
    return (
      <div
        role="alert"
        className="space-y-2 border-t border-neutral-100 pt-5 text-xs text-neutral-600"
      >
        <p>Unable to load your profile.</p>
        <button
          type="button"
          onClick={view.retry}
          disabled={view.refreshing}
          className="rounded text-emerald-700 underline focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          {view.refreshing ? 'Retrying' : 'Try again'}
        </button>
      </div>
    );
  return (
    <div className="border-t border-neutral-100 pt-5">
      <Link
        href={ROUTES.profile}
        aria-label="View profile"
        aria-describedby={emailId}
        className="flex min-w-0 items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-emerald-600"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#727987] text-xs text-white">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-neutral-800">{user.fullName}</p>
          <p className="mt-1 truncate text-[10px] text-neutral-500">
            {user.role}
          </p>
          <p
            className="mt-1 truncate text-[10px] text-neutral-500"
            title={user.email}
            id={emailId}
          >
            {user.email}
          </p>
        </div>
      </Link>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-500">
        {view.error && <span>Profile refresh unavailable</span>}
        {refresh}
      </div>
    </div>
  );
}
