"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/image-upload";
import { updateBlogPost } from "@/app/admin/actions/blog";
import { toast } from "@/lib/use-toast";
import { ArrowLeft, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { BlogPreview } from "@/components/admin/blog-preview";

export default function BlogEditForm({ post }: { post: BlogPost }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt ?? "");
  const [content, setContent] = useState(
    post.content ? JSON.stringify(post.content, null, 2) : ""
  );
  const [coverImage, setCoverImage] = useState<string | null>(
    post.cover_image_url
  );
  const [published, setPublished] = useState(post.published);
  const [showPreview, setShowPreview] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("slug", slug);
      formData.set("excerpt", excerpt);
      formData.set("content", content || "");
      formData.set("cover_image_url", coverImage ?? "");
      formData.set("published", String(published));

      await updateBlogPost(post.id, formData);
      toast({ title: "Blog post updated" });
      router.push("/admin/blog");
    } catch (err: any) {
      toast({
        title: "Failed to update post",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold aileron">Edit Blog Post</h1>
          <p className="text-sm text-black/50 mt-1">
            Update &ldquo;{post.title}&rdquo;
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-url-slug"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of the post"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <ImageUpload
            value={coverImage}
            onChange={setCoverImage}
            folder="blog"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content (JSON)</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Enter content as JSON string'
            rows={10}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-[#e9190f]"
            />
            <Label htmlFor="published" className="cursor-pointer">
              Published
            </Label>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            Preview
          </Button>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-default hover:bg-default/90 text-white"
          >
            {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
            Save Changes
          </Button>
          <Link href="/admin/blog">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>

      <BlogPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={title}
        excerpt={excerpt}
        content={content}
        coverImage={coverImage}
        createdAt={post.created_at}
      />
    </div>
  );
}
