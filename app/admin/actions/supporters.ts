"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createSupporter(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "supporters")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("supporters").insert({
    name: formData.get("name") as string,
    logo_url: (formData.get("logo_url") as string) || null,
    website_url: (formData.get("website_url") as string) || null,
    order_index: parseInt(formData.get("order_index") as string) || 0,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/supporters");
  revalidatePath("/team");
}

export async function updateSupporter(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "supporters")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("supporters")
    .update({
      name: formData.get("name") as string,
      logo_url: (formData.get("logo_url") as string) || null,
      website_url: (formData.get("website_url") as string) || null,
      order_index: parseInt(formData.get("order_index") as string) || 0,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/supporters");
  revalidatePath("/team");
}

export async function deleteSupporter(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "supporters")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("supporters").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/supporters");
  revalidatePath("/team");
}
