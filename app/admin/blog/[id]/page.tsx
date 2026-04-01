import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import type { BlogPost } from "@/lib/types";
import BlogEditForm from "./blog-edit-form";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getAdminProfile();
  if (!profile || !hasPermission(profile, "blog")) redirect("/admin");

  const post = await fetchServerData<BlogPost>(`/api/admin/blog-posts/${encodeURIComponent(id)}`);

  if (!post) notFound();

  return <BlogEditForm post={post} />;
}
