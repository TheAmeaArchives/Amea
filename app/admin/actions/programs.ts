"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createProgram(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "programs")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("programs").insert({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    icon_type: (formData.get("icon_type") as string) || null,
    featured: formData.get("featured") === "true",
    order_index: parseInt(formData.get("order_index") as string) || 0,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}

export async function updateProgram(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "programs")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("programs")
    .update({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      icon_type: (formData.get("icon_type") as string) || null,
      featured: formData.get("featured") === "true",
      order_index: parseInt(formData.get("order_index") as string) || 0,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}

export async function deleteProgram(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "programs")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}
