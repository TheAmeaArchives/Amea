"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createProgram(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "programs")) throw new Error("Unauthorized");

  await requestServerData({
    path: "/api/admin/programs",
    method: "POST",
    body: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      icon_type: (formData.get("icon_type") as string) || null,
      featured: formData.get("featured") === "true",
      order_index: parseInt(formData.get("order_index") as string, 10) || 0,
    },
  });
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}

export async function updateProgram(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "programs")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/programs/${encodeURIComponent(id)}`,
    method: "PATCH",
    body: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      icon_type: (formData.get("icon_type") as string) || null,
      featured: formData.get("featured") === "true",
      order_index: parseInt(formData.get("order_index") as string, 10) || 0,
    },
  });
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}

export async function deleteProgram(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "programs")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/programs/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}
