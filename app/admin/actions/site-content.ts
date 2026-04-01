"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function upsertSiteContent(key: string, value: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "site_content")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/site-content/${encodeURIComponent(key)}`,
    method: "PUT",
    body: { value },
  });

  revalidatePath("/admin/site-content");
  revalidatePath("/", "layout");
}
