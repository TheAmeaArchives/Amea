"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, isSuperAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import type { Permission } from "@/lib/types";

export async function createAdmin(formData: FormData) {
  const profile = await getAdminProfile();
  if (!isSuperAdmin(profile)) throw new Error("Unauthorized");

  const email = formData.get("email") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as "admin" | "super_admin";
  const permissionsRaw = formData.get("permissions") as string;
  const permissions: Permission[] = permissionsRaw ? JSON.parse(permissionsRaw) : [];

  await requestServerData({
    path: "/api/admin/admin-profiles",
    method: "POST",
    body: {
      email,
      full_name: fullName,
      role,
      permissions: role === "super_admin" ? [] : permissions,
      is_active: true,
    },
  });

  revalidatePath("/admin/admins");
}

export async function updateAdmin(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!isSuperAdmin(profile)) throw new Error("Unauthorized");

  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as "admin" | "super_admin";
  const permissionsRaw = formData.get("permissions") as string;
  const permissions: Permission[] = permissionsRaw ? JSON.parse(permissionsRaw) : [];
  const isActive = formData.get("is_active") === "true";

  await requestServerData({
    path: `/api/admin/admin-profiles/${encodeURIComponent(id)}`,
    method: "PATCH",
    body: {
      full_name: fullName,
      role,
      permissions: role === "super_admin" ? [] : permissions,
      is_active: isActive,
    },
  });
  revalidatePath("/admin/admins");
}

export async function toggleAdminActive(id: string, isActive: boolean) {
  const profile = await getAdminProfile();
  if (!isSuperAdmin(profile)) throw new Error("Unauthorized");

  if (id === profile!.id) throw new Error("Cannot deactivate yourself");

  await requestServerData({
    path: `/api/admin/admin-profiles/${encodeURIComponent(id)}/active`,
    method: "PATCH",
    body: { is_active: isActive },
  });
  revalidatePath("/admin/admins");
}
