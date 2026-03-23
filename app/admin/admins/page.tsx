import { redirect } from "next/navigation";
import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, isSuperAdmin } from "@/lib/admin";
import type { AdminProfile } from "@/lib/types";
import AdminsClient from "./admins-client";

export default async function AdminsPage() {
  const [profile, data] = await Promise.all([
    getAdminProfile(),
    fetchServerData<AdminProfile[]>("/api/v1/admin/admin-profiles"),
  ]);

  if (!profile || !isSuperAdmin(profile)) {
    redirect("/admin");
  }

  return (
    <AdminsClient
      admins={data ?? []}
      currentUserId={profile.id}
    />
  );
}
