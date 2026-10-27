import type { Customer } from '@/features/customers/types/customerTypes';
export { formatNaira } from '@/lib/format/formatNaira';
export function customerName(customer: Customer) {
  return customer.fullName || customer.username;
}
export { filterFixtureRows, fixturePage } from '@/lib/table/fixtureRows';
export { statusTone } from '@/lib/table/statusTone';
