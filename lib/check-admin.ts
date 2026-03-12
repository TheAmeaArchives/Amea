import { createClient } from "@/lib/supabase/server";

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
