"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createTeamMember(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  await requestServerData({
    path: "/api/admin/team-members",
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
    path: `/api/admin/team-members/${encodeURIComponent(id)}`,
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
    path: `/api/admin/team-members/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function createContributor(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  await requestServerData({
    path: "/api/admin/contributors",
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
    path: `/api/admin/contributors/${encodeURIComponent(id)}`,
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
    path: `/api/admin/contributors/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/team");
  revalidatePath("/contributors");
}

export async function createMemberInvite(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  await requestServerData({
    path: "/api/admin/member-invites",
    method: "POST",
    body: {
      email: formData.get("email") as string,
      full_name: formData.get("full_name") as string,
      role: formData.get("role") as string,
      member_type: (formData.get("member_type") as string) || "team",
      expires_in_days: parseInt((formData.get("expires_in_days") as string) || "7", 10) || 7,
    },
  });

  revalidatePath("/admin/team");
}

export async function revokeMemberInvite(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/member-invites/${encodeURIComponent(id)}/revoke`,
    method: "POST",
  });

  revalidatePath("/admin/team");
}
