"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createExperiment(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "experiments")) throw new Error("Unauthorized");

  await requestServerData({
    path: "/api/admin/experiments",
    method: "POST",
    body: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || null,
      content: formData.get("content") ? JSON.parse(formData.get("content") as string) : null,
      image_url: (formData.get("image_url") as string) || null,
      curator: (formData.get("curator") as string) || null,
      editor: (formData.get("editor") as string) || null,
      chamber: (formData.get("chamber") as string) || "i",
      published: formData.get("published") === "true",
    },
  });
  revalidatePath("/admin/experiments");
  revalidatePath("/chambers/i");
}

export async function updateExperiment(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "experiments")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/experiments/${encodeURIComponent(id)}`,
    method: "PATCH",
    body: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || null,
      content: formData.get("content") ? JSON.parse(formData.get("content") as string) : null,
      image_url: (formData.get("image_url") as string) || null,
      curator: (formData.get("curator") as string) || null,
      editor: (formData.get("editor") as string) || null,
      chamber: (formData.get("chamber") as string) || "i",
      published: formData.get("published") === "true",
    },
  });
  revalidatePath("/admin/experiments");
  revalidatePath("/chambers/i");
}

export async function deleteExperiment(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "experiments")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/experiments/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/experiments");
  revalidatePath("/chambers/i");
}

export async function toggleExperimentPublished(id: string, published: boolean) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "experiments")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/experiments/${encodeURIComponent(id)}/published`,
    method: "PATCH",
    body: { published },
  });
  revalidatePath("/admin/experiments");
  revalidatePath("/chambers/i");
}
