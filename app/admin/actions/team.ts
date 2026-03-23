"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createTeamMember(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  await requestServerData({
    path: "/api/v1/admin/team-members",
    method: "POST",
    body: {
      name: formData.get("name") as string,
      role: (formData.get("role") as string) || null,
      bio: (formData.get("bio") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      member_type: formData.get("member_type") as string,
      order_index: parseInt(formData.get("order_index") as string, 10) || 0,
    },
  });
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function updateTeamMember(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/v1/admin/team-members/${encodeURIComponent(id)}`,
    method: "PATCH",
    body: {
      name: formData.get("name") as string,
      role: (formData.get("role") as string) || null,
      bio: (formData.get("bio") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      member_type: formData.get("member_type") as string,
      order_index: parseInt(formData.get("order_index") as string, 10) || 0,
    },
  });
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function deleteTeamMember(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/v1/admin/team-members/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function createContributor(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  await requestServerData({
    path: "/api/v1/admin/contributors",
    method: "POST",
    body: {
      name: formData.get("name") as string,
      location: (formData.get("location") as string) || null,
      bio: (formData.get("bio") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
    },
  });
  revalidatePath("/admin/team");
  revalidatePath("/contributors");
}

export async function updateContributor(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/v1/admin/contributors/${encodeURIComponent(id)}`,
    method: "PATCH",
    body: {
      name: formData.get("name") as string,
      location: (formData.get("location") as string) || null,
      bio: (formData.get("bio") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
    },
  });
  revalidatePath("/admin/team");
  revalidatePath("/contributors");
}

export async function deleteContributor(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/v1/admin/contributors/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/team");
  revalidatePath("/contributors");
}
