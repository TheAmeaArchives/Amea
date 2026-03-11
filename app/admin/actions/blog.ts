"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createBlogPost(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "blog")) throw new Error("Unauthorized");

  const supabase = createClient();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const coverImageUrl = formData.get("cover_image_url") as string;
  const published = formData.get("published") === "true";

  const { error } = await supabase.from("blog_posts").insert({
    title,
    slug,
    excerpt: excerpt || null,
    content: content ? JSON.parse(content) : null,
    cover_image_url: coverImageUrl || null,
    published,
    author_id: profile!.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "blog")) throw new Error("Unauthorized");

  const supabase = createClient();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const coverImageUrl = formData.get("cover_image_url") as string;
  const published = formData.get("published") === "true";

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      slug,
      excerpt: excerpt || null,
      content: content ? JSON.parse(content) : null,
      cover_image_url: coverImageUrl || null,
      published,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteBlogPost(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "blog")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function toggleBlogPostPublished(id: string, published: boolean) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "blog")) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({ published })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
