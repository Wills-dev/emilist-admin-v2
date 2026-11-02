import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTicketDetail } from '@/features/support/fixtures/ticketDetailFixtures';
import { TicketDetails } from '@/features/support/components/TicketDetails/TicketDetails';
import { TicketDetailSkeleton } from '@/features/support/components/TicketDetailSkeleton/TicketDetailSkeleton';
export default async function Page({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const detail = getTicketDetail(ticketId);
  if (!detail) notFound();
  return (
    <Suspense fallback={<TicketDetailSkeleton />}>
      <TicketDetails detail={detail} />
    </Suspense>
  );
}
