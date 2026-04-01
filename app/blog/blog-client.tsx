"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";
import Search from "@/components/chambers/search";
import type { BlogPost, SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";

interface BlogPageClientProps {
    content: SiteContentMap;
    posts: BlogPost[];
}

export function BlogPageClient({ content, posts }: BlogPageClientProps) {
    const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;
    const hasPosts = posts.length > 0;

    return (
        <div className="min-h-screen">
            <div className="flex gap-10 flex-wrap justify-between items-start">
                <div className="flex flex-col gap-3">
                    <h1 className="text-5xl font-bold akira">
                        <EditableText
                            contentKey="blog_title"
                            defaultValue={getContentValue('blog_title', 'OUR BLOG')}
                        >
                            {getContentValue('blog_title', 'OUR BLOG')}
                        </EditableText>
                    </h1>
                    <p className="text-2xl aileron font-light">
                        <EditableText
                            contentKey="blog_subtitle"
                            defaultValue={getContentValue('blog_subtitle', 'A virtual research center')}
                        >
                            {getContentValue('blog_subtitle', 'A virtual research center')}
                        </EditableText>
                    </p>
                </div>
                <span className="flex-shrink-0">
                    <Search mode="ICON" />
                </span>
            </div>
            <div className="flex flex-col mt-16 sm:mt-20">
                {hasPosts ? (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex flex-col md:flex-row gap-5 sm:gap-6 md:gap-8 py-8 sm:py-10 border-b border-gray-200 first:pt-0"
                        >
                            {post.cover_image_url ? (
                                <img
                                    src={post.cover_image_url}
                                    alt={post.title}
                                    className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="bg-default h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 flex-shrink-0" />
                            )}
                            <div className="flex flex-col justify-between flex-1 gap-3 sm:gap-4">
                                <div>
                                    <p className="text-sm sm:text-base font-medium text-gray-500 tracking-wide">
                                        {new Date(post.created_at).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }).toUpperCase()}
                                    </p>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold editor-font mt-2 leading-tight">
                                        {post.title}
                                    </h2>
                                </div>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="flex items-center gap-2 group w-fit"
                                >
                                    <span className="text-sm sm:text-base font-medium tracking-wide group-hover:text-default transition-colors">READ MORE</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-default transition-all" />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
                        <p className="text-lg sm:text-xl text-gray-500 aileron">No blog posts published yet.</p>
                        <p className="text-sm text-gray-400 mt-2">Check back soon for new content.</p>
                    </div>
                )}
            </div>
            <div className="flex py-20 flex-col gap-5">
                <h1 className="text-3xl font-bold max-w-xl -z-10 editor-font">
                    <EditableText
                        contentKey="blog_newsletter_title"
                        defaultValue={getContentValue('blog_newsletter_title', 'Join over 100,000 Subscribers to Our Newsletter')}
                    >
                        {getContentValue('blog_newsletter_title', 'Join over 100,000 Subscribers to Our Newsletter')}
                    </EditableText>
                </h1>
                <p className="max-w-2xl text-base font-light aileron text-gray-600">
                    <EditableText
                        contentKey="blog_newsletter_description"
                        defaultValue={getContentValue('blog_newsletter_description', 'Stay updated with the latest insights...')}
                        multiline
                    >
                        {getContentValue('blog_newsletter_description', 'Stay updated with the latest insights on behavioral science, innovation, and research from across Africa. Get exclusive content delivered directly to your inbox.')}
                    </EditableText>
                </p>
            </div>
            <form className="max-w-xl flex flex-col sm:flex-row gap-3 sm:gap-0 sm:border sm:rounded-full sm:overflow-hidden">
                <input
                    type="email"
                    className="flex-1 outline-none border sm:border-none rounded-full sm:rounded-none px-4 sm:px-5 py-3 sm:py-0 placeholder:aileron placeholder:font-light placeholder:text-gray-400"
                    placeholder="Enter your email"
                />
                <button className="py-[5px] bg-default text-white text-xl px-10 outline-none aileron uppercase hover:bg-default/90 transition-colors">
                    Sign up
                </button>
            </form>
            <div className="p-6 sm:p-8 md:p-10" />
        </div>
    );
}
