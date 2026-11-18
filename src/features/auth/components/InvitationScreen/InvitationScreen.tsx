import { AuthLayout } from '@/features/auth/components/AuthLayout/AuthLayout';
import { AuthTabs } from '@/features/auth/components/AuthTabs/AuthTabs';
import { AcceptInviteFlow } from '@/features/auth/components/AcceptInviteFlow/AcceptInviteFlow';
import type { InvitationLink } from '@/features/auth/lib/parseInvitationLink';

export function InvitationScreen({ link }: { link: InvitationLink }) {
  return (
    <AuthLayout variant="signup">
      <AuthTabs invitation />
      <AcceptInviteFlow
        key={link.invalidToken ? 'invalid' : (link.token ?? 'resume')}
        link={link}
      />
    </AuthLayout>
  );
}
