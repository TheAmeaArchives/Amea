"use client";

import type { Contributor, SiteContentMap } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { EditableText } from "@/components/admin/editable-text";

interface ContributorsPageClientProps {
    content: SiteContentMap;
    contributors: Contributor[];
}

export function ContributorsPageClient({ content, contributors }: ContributorsPageClientProps) {
    const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;

    return (
        <>
            <div className="flex flex-col gap-10">
                <div className="w-full gap-4 flex flex-col">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold akira w-fit">
                        <EditableText
                            contentKey="contributors_title"
                            defaultValue={getContentValue('contributors_title', 'OUR CONTRIBUTORS')}
                        >
                            {getContentValue('contributors_title', 'OUR CONTRIBUTORS')}
                        </EditableText>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl font-light max-w-4xl">
                        <EditableText
                            contentKey="contributors_description"
                            defaultValue={getContentValue('contributors_description', 'We are in 2500 BC, Egypt...')}
                            multiline
                        >
                            {getContentValue('contributors_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled')}
                        </EditableText>
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                    {contributors.length > 0 ? (
                        contributors.map((contributor) => (
                            <Link
                                href={`/contributors/${contributor.id}`}
                                className="w-full group"
                                key={contributor.id}
                            >
                                <div className="relative w-full h-56 sm:h-64 md:h-72 bg-black rounded-sm overflow-hidden">
                                    <Image
                                        src={contributor.image_url ?? "/test.svg"}
                                        alt={contributor.name}
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        fill
                                    />
                                </div>
                                <div className="flex flex-col mt-2 sm:mt-3">
                                    <h1 className="group-hover:underline text-base sm:text-lg">{contributor.name}</h1>
                                    <span className="font-light aileron text-sm text-gray-600">{contributor.location ?? ""}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 sm:py-20 text-center">
                            <p className="text-lg sm:text-xl text-gray-500 aileron">No contributors listed yet.</p>
                            <p className="text-sm text-gray-400 mt-2">Check back soon for updates.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
