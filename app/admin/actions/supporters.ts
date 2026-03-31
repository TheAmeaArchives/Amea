"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createSupporter(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "supporters")) throw new Error("Unauthorized");

  await requestServerData({
    path: "/api/admin/supporters",
    method: "POST",
    body: {
      name: formData.get("name") as string,
      logo_url: (formData.get("logo_url") as string) || null,
      website_url: (formData.get("website_url") as string) || null,
      order_index: parseInt(formData.get("order_index") as string, 10) || 0,
    },
  });
  revalidatePath("/admin/supporters");
  revalidatePath("/team");
}

export async function updateSupporter(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "supporters")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/supporters/${encodeURIComponent(id)}`,
    method: "PATCH",
    body: {
      name: formData.get("name") as string,
      logo_url: (formData.get("logo_url") as string) || null,
      website_url: (formData.get("website_url") as string) || null,
      order_index: parseInt(formData.get("order_index") as string, 10) || 0,
    },
  });
  revalidatePath("/admin/supporters");
  revalidatePath("/team");
}

export async function deleteSupporter(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "supporters")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/supporters/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/supporters");
  revalidatePath("/team");
}
