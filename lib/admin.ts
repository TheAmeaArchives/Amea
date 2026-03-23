import { cache } from "react";
import { fetchServerData } from "@/lib/backend/server-api";
import type { AdminProfile, Permission } from "@/lib/types";

export const getAdminProfile = cache(async (): Promise<AdminProfile | null> => {
  return fetchServerData<AdminProfile>("/api/v1/admin/current-admin/profile");
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
