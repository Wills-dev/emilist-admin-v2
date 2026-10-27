export const ROUTES = {
  home: '/',
  login: '/login',
  loginVerify: '/login/verify',
  acceptInvite: '/accept-invite',
  invitePassword: '/accept-invite/password',
  inviteAuthenticator: '/accept-invite/authenticator',
  forgotPassword: '/forgot-password',
  resetLinkStatus: '/forgot-password/sent',
  resetVerify: '/reset-password/verify',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  customers: '/customers',
  jobs: '/jobs',
  materials: '/materials',
  materialOrders: '/materials/orders',
  forbidden: '/forbidden',
  unauthorized: '/unauthorized',
} as const;
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

type ParamNames<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ParamNames<Rest>
    : Path extends `${string}:${infer Param}`
      ? Param
      : never;
// Encodes individual segments; callers retain semantic ownership of route patterns.
export function buildRoute<const Pattern extends string>(
  pattern: Pattern,
  params: Record<ParamNames<Pattern>, string | number>,
): string {
  return pattern.replace(/:([A-Za-z][A-Za-z0-9_]*)/g, (_, key: string) => {
    const value = (params as Readonly<Record<string, string | number>>)[key];
    if (value === undefined) throw new Error(`Missing route parameter: ${key}`);
    return encodeURIComponent(String(value));
  });
}

export const CUSTOMER_TAB_PATHS = {
  details: '',
  services: 'services',
  jobs: 'jobs',
  listedItems: 'listed-items',
  orders: 'orders',
  sales: 'sales',
  transactions: 'transactions',
  subscriptions: 'subscriptions',
} as const;
export type CustomerTab = keyof typeof CUSTOMER_TAB_PATHS;
export const CUSTOMER_ROUTES = {
  details: (customerId: string) =>
    buildRoute(`${ROUTES.customers}/:customerId`, { customerId }),
  tab: (customerId: string, tab: CustomerTab) => {
    const root = buildRoute(`${ROUTES.customers}/:customerId`, { customerId });
    return CUSTOMER_TAB_PATHS[tab]
      ? `${root}/${CUSTOMER_TAB_PATHS[tab]}`
      : root;
  },
};
