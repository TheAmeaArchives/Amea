"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createGalleryItem(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "gallery")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("gallery_items").insert({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    order_index: parseInt(formData.get("order_index") as string) || 0,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "gallery")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      order_index: parseInt(formData.get("order_index") as string) || 0,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryItem(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "gallery")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
