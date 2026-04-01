"use client";

import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogContentRenderer } from "@/components/blog/blog-content-renderer";

interface BlogPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  createdAt?: string;
  isPublished?: boolean;
}

export function BlogPreview({
  isOpen,
  onClose,
  title,
  excerpt,
  content,
  coverImage,
  createdAt,
  isPublished = false,
}: BlogPreviewProps) {
  if (!isOpen) return null;

  const displayDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).toUpperCase()
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Preview Mode</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              isPublished 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 bg-white">
          <article className="min-h-full">
            <div className="inline-flex items-center gap-2 text-default mb-6 sm:mb-8 text-sm sm:text-base cursor-default">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Back to Blog</span>
            </div>

            <header className="mb-8 sm:mb-10 md:mb-12">
              <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-3 sm:mb-4">
                {displayDate}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold editor-font mb-4 sm:mb-5 md:mb-6 leading-tight">
                {title || "Untitled Post"}
              </h1>
              {excerpt && (
                <p className="text-base sm:text-lg md:text-xl text-gray-600 aileron font-light max-w-3xl">
                  {excerpt}
                </p>
              )}
            </header>

            {coverImage && (
              <div className="mb-8 sm:mb-10 md:mb-12">
                <img
                  src={coverImage}
                  alt={title || "Cover image"}
                  className="w-full max-w-4xl h-auto max-h-[300px] sm:max-h-[400px] object-cover rounded-lg"
                />
              </div>
            )}

            <div className="max-w-4xl aileron font-light">
              <BlogContentRenderer content={content} />
            </div>
          </article>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
