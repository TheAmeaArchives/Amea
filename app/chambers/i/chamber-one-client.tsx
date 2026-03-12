"use client";

import Search from "@/components/chambers/search";
import Link from "next/link";
import React from "react";
import { Bookmark } from "lucide-react";
import type { Experiment, SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";

interface ChamberOneClientProps {
    content: SiteContentMap;
    experiments: Experiment[];
}

export function ChamberOneClient({ content, experiments }: ChamberOneClientProps) {
    const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;
    const hasExperiments = experiments.length > 0;

    return (
        <div className="flex flex-col gap-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase akira">
                    <EditableText
                        contentKey="chamber_i_title"
                        defaultValue={getContentValue('chamber_i_title', 'Chamber I')}
                    >
                        {getContentValue('chamber_i_title', 'Chamber I')}
                    </EditableText>
                </h1>
                <p className="font-light text-base sm:text-lg md:text-xl lg:text-2xl">
                    <EditableText
                        contentKey="chamber_i_subtitle"
                        defaultValue={getContentValue('chamber_i_subtitle', 'Insights from curated experiments.')}
                    >
                        {getContentValue('chamber_i_subtitle', 'Insights from curated experiments.')}
                    </EditableText>
                </p>
            </div>
            <Search mode="BAR" />

            {hasExperiments ? (
                <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 mt-8 sm:mt-12 md:mt-20 md:px-8 lg:px-20 xl:px-40">
                    {experiments.map((experiment) => (
                        <div
                            key={experiment.id}
                            className="relative after:absolute after:h-1 sm:after:h-2 flex after:-bottom-6 sm:after:-bottom-8 md:after:-bottom-10 gap-3 sm:gap-4 md:gap-5 after:w-full after:left-0 after:bg-black/10 after:-z-10"
                        >
                            <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 md:gap-12 lg:gap-20">
                                <div className="flex-1 order-2 sm:order-1">
                                    <Link href={`i/experiments/${experiment.slug}`} className="block group">
                                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[32px] font-bold aileron group-hover:text-default transition-colors line-clamp-3">
                                            {experiment.title}
                                        </h1>
                                    </Link>
                                    <div className="hidden sm:flex justify-between text-zinc-500 capitalize text-sm md:text-base mt-2">
                                        <span>{experiment.curator ?? ""}</span>
                                        <span>{experiment.editor ?? ""}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start sm:items-center order-1 sm:order-2">
                                    {experiment.image_url ? (
                                        <img
                                            src={experiment.image_url}
                                            alt={experiment.title}
                                            className="h-16 w-24 sm:h-24 sm:w-40 md:h-32 md:w-56 lg:h-[156px] lg:w-72 object-cover rounded-sm"
                                        />
                                    ) : (
                                        <div className="h-16 w-24 sm:h-24 sm:w-40 md:h-32 md:w-56 lg:h-[156px] lg:w-72 bg-default rounded-sm" />
                                    )}
                                    <span className="flex sm:hidden justify-end ml-auto">
                                        <Bookmark className="w-5 h-5 text-default" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 sm:py-24 md:py-32 text-center mt-6 sm:mt-8 md:mt-10">
                    <p className="text-lg sm:text-xl text-gray-500 aileron">No experiments published yet.</p>
                    <p className="text-sm text-gray-400 mt-2">Check back soon for new insights.</p>
                </div>
            )}
        </div>
    );
}
