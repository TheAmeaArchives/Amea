import { fetchServerData } from "@/lib/backend/server-api";
import type { AdminInvite } from "@/lib/types";
import AcceptInviteClient from "./accept-invite-client";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await fetchServerData<AdminInvite>(
    `/api/admin/public/admin-invites/${encodeURIComponent(token)}`,
  );

  return <AcceptInviteClient invite={invite} token={token} />;
}
