"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

function cleanVideoUrl(input: string | null): string | null {
  if (!input || input.trim() === "") return null;
  
  const trimmed = input.trim();
  
  // If user pasted an iframe embed code, extract the src URL
  if (trimmed.includes("<iframe") && trimmed.includes("src=")) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/);
    if (srcMatch?.[1]) {
      return srcMatch[1];
    }
  }
  
  // If it's already a valid URL, return it
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return trimmed;
    }
  } catch {
    // Not a valid URL
  }
  
  return null;
}

export async function createGalleryItem(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "gallery")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("gallery_items").insert({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    video_url: cleanVideoUrl(formData.get("video_url") as string),
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
      video_url: cleanVideoUrl(formData.get("video_url") as string),
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

export async function setFeaturedGalleryItem(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "gallery")) throw new Error("Unauthorized");

  const supabase = createClient();
  
  // First, unset all featured items
  await supabase.from("gallery_items").update({ featured: false }).neq("id", "");
  
  // Then set the selected item as featured
  const { error } = await supabase
    .from("gallery_items")
    .update({ featured: true })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function unsetFeaturedGalleryItem(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "gallery")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({ featured: false })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
