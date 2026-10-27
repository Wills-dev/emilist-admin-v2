import { connection } from 'next/server';
import { AuthScreen } from '@/features/auth/components/AuthScreen/AuthScreen';
import { dashboardAccess } from '@/lib/auth/dashboardPreview';
export default async function Page() {
  await connection();
  const access = await dashboardAccess();
  return (
    <AuthScreen
      screen="login"
      previewEnabled={access !== 'denied'}
      demoMode={access === 'demo'}
    />
  );
}
