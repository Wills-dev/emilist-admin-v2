import { expect, it } from 'vitest';
import { buildRoute, ROUTES, CUSTOMER_ROUTES } from './routes';
it('preserves the authentication entry points and encodes dynamic route segments', () => {
  expect(ROUTES.login).toBe('/login');
  expect(ROUTES.dashboard).toBe('/dashboard');
  expect(
    buildRoute('/records/:id/events/:eventId', {
      id: 'a/b',
      eventId: 'space here',
    }),
  ).toBe('/records/a%2Fb/events/space%20here');
  expect(() =>
    buildRoute('/records/:id', { id: undefined as unknown as string }),
  ).toThrow('Missing route parameter');
});

it('builds customer destinations from the selected ID and actual tab', () => {
  expect(CUSTOMER_ROUTES.details('a/b')).toBe('/customers/a%2Fb');
  expect(CUSTOMER_ROUTES.tab('612c54', 'listedItems')).toBe(
    '/customers/612c54/listed-items',
  );
  expect(CUSTOMER_ROUTES.tab('raisychen', 'details')).toBe(
    '/customers/raisychen',
  );
});

it('centralizes management section paths', () => {
  expect(ROUTES.jobs).toBe('/jobs');
  expect(ROUTES.materials).toBe('/materials');
  expect(ROUTES.materialOrders).toBe('/materials/orders');
});
