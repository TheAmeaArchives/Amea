import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BlogPost } from "@/lib/types";
import BlogActions from "./blog-actions";

export default async function AdminBlogPage() {
  const [profile, posts] = await Promise.all([
    getAdminProfile(),
    fetchServerData<BlogPost[]>("/api/v1/admin/blog-posts"),
  ]);

  if (!profile || !hasPermission(profile, "blog")) redirect("/admin");

  const blogPosts = posts ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold aileron">Blog Posts</h1>
          <p className="text-sm text-black/50 mt-1">
            Manage your blog content
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-default hover:bg-default/90 text-white">
            <Plus size={16} className="mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {blogPosts.length === 0 ? (
        <div className="rounded-md border p-12 text-center">
          <p className="text-black/40 text-sm">No blog posts yet.</p>
          <Link href="/admin/blog/new">
            <Button variant="outline" className="mt-4">
              Create your first post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={post.published ? "default" : "secondary"}
                    >
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-black/50 text-sm">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <BlogActions post={post} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
