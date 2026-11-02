import { notFound } from 'next/navigation';
import { getPayment } from '@/features/payments/fixtures/paymentFixtures';
import { TransactionDetails } from '@/features/payments/components/TransactionDetails/TransactionDetails';
export default async function Page({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;
  const payment = getPayment(paymentId);
  if (!payment) notFound();
  return <TransactionDetails payment={payment} />;
}
