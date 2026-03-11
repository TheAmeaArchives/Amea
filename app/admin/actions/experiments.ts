"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createExperiment(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "experiments")) throw new Error("Unauthorized");

  const supabase = createClient();

  const { error } = await supabase.from("experiments").insert({
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    content: formData.get("content") ? JSON.parse(formData.get("content") as string) : null,
    image_url: (formData.get("image_url") as string) || null,
    curator: (formData.get("curator") as string) || null,
    editor: (formData.get("editor") as string) || null,
    chamber: (formData.get("chamber") as string) || "i",
    published: formData.get("published") === "true",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/experiments");
  revalidatePath("/chambers/i");
}

export async function updateExperiment(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "experiments")) throw new Error("Unauthorized");

  const supabase = createClient();

  const { error } = await supabase
    .from("experiments")
    .update({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || null,
      content: formData.get("content") ? JSON.parse(formData.get("content") as string) : null,
      image_url: (formData.get("image_url") as string) || null,
      curator: (formData.get("curator") as string) || null,
      editor: (formData.get("editor") as string) || null,
      chamber: (formData.get("chamber") as string) || "i",
      published: formData.get("published") === "true",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/experiments");
  revalidatePath("/chambers/i");
}

export async function deleteExperiment(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "experiments")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("experiments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experiments");
  revalidatePath("/chambers/i");
}

export async function toggleExperimentPublished(id: string, published: boolean) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "experiments")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("experiments")
    .update({ published })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/experiments");
  revalidatePath("/chambers/i");
}
