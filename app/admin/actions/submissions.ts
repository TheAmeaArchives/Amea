"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function markContactRead(id: string, read: boolean) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "contacts")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ read })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/contacts");
}

export async function deleteContact(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "contacts")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/contacts");
}

export async function updateVolunteerStatus(id: string, status: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "volunteers")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("volunteer_submissions")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/volunteers");
}

export async function deleteVolunteer(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "volunteers")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("volunteer_submissions")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/volunteers");
}
