import { AccountMenu } from '@/features/auth/components/AccountMenu/AccountMenu';
import { SignOutDialog } from '@/features/auth/components/SignOutDialog/SignOutDialog';
import { connection } from 'next/server';
import type { ReactNode } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
// Public synthetic UI preview. Private data and backend actions require real authentication.
export default async function Layout({ children }: { children: ReactNode }) {
  await connection();
  return (
    <DashboardLayout
      accountMenu={<AccountMenu initials={OVERVIEW_FIXTURES.initials} />}
      signOutAction={<SignOutDialog />}
      demoMode
      date={OVERVIEW_FIXTURES.date}
      profile={OVERVIEW_FIXTURES}
    >
      {children}
    </DashboardLayout>
  );
}
