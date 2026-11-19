import { AccountMenu } from '@/features/auth/components/AccountMenu/AccountMenu';
import { SignOutDialog } from '@/features/auth/components/SignOutDialog/SignOutDialog';
import { connection } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/features/auth/server/adminSessionResponse';
import { CurrentUserBoundary } from '@/features/auth/components/CurrentUserBoundary/CurrentUserBoundary';
import { getDashboardDate } from '@/lib/date/getDashboardDate';
import { CurrentUserBadge } from '@/features/auth/components/CurrentUserBadge/CurrentUserBadge';
import { CurrentUserIdentity } from '@/features/auth/components/CurrentUserIdentity/CurrentUserIdentity';
import type { ReactNode } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
// Public synthetic UI preview. Private data and backend actions require real authentication.
export default async function Layout({ children }: { children: ReactNode }) {
  await connection();
  const cookieStore = await cookies();
  // Presence enables validation; it never establishes identity or permissions.
  const hasSessionCookie = !!cookieStore.get(SESSION_COOKIE)?.value;
  return (
    <CurrentUserBoundary enabled={hasSessionCookie}>
      <DashboardLayout
        accountMenu={
          hasSessionCookie ? (
            <CurrentUserIdentity placement="header" />
          ) : (
            <AccountMenu initials={OVERVIEW_FIXTURES.initials} />
          )
        }
        sidebarProfile={
          hasSessionCookie ? (
            <CurrentUserIdentity placement="sidebar" />
          ) : undefined
        }
        signOutAction={<SignOutDialog />}
        statusBadge={hasSessionCookie ? <CurrentUserBadge /> : undefined}
        demoMode
        date={getDashboardDate()}
        profile={OVERVIEW_FIXTURES}
      >
        {children}
      </DashboardLayout>
    </CurrentUserBoundary>
  );
}
