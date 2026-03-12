"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function updateSiteContent(key: string, value: string) {
  const profile = await getAdminProfile();
  if (!profile || !hasPermission(profile, "site_content")) {
    throw new Error("Unauthorized");
  }

  const supabase = createClient();

  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("key", key)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("site_content")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("site_content")
      .insert({ key, value });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  
  return { success: true };
}
