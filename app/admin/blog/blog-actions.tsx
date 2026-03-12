"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBlogPost, toggleBlogPostPublished } from "@/app/admin/actions/blog";
import { toast } from "@/lib/use-toast";
import type { BlogPost } from "@/lib/types";
import Link from "next/link";
import { BlogPreview } from "@/components/admin/blog-preview";

export default function BlogActions({ post }: { post: BlogPost }) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);

  async function handleToggle() {
    try {
      await toggleBlogPostPublished(post.id, !post.published);
      toast({ title: post.published ? "Post unpublished" : "Post published" });
      router.refresh();
    } catch {
      toast({ title: "Failed to update post", variant: "destructive" });
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteBlogPost(post.id);
      toast({ title: "Post deleted" });
      router.refresh();
    } catch {
      toast({ title: "Failed to delete post", variant: "destructive" });
    }
  }

  const contentString = post.content 
    ? (typeof post.content === "string" ? post.content : JSON.stringify(post.content, null, 2))
    : "";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowPreview(true)}>
            <FileSearch size={14} className="mr-2" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/blog/${post.id}`}>
              <Pencil size={14} className="mr-2" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggle}>
            {post.published ? (
              <>
                <EyeOff size={14} className="mr-2" />
                Unpublish
              </>
            ) : (
              <>
                <Eye size={14} className="mr-2" />
                Publish
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 size={14} className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BlogPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={post.title}
        excerpt={post.excerpt ?? ""}
        content={contentString}
        coverImage={post.cover_image_url}
        createdAt={post.created_at}
        isPublished={post.published}
      />
    </>
  );
}
