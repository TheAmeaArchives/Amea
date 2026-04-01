import { fetchServerData } from "@/lib/backend/server-api";
import type { MemberInvite } from "@/lib/types";
import AcceptMemberInviteClient from "./accept-member-invite-client";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await fetchServerData<MemberInvite>(
    `/api/admin/public/member-invites/${encodeURIComponent(token)}`,
  );

  return <AcceptMemberInviteClient invite={invite} token={token} />;
}
