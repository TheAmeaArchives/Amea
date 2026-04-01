"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function createBlogPost(formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "blog")) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const coverImageUrl = formData.get("cover_image_url") as string;
  const published = formData.get("published") === "true";

  await requestServerData({
    path: "/api/admin/blog-posts",
    method: "POST",
    body: {
      title,
      slug,
      excerpt: excerpt || null,
      content: content ? JSON.parse(content) : null,
      cover_image_url: coverImageUrl || null,
      published,
      author_id: profile?.id ?? null,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "blog")) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const coverImageUrl = formData.get("cover_image_url") as string;
  const published = formData.get("published") === "true";

  await requestServerData({
    path: `/api/admin/blog-posts/${encodeURIComponent(id)}`,
    method: "PATCH",
    body: {
      title,
      slug,
      excerpt: excerpt || null,
      content: content ? JSON.parse(content) : null,
      cover_image_url: coverImageUrl || null,
      published,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteBlogPost(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "blog")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/blog-posts/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function toggleBlogPostPublished(id: string, published: boolean) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "blog")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/blog-posts/${encodeURIComponent(id)}/published`,
    method: "PATCH",
    body: { published },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
