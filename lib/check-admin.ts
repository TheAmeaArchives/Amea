import { fetchServerData } from "@/lib/backend/server-api";
import type { Permission } from "@/lib/types";
import type { AdminProfile } from "@/lib/types";

async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  return fetchServerData<AdminProfile>("/api/admin/current-admin/profile");
}

export async function checkIsAdmin(): Promise<boolean> {
  try {
    const profile = await getCurrentAdminProfile();
    return !!profile?.is_active;
  } catch {
    return false;
  }
}

export interface AdminPermissionCheck {
  isAdmin: boolean;
  canEditSiteContent: boolean;
}

export async function checkAdminPermissions(): Promise<AdminPermissionCheck> {
  try {
    const profile = await getCurrentAdminProfile();
    if (!profile?.is_active) return { isAdmin: false, canEditSiteContent: false };

    const permissions = (profile.permissions ?? []) as Permission[];
    const isSuperAdmin = profile.role === "super_admin";
    const canEditSiteContent = isSuperAdmin || permissions.includes("site_content");

    return {
      isAdmin: true,
      canEditSiteContent,
    };
  } catch {
    return { isAdmin: false, canEditSiteContent: false };
  }
}
