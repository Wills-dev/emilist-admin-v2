import { AuthScreen } from '@/features/auth/components/AuthScreen/AuthScreen';
import { dashboardPreviewEnabled } from '@/lib/auth/dashboardPreview';
export default function Page() {
  return (
    <AuthScreen screen="login" previewEnabled={dashboardPreviewEnabled()} />
  );
}
