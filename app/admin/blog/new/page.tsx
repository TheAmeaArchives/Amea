"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/admin/image-upload";
import { createBlogPost } from "@/app/admin/actions/blog";
import { toast } from "@/lib/use-toast";
import { ArrowLeft, Loader2, Eye, MoreHorizontal, ChevronDown } from "lucide-react";
import Link from "next/link";
import { BlogPreview } from "@/components/admin/blog-preview";
import { BlogEditor } from "@/components/admin/blog-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewBlogPostPage() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(value));
    }
  }

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  async function handlePublish(shouldPublish: boolean = true) {
    if (!title.trim()) {
      toast({ title: "Please add a title", variant: "destructive" });
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      toast({ title: "Unable to generate slug", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("slug", finalSlug);
      formData.set("excerpt", excerpt);
      formData.set("content", content || "[]");
      formData.set("cover_image_url", coverImage ?? "");
      formData.set("published", String(shouldPublish));

      await createBlogPost(formData);
      toast({ title: shouldPublish ? "Story published!" : "Draft saved" });
      window.location.href = "/admin/blog";
      return;
    } catch (err: any) {
      toast({
        title: "Failed to save",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar - Medium Style */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/blog">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <span className="text-sm text-gray-500">
                Draft in <span className="text-gray-900">Blog</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Eye size={18} className="mr-1.5" />
                Preview
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePublish(false)}
                disabled={loading}
                className="text-gray-600 hover:text-gray-900"
              >
                Save draft
              </Button>

              <Button
                onClick={() => handlePublish(true)}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
              >
                {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
                Publish
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-600">
                    <MoreHorizontal size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setShowSettings(!showSettings)}>
                    {showSettings ? "Hide settings" : "Show settings"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { window.location.href = "/admin/blog"; }}>
                    Discard draft
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Settings Panel - Collapsible */}
        {showSettings && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Story settings</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSettings(false)}
                className="text-gray-500"
              >
                Done
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="your-story-url"
                  className="bg-white"
                />
                <p className="mt-1 text-xs text-gray-500">
                  /blog/{slug || "your-story-url"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle / Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Write a preview subtitle..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <ImageUpload
                  value={coverImage}
                  onChange={setCoverImage}
                  folder="blog"
                />
              </div>
            </div>
          </div>
        )}

        {/* Cover Image Display */}
        {coverImage && !showSettings && (
          <div className="mb-8 relative group">
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-64 object-cover rounded-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Change cover
            </Button>
          </div>
        )}

        {/* Title Input - Medium Style */}
        <div className="mb-6">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Title"
            className="border-0 text-4xl font-bold p-0 focus-visible:ring-0 placeholder:text-gray-300 h-auto"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              lineHeight: "1.2",
            }}
          />
        </div>

        {/* Subtitle/Excerpt - Inline if no settings panel */}
        {!showSettings && (
          <div className="mb-8">
            <Input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a subtitle..."
              className="border-0 text-xl text-gray-500 p-0 focus-visible:ring-0 placeholder:text-gray-300 h-auto font-light"
            />
          </div>
        )}

        {/* Add Cover Button - Only if no cover */}
        {!coverImage && !showSettings && (
          <button
            onClick={() => setShowSettings(true)}
            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-xl leading-none">+</span>
            </span>
            <span className="text-sm">Add a cover image</span>
          </button>
        )}

        {/* Content Editor */}
        <div className="min-h-[400px]">
          <BlogEditor
            initialContent={content}
            onChange={handleContentChange}
            placeholder="Tell your story..."
          />
        </div>
      </main>

      <BlogPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={title}
        excerpt={excerpt}
        content={content}
        coverImage={coverImage}
      />
    </div>
  );
}
