import { createClient } from "@/lib/supabase/server";
import type { Contributor, ContributorArticle } from "@/lib/types";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const IndividualContributorPage = async ({ params }: { params: { name: string } }) => {
    const { name } = params;
    const supabase = createClient();

    const [contributorRes, articlesRes] = await Promise.all([
        supabase.from("contributors").select("*").eq("id", name).single(),
        supabase
            .from("contributor_articles")
            .select("*")
            .eq("contributor_id", name)
            .order("created_at", { ascending: false }),
    ]);

    const contributor = contributorRes.data as Contributor | null;

    if (!contributor) {
        notFound();
    }

    const articles = (articlesRes.data as ContributorArticle[] | null) ?? [];

    return (
        <>
            <div className="md:hidden">
                <h1 className="aileron font-bold text-2xl">{contributor.name}</h1>
                <h2 className="aileron font-semibold text-xl">{contributor.location ?? ""}</h2>
            </div>
            <div className="flex flex-col md:flex-row-reverse gap-y-9 gap-x-11 mb-9 md:mb-12 max-md:mt-9">
                <div className="flex-1">
                    <div className="w-full h-[350px] md:h-full relative">
                        <Image
                            src={contributor.image_url ?? "/test.svg"}
                            alt={contributor.name}
                            className="object-cover"
                            fill
                        />
                    </div>
                </div>
                <div className="space-y-9 flex-1">
                    <div className="max-md:hidden">
                        <h1 className="aileron font-bold text-2xl md:text-5xl">{contributor.name}</h1>
                        <h2 className="aileron font-semibold text-xl md:text-4xl">{contributor.location ?? ""}</h2>
                    </div>
                    <p className="font-light aileron md:text-xl">
                        {contributor.bio ?? ""}
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                <h1 className="aileron font-bold text-xl md:text-4xl">Articles</h1>
                <div className="flex flex-col md:flex-row flex-wrap gap-x-28 gap-y-9">
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <div
                                key={article.id}
                                className="pt-4 border-t-2 md:border-t-[9px] w-full border-t-black/10 md:w-[36rem] md:space-y-3"
                            >
                                {article.url ? (
                                    <Link href={article.url} target="_blank" className="hover:underline">
                                        <h1 className="text-xl md:text-[32px] md:leading-[2.25rem] font-bold max-w-xl editor-font">{article.title}</h1>
                                    </Link>
                                ) : (
                                    <h1 className="text-xl md:text-[32px] md:leading-[2.25rem] font-bold max-w-xl editor-font">{article.title}</h1>
                                )}
                                <p className="text-base max-md:text-sm aileron font-normal">
                                    {new Date(article.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }).toUpperCase()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="pt-4 w-full text-center py-8">
                            <p className="text-gray-500 aileron">No articles published yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default IndividualContributorPage;
