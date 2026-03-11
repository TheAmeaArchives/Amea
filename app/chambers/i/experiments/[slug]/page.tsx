import React from 'react';
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Experiment } from "@/lib/types";
import { notFound } from "next/navigation";

const ExperimentsPage = async ({ params }: { params: { slug: string } }) => {
    const supabase = createClient();
    const { data: experiment } = await supabase
        .from("experiments")
        .select("*")
        .eq("slug", params.slug)
        .eq("published", true)
        .single();

    const post = experiment as Experiment | null;

    if (!post) {
        notFound();
    }

    return (
        <>
            <div className="md:p-5">
                <h1 className="aileron font-bold text-2xl max-w-2xl mb-16">{post.title}</h1>
                {post.image_url ? (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-[200px] mx-auto md:h-[405px] md:w-[800px] mb-20 object-cover"
                    />
                ) : (
                    <div className="bg-default w-full h-[200px] mx-auto md:h-[405px] md:w-[800px] mb-20"></div>
                )}
                {post.description && (
                    <p className="editor-font font-light text-xl w-full text-center max-w-96 mx-auto mb-[70px]">{post.description}</p>
                )}
                {post.content && (
                    <p className="aileron font-light text-base mb-[70px]">
                        {typeof post.content === "string" ? post.content : JSON.stringify(post.content)}
                    </p>
                )}
            </div>
            <div className="flex mt-20 md:border md:px-14 md:rounded-[20px] mx-auto max-w-5xl md:py-2.5">
                <div className="flex gap-x-8">
                    {post.curator && (
                        <div className="space-y-5">
                            <div className="bg-default rounded-full w-20 h-20" />
                            <p className="text-center">{post.curator}</p>
                        </div>
                    )}
                    {post.editor && (
                        <div className="space-y-5">
                            <div className="bg-default rounded-full w-20 h-20" />
                            <p className="text-center">{post.editor}</p>
                        </div>
                    )}
                </div>
                <div className="text-default flex w-full items-end md:items-center justify-end gap-x-4">
                    <Heart className="w-6 h-6" />
                    <MessageCircle className="w-6 h-6" />
                    <Bookmark className="w-6 h-6" />
                </div>
            </div>
        </>
    );
};

export default ExperimentsPage;
