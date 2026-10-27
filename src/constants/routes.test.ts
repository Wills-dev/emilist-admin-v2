import { expect, it } from 'vitest';
import { buildRoute, ROUTES } from './routes';
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
