"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createTeamMember(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("team_members").insert({
    name: formData.get("name") as string,
    role: (formData.get("role") as string) || null,
    bio: (formData.get("bio") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    member_type: formData.get("member_type") as string,
    order_index: parseInt(formData.get("order_index") as string) || 0,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function updateTeamMember(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("team_members")
    .update({
      name: formData.get("name") as string,
      role: (formData.get("role") as string) || null,
      bio: (formData.get("bio") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      member_type: formData.get("member_type") as string,
      order_index: parseInt(formData.get("order_index") as string) || 0,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function deleteTeamMember(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function createContributor(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("contributors").insert({
    name: formData.get("name") as string,
    location: (formData.get("location") as string) || null,
    bio: (formData.get("bio") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
  revalidatePath("/contributors");
}

export async function updateContributor(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("contributors")
    .update({
      name: formData.get("name") as string,
      location: (formData.get("location") as string) || null,
      bio: (formData.get("bio") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
  revalidatePath("/contributors");
}

export async function deleteContributor(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "team")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("contributors").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
  revalidatePath("/contributors");
}
