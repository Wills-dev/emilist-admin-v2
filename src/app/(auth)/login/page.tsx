import { connection } from 'next/server';
import { AuthScreen } from '@/features/auth/components/AuthScreen/AuthScreen';
export default async function Page() {
  await connection();
  return <AuthScreen screen="login" previewEnabled demoMode />;
}
