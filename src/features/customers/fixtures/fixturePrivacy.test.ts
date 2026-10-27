import { expect, it } from 'vitest';
import { CUSTOMERS } from './customerFixtures';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
import { PAYMENTS } from '@/features/payments/fixtures/paymentFixtures';
import { SUPPORT_TICKETS } from '@/features/support/fixtures/supportFixtures';
import {
  SPOTLIGHT_CANDIDATES,
  ADMIN_ROLES,
} from '@/features/settings/fixtures/settingsFixtures';
it('exposes only fictional personas and non-deliverable contact details', () => {
  for (const customer of CUSTOMERS) {
    expect(customer.email).toMatch(/@example\.invalid$/);
    expect(customer.fullName || customer.username).toMatch(/Demo|demo|Sample/);
    if (customer.phone) expect(customer.phone).toMatch(/^DEMO-PHONE-/);
    if (customer.address) expect(customer.address).toContain('Fictional');
  }
  expect(OVERVIEW_FIXTURES.displayName).toBe('Demo Operator');
  for (const payment of PAYMENTS)
    expect(payment.counterparty).toMatch(/Demo|Sample|—/);
  for (const ticket of SUPPORT_TICKETS)
    expect(ticket.customer).toMatch(/Demo|Sample/);
  for (const candidate of SPOTLIGHT_CANDIDATES)
    expect(candidate.name).toMatch(/^Demo /);
  for (const role of ADMIN_ROLES)
    for (const name of role.users) expect(name).toMatch(/Demo|Sample/);
});
