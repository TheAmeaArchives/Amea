"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, isSuperAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import type { Permission } from "@/lib/types";

export async function createAdmin(formData: FormData) {
  const profile = await getAdminProfile();
  if (!isSuperAdmin(profile)) throw new Error("Unauthorized");

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;
  const permissionsRaw = formData.get("permissions") as string;
  const permissions: Permission[] = permissionsRaw ? JSON.parse(permissionsRaw) : [];

  const adminClient = createAdminClient();

  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) throw new Error(authError.message);

  const supabase = createClient();
  const { error: profileError } = await supabase.from("admin_profiles").insert({
    id: authData.user.id,
    email,
    full_name: fullName,
    role,
    permissions,
  });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(authData.user.id);
    throw new Error(profileError.message);
  }

  revalidatePath("/admin/admins");
}

export async function updateAdmin(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!isSuperAdmin(profile)) throw new Error("Unauthorized");

  const supabase = createClient();
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;
  const permissionsRaw = formData.get("permissions") as string;
  const permissions: Permission[] = permissionsRaw ? JSON.parse(permissionsRaw) : [];
  const isActive = formData.get("is_active") === "true";

  const { error } = await supabase
    .from("admin_profiles")
    .update({
      full_name: fullName,
      role,
      permissions,
      is_active: isActive,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/admins");
}

export async function toggleAdminActive(id: string, isActive: boolean) {
  const profile = await getAdminProfile();
  if (!isSuperAdmin(profile)) throw new Error("Unauthorized");

  if (id === profile!.id) throw new Error("Cannot deactivate yourself");

  const supabase = createClient();
  const { error } = await supabase
    .from("admin_profiles")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/admins");
}
