import { Suspense } from 'react';
import { ProfilePage } from '@/features/profile/components/ProfilePage/ProfilePage';
import { ProfileSkeleton } from '@/features/profile/components/ProfileSkeleton/ProfileSkeleton';
import { InviteAdminDialog } from '@/features/settings/components/InviteAdminDialog/InviteAdminDialog';
export default function Page() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePage inviteAction={<InviteAdminDialog />} />
    </Suspense>
  );
}
