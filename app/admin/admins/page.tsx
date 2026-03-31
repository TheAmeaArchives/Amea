import { redirect } from "next/navigation";
import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, isSuperAdmin } from "@/lib/admin";
import type { AdminInvite, AdminProfile } from "@/lib/types";
import AdminsClient from "./admins-client";

export default async function AdminsPage() {
  const [profile, admins, invites] = await Promise.all([
    getAdminProfile(),
    fetchServerData<AdminProfile[]>("/api/admin/admin-profiles"),
    fetchServerData<AdminInvite[]>("/api/admin/admin-invites"),
  ]);

  if (!profile || !isSuperAdmin(profile)) {
    redirect("/admin");
  }

  return (
    <AdminsClient
      admins={admins ?? []}
      invites={invites ?? []}
      currentUserId={profile.id}
    />
  );
}
