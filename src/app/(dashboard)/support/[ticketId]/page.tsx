import { Suspense } from 'react';
import { TicketDetails } from '@/features/support/components/TicketDetails/TicketDetails';
import { TicketDetailSkeleton } from '@/features/support/components/TicketDetailSkeleton/TicketDetailSkeleton';
export default async function Page({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  return (
    <Suspense fallback={<TicketDetailSkeleton />}>
      <TicketDetails ticketId={ticketId} />
    </Suspense>
  );
}
