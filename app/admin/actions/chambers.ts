"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function upsertChamberStat(id: string | null, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "chambers")) throw new Error("Unauthorized");

  const supabase = createClient();
  const data = {
    label: formData.get("label") as string,
    value: formData.get("value") as string,
    chamber: "ii",
    order_index: parseInt(formData.get("order_index") as string) || 0,
  };

  if (id) {
    const { error } = await supabase.from("chamber_stats").update(data).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("chamber_stats").insert(data);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/chambers");
  revalidatePath("/chambers/ii");
}

export async function deleteChamberStat(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "chambers")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("chamber_stats").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/chambers");
  revalidatePath("/chambers/ii");
}

export async function upsertChamberBelief(id: string | null, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "chambers")) throw new Error("Unauthorized");

  const supabase = createClient();
  const data = {
    title: formData.get("title") as string,
    content: (formData.get("content") as string) || null,
    chamber: "ii",
    order_index: parseInt(formData.get("order_index") as string) || 0,
  };

  if (id) {
    const { error } = await supabase.from("chamber_beliefs").update(data).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("chamber_beliefs").insert(data);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/chambers");
  revalidatePath("/chambers/ii");
}

export async function deleteChamberBelief(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "chambers")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("chamber_beliefs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/chambers");
  revalidatePath("/chambers/ii");
}

export async function upsertChamberContent(id: string | null, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "chambers")) throw new Error("Unauthorized");

  const supabase = createClient();
  const data = {
    chamber: formData.get("chamber") as string,
    section: formData.get("section") as string,
    content: (formData.get("content") as string) || null,
  };

  if (id) {
    const { error } = await supabase.from("chamber_content").update(data).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("chamber_content").insert(data);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/chambers");
  revalidatePath("/chambers/iii");
}
