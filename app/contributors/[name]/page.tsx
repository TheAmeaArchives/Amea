import { fetchServerData } from "@/lib/backend/server-api";
import type { Contributor, ContributorArticle } from "@/lib/types";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type IndividualContributorPageProps = {
    params: Promise<{ name: string }>;
};

const IndividualContributorPage = async ({ params }: IndividualContributorPageProps) => {
    const { name } = await params;
    const payload = await fetchServerData<{
        contributor: Contributor;
        articles: ContributorArticle[];
    }>(`/api/public/contributors/${encodeURIComponent(name)}`);
    const contributor = payload?.contributor ?? null;

    if (!contributor) {
        notFound();
    }

    const articles = payload?.articles ?? [];
    return (
        <>
            <div className="md:hidden mb-4">
                <h1 className="aileron font-bold text-xl sm:text-2xl">{contributor.name}</h1>
                <h2 className="aileron font-semibold text-lg sm:text-xl text-gray-700">{contributor.location ?? ""}</h2>
            </div>
            <div className="flex flex-col md:flex-row-reverse gap-6 sm:gap-8 md:gap-x-11 mb-8 sm:mb-10 md:mb-12">
                <div className="flex-1">
                    <div className="w-full h-[280px] sm:h-[350px] md:h-full min-h-[300px] relative rounded-sm overflow-hidden">
                        <Image
                            src={contributor.image_url ?? "/test.svg"}
                            alt={contributor.name}
                            className="object-cover"
                            fill
                        />
                    </div>
                </div>
                <div className="space-y-4 sm:space-y-6 md:space-y-9 flex-1">
                    <div className="hidden md:block">
                        <h1 className="aileron font-bold text-3xl lg:text-4xl xl:text-5xl">{contributor.name}</h1>
                        <h2 className="aileron font-semibold text-2xl lg:text-3xl xl:text-4xl text-gray-700">{contributor.location ?? ""}</h2>
                    </div>
                    <p className="font-light aileron text-sm sm:text-base md:text-lg lg:text-xl">
                        {contributor.bio ?? ""}
                    </p>
                </div>
            </div>
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <h1 className="aileron font-bold text-lg sm:text-xl md:text-2xl lg:text-4xl">Articles</h1>
                <div className="flex flex-col md:flex-row flex-wrap gap-x-16 lg:gap-x-28 gap-y-6 sm:gap-y-8 md:gap-y-9">
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <div
                                key={article.id}
                                className="pt-3 sm:pt-4 border-t-2 md:border-t-4 lg:border-t-[9px] w-full border-t-black/10 md:w-[28rem] lg:w-[36rem] space-y-1 sm:space-y-2 md:space-y-3"
                            >
                                {article.url ? (
                                    <Link href={article.url} target="_blank" className="hover:underline hover:text-default transition-colors">
                                        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[32px] xl:leading-[2.25rem] font-bold max-w-xl editor-font">{article.title}</h1>
                                    </Link>
                                ) : (
                                    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[32px] xl:leading-[2.25rem] font-bold max-w-xl editor-font">{article.title}</h1>
                                )}
                                <p className="text-xs sm:text-sm md:text-base aileron font-normal text-gray-600">
                                    {new Date(article.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }).toUpperCase()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="pt-4 w-full text-center py-6 sm:py-8">
                            <p className="text-gray-500 aileron text-sm sm:text-base">No articles published yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default IndividualContributorPage;
