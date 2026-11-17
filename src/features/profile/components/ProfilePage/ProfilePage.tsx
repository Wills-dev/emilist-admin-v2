import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, UserRound, ImageOff } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { PROFILE_FIXTURES } from '@/features/profile/fixtures/profileFixtures';
import { ProfileActivity } from '@/features/profile/components/ProfileActivity/ProfileActivity';
export function ProfilePage({ inviteAction }: { inviteAction: ReactNode }) {
  const profile = PROFILE_FIXTURES;
  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap justify-between gap-3">
        <Link
          href={ROUTES.dashboard}
          className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs text-neutral-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>
        {inviteAction}
      </div>
      <header className="bg-white p-4">
        <h1 className="flex items-center gap-2 text-[10px] tracking-widest text-emerald-600">
          <UserRound className="size-3.5" />
          ADMIN PROFILE
        </h1>
        <p className="mt-3 text-xs text-[#788096]">
          Your personal information and activity trail
        </p>
        <p role="note" className="mt-2 text-[10px] text-slate-400">
          Synthetic demo persona · not an authenticated administrator
        </p>
      </header>
      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section
          aria-label="Profile information"
          className="min-w-0 space-y-4 rounded-xl bg-white p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-600">
                {profile.initials}
              </span>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {profile.displayName}
                </h2>
                <p className="mt-2 text-[10px] text-neutral-500">
                  {profile.jobTitle}
                </p>
              </div>
            </div>
            <StatusBadge tone="success">{profile.role}</StatusBadge>
          </div>
          <div
            role="img"
            aria-label="Profile portrait not supplied"
            className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-center text-neutral-400"
          >
            <div>
              <ImageOff className="mx-auto size-8" />
              <p className="mt-3 text-[10px]">Profile portrait not supplied</p>
            </div>
          </div>
          <dl className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Job Title', value: profile.jobTitle },
              { label: 'Department', value: profile.department },
              { label: 'Admin Role', value: profile.role },
              { label: 'Email Address', value: profile.email },
              { label: 'Last Login Time', value: profile.lastLogin },
              { label: 'Last Login Location', value: profile.location },
              { label: 'Admin Status', value: profile.accountStatus },
              { label: 'Online Status', value: profile.onlineStatus },
            ].map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-xl border border-slate-100 p-3"
              >
                <dt className="text-[9px] text-[#788096]">{item.label}</dt>
                <dd className="mt-2 text-[10px] font-semibold break-words text-slate-900">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <ProfileActivity />
      </div>
    </div>
  );
}
