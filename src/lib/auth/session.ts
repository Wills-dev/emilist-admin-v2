import 'server-only';
import type { AdminSession } from './authorization';

// Integration port, not an authentication implementation. The backend adapter must
// validate HttpOnly cookies server-side and return only safe session metadata.
export interface SessionAdapter {
  getSession(): Promise<AdminSession | null>;
  logout(): Promise<void>;
}

export async function requirePermission(
  adapter: SessionAdapter,
  permission: string,
): Promise<AdminSession> {
  const { hasPermission } = await import('./authorization');
  const session = await adapter.getSession();
  if (!session) throw new Error('Unauthenticated');
  if (!hasPermission(session, permission)) throw new Error('Forbidden');
  return session;
}
