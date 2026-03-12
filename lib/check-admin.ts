import { createClient } from "@/lib/supabase/server";
import type { Permission } from "@/lib/types";

export async function checkIsAdmin(): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("id, is_active")
      .eq("id", user.id)
      .eq("is_active", true)
      .single();
    
    return !!profile;
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
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { isAdmin: false, canEditSiteContent: false };
    
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("id, is_active, role, permissions")
      .eq("id", user.id)
      .eq("is_active", true)
      .single();
    
    if (!profile) return { isAdmin: false, canEditSiteContent: false };
    
    const permissions = (profile.permissions || []) as Permission[];
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
