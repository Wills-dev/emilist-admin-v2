import { notFound } from 'next/navigation';
import { CustomerUserDetails } from '@/features/customers/components/CustomerUserDetails/CustomerUserDetails';
import { CUSTOMERS } from '@/features/customers/fixtures/customerFixtures';
export default async function Page({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const customer = CUSTOMERS.find((item) => item.id === customerId);
  if (!customer) notFound();
  return <CustomerUserDetails customer={customer} />;
}
