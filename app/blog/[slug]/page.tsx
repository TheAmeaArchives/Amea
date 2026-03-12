import React from "react";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogContentRenderer } from "@/components/blog/blog-content-renderer";

const BlogPostPage = async ({ params }: { params: { slug: string } }) => {
    const supabase = createClient();
    const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", params.slug)
        .eq("published", true)
        .single();

    const post = data as BlogPost | null;

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen">
            <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-default hover:underline mb-6 sm:mb-8 text-sm sm:text-base"
            >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Back to Blog</span>
            </Link>

            <header className="mb-8 sm:mb-10 md:mb-12">
                <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-3 sm:mb-4">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }).toUpperCase()}
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold editor-font mb-4 sm:mb-5 md:mb-6 leading-tight">
                    {post.title}
                </h1>
                {post.excerpt && (
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 aileron font-light max-w-3xl">
                        {post.excerpt}
                    </p>
                )}
            </header>

            {post.cover_image_url && (
                <div className="mb-8 sm:mb-10 md:mb-12">
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full max-w-4xl h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-cover rounded-lg"
                    />
                </div>
            )}

            <div className="max-w-4xl aileron font-light">
                <BlogContentRenderer content={post.content} />
            </div>
        </article>
    );
};

export default BlogPostPage;
