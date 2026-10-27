import { LockKeyhole } from 'lucide-react';
import type { AuthAccount } from '@/features/auth/types/authTypes';

export function AuthAccountSummary({
  account,
  detailed = false,
}: {
  account?: AuthAccount;
  detailed?: boolean;
}) {
  if (detailed)
    return (
      <dl className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-100">
        {[
          ['Full Name', account?.fullName],
          ['Work Email', account?.email],
          ['Role', account?.role],
          ['Invited by', account?.invitedBy],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 px-4 py-3.5 text-xs"
          >
            <dt className="text-slate-500">{label}</dt>
            <dd className="flex min-w-0 items-center gap-2 text-right">
              <span className="break-all">
                {value || 'Awaiting invitation'}
              </span>
              <LockKeyhole
                aria-hidden="true"
                className="size-3 shrink-0 text-slate-500"
              />
            </dd>
          </div>
        ))}
      </dl>
    );
  return (
    <div className="mx-auto mb-7 flex w-fit max-w-full items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-600">
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
      >
        {account?.fullName
          ?.split(' ')
          .map((part) => part[0])
          .slice(0, 2)
          .join('') || '—'}
      </span>
      <span className="break-all">
        {account?.email || 'Account not connected'}
      </span>
      {account?.role && (
        <span className="ml-2 rounded bg-white px-1 text-[10px]">
          {account.role}
        </span>
      )}
    </div>
  );
}
