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
