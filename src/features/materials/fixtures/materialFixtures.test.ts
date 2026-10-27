import { expect, it } from 'vitest';
import { MATERIAL_PRODUCTS, MATERIAL_ORDERS } from './materialFixtures';
import { CUSTOMERS } from '@/features/customers/fixtures/customerFixtures';
it('keeps product and order identities separate and preserves reference values', () => {
  expect(new Set(MATERIAL_PRODUCTS.map((row) => row.id)).size).toBe(
    MATERIAL_PRODUCTS.length,
  );
  expect(new Set(MATERIAL_ORDERS.map((row) => row.id)).size).toBe(
    MATERIAL_ORDERS.length,
  );
  for (const order of MATERIAL_ORDERS) {
    expect(CUSTOMERS.some((customer) => customer.id === order.buyerId)).toBe(
      true,
    );
    expect(
      CUSTOMERS.some((customer) => customer.id === order.product.customerId),
    ).toBe(true);
    expect(order.price).toBe(order.product.price);
  }
  expect(
    MATERIAL_PRODUCTS.find((row) => row.name === 'GP Water Tank')?.status,
  ).toBe('Out of Stock');
  expect(
    MATERIAL_ORDERS.filter(
      (row) => row.delivery === 'Returned' && row.payment === 'Pending',
    ),
  ).toHaveLength(2);
});
