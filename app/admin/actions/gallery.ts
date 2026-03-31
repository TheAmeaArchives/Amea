"use server";

import { requestServerData } from "@/lib/backend/server-api";
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

  await requestServerData({
    path: "/api/admin/gallery-items",
    method: "POST",
    body: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      video_url: cleanVideoUrl(formData.get("video_url") as string),
      order_index: parseInt(formData.get("order_index") as string, 10) || 0,
    },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "gallery")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/gallery-items/${encodeURIComponent(id)}`,
    method: "PATCH",
    body: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      video_url: cleanVideoUrl(formData.get("video_url") as string),
      order_index: parseInt(formData.get("order_index") as string, 10) || 0,
    },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryItem(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "gallery")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/gallery-items/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function setFeaturedGalleryItem(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "gallery")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/gallery-items/${encodeURIComponent(id)}/featured`,
    method: "PATCH",
    body: { featured: true },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function unsetFeaturedGalleryItem(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "gallery")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/gallery-items/${encodeURIComponent(id)}/featured`,
    method: "DELETE",
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
