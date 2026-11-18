import { InvitationScreen } from '@/features/auth/components/InvitationScreen/InvitationScreen';
import { parseInvitationLink } from '@/features/auth/lib/parseInvitationLink';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const link = parseInvitationLink(await searchParams);
  return <InvitationScreen link={link} />;
}
