import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, isSuperAdmin } from "@/lib/admin";
import type { AdminProfile } from "@/lib/types";
import AdminsClient from "./admins-client";

export default async function AdminsPage() {
  const supabase = createClient();

  const [profile, { data }] = await Promise.all([
    getAdminProfile(),
    supabase.from("admin_profiles").select("*").order("created_at"),
  ]);

  if (!profile || !isSuperAdmin(profile)) {
    redirect("/admin");
  }

  return (
    <AdminsClient
      admins={(data as AdminProfile[]) ?? []}
      currentUserId={profile.id}
    />
  );
}
