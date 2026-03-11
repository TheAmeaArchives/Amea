import React from "react";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
                className="inline-flex items-center gap-2 text-default hover:underline mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Blog</span>
            </Link>

            <header className="mb-12">
                <p className="text-lg text-gray-500 mb-4">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }).toUpperCase()}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold editor-font mb-6">
                    {post.title}
                </h1>
                {post.excerpt && (
                    <p className="text-xl text-gray-600 aileron font-light max-w-3xl">
                        {post.excerpt}
                    </p>
                )}
            </header>

            {post.cover_image_url && (
                <div className="mb-12">
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full max-w-4xl h-auto max-h-[500px] object-cover rounded-lg"
                    />
                </div>
            )}

            <div className="prose prose-lg max-w-4xl aileron font-light">
                {post.content && (
                    typeof post.content === "string" ? (
                        <p>{post.content}</p>
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(post.content),
                            }}
                        />
                    )
                )}
            </div>
        </article>
    );
};

export default BlogPostPage;
