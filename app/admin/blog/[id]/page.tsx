import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import type { BlogPost } from "@/lib/types";
import BlogEditForm from "./blog-edit-form";

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getAdminProfile();
  if (!profile || !hasPermission(profile, "blog")) redirect("/admin");

  const supabase = createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!post) notFound();

  return <BlogEditForm post={post as BlogPost} />;
}
