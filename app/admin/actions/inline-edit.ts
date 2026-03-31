"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function updateSiteContent(key: string, value: string) {
  const profile = await getAdminProfile();
  if (!profile || !hasPermission(profile, "site_content")) {
    throw new Error("Unauthorized");
  }

  await requestServerData({
    path: `/api/admin/site-content/${encodeURIComponent(key)}`,
    method: "PUT",
    body: { value },
  });

  revalidatePath("/", "layout");
  
  return { success: true };
}
