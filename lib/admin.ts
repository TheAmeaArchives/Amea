import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { AdminProfile, Permission } from "@/lib/types";

export const getAdminProfile = cache(async (): Promise<AdminProfile | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as AdminProfile | null;
});

export function hasPermission(
  profile: AdminProfile | null,
  permission: Permission
): boolean {
  if (!profile || !profile.is_active) return false;
  if (profile.role === "super_admin") return true;
  return profile.permissions.includes(permission);
}

export function isSuperAdmin(profile: AdminProfile | null): boolean {
  return profile?.role === "super_admin" && profile?.is_active === true;
}
