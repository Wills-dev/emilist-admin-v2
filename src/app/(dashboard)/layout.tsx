import { connection } from 'next/server';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { dashboardAccess } from '@/lib/auth/dashboardPreview';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
import { ROUTES } from '@/constants/routes';
// The preview never establishes a session. No protected backend data or actions
// may be added here until real server authentication replaces this static-preview gate.
export default async function Layout({ children }: { children: ReactNode }) {
  await connection();
  const access = await dashboardAccess();
  if (access === 'denied') redirect(ROUTES.login);
  return (
    <DashboardLayout
      demoMode={access === 'demo'}
      date={OVERVIEW_FIXTURES.date}
      profile={OVERVIEW_FIXTURES}
    >
      {children}
    </DashboardLayout>
  );
}
