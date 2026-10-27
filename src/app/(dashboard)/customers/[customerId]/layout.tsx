import { notFound } from 'next/navigation';
import { CustomerDetailsLayout } from '@/features/customers/components/CustomerDetailsLayout/CustomerDetailsLayout';
import { CUSTOMERS } from '@/features/customers/fixtures/customerFixtures';
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const customer = CUSTOMERS.find((item) => item.id === customerId);
  if (!customer) notFound();
  return (
    <CustomerDetailsLayout customer={customer}>
      {children}
    </CustomerDetailsLayout>
  );
}
