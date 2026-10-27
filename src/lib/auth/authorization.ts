// Permissions and roles must be mapped from the confirmed backend contract.
export interface AdminSession {
  userId: string;
  permissions: readonly string[];
  expiresAt: string;
}

export function hasPermission(
  session: AdminSession | null,
  permission: string,
  now = Date.now(),
): boolean {
  if (!session || !permission) return false;
  const expiry = Date.parse(session.expiresAt);
  return (
    Number.isFinite(expiry) &&
    expiry > now &&
    session.permissions.includes(permission)
  );
}

export function hasEveryPermission(
  session: AdminSession | null,
  permissions: readonly string[],
  now = Date.now(),
): boolean {
  return (
    session !== null &&
    Number.isFinite(Date.parse(session.expiresAt)) &&
    Date.parse(session.expiresAt) > now &&
    permissions.every((permission) => hasPermission(session, permission, now))
  );
}
