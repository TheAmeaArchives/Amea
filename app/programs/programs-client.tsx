"use client";

import React from "react";
import Search from "@/components/chambers/search";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { Program, SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";

const iconMap: Record<string, string> = {
    circle: "/circlelayer.svg",
    diamond: "/diamondlayer.svg",
    triangle: "/trianglelayer.svg",
};

interface ProgramsPageClientProps {
    content: SiteContentMap;
    programs: Program[];
}

export function ProgramsPageClient({ content, programs }: ProgramsPageClientProps) {
    const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;
    
    const featuredProgram = programs.find((p) => p.featured);
    const iconPrograms = programs.filter((p) => p.icon_type && !p.featured);
    const otherPrograms = programs.filter((p) => !p.icon_type && !p.featured);

    return (
        <>
            <div className="flex flex-row gap-7 justify-between items-start">
                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold akira">
                        <EditableText
                            contentKey="programs_title"
                            defaultValue={getContentValue('programs_title', 'OUR PROGRAMS')}
                        >
                            {getContentValue('programs_title', 'OUR PROGRAMS')}
                        </EditableText>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl aileron font-light mt-2">
                        <EditableText
                            contentKey="programs_subtitle"
                            defaultValue={getContentValue('programs_subtitle', 'Insights from curated experiments.')}
                        >
                            {getContentValue('programs_subtitle', 'Insights from curated experiments.')}
                        </EditableText>
                    </p>
                </div>
                <span className="w-full sm:w-auto flex justify-end flex-shrink-0">
                    <Search mode="ICON" />
                </span>
            </div>

            {programs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <p className="text-xl text-gray-500 aileron">No programs available yet.</p>
                    <p className="text-sm text-gray-400 mt-2">Check back soon for updates.</p>
                </div>
            ) : (
                <>
                    {featuredProgram && (
                        <div className="flex flex-col md:flex-row gap-8 sm:gap-10 md:gap-x-11 mt-10 sm:mt-14 md:mt-20">
                            <div className="w-full h-[250px] sm:h-[300px] md:h-auto bg-default md:flex-[2] rounded-sm" />
                            <div className="flex-1 space-y-6 sm:space-y-8 md:space-y-16">
                                <h1 className="editor-font font-bold text-lg sm:text-xl md:text-2xl lg:text-[40px] lg:leading-[2.5rem]">
                                    {featuredProgram.title}
                                </h1>
                                <p className="aileron font-light text-sm sm:text-base md:text-lg lg:text-xl">
                                    {featuredProgram.description ?? ""}
                                </p>
                                <div className="flex gap-x-2 sm:gap-x-2.5 items-center group cursor-pointer">
                                    <span className="text-sm sm:text-base group-hover:text-default transition-colors">KNOW MORE</span>
                                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    )}

                    {iconPrograms.length > 0 && (
                        <div className="flex flex-col md:flex-row gap-10 sm:gap-14 md:gap-y-[72px] mt-10 sm:mt-12 md:mt-16 md:gap-x-10 lg:gap-x-[70px]">
                            {iconPrograms.map((program, idx) => (
                                <div
                                    key={program.id}
                                    className={`w-full space-y-8 sm:space-y-10 md:space-y-14${idx === 1 ? " md:mt-10 lg:mt-20" : ""}`}
                                >
                                    <div className="relative w-24 h-20 sm:w-28 sm:h-24 md:w-32 md:h-28 mx-auto">
                                        <Image
                                            src={iconMap[program.icon_type ?? "circle"]}
                                            alt={`${program.icon_type}-2layer`}
                                            fill
                                        />
                                    </div>
                                    <div className="space-y-6 sm:space-y-8 md:space-y-12">
                                        <h1 className="editor-font font-bold text-lg sm:text-xl md:text-2xl lg:text-[40px] lg:leading-[2.5rem]">
                                            {program.title}
                                        </h1>
                                        <p className="aileron font-light text-sm sm:text-base md:text-lg lg:text-xl">
                                            {program.description ?? ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {otherPrograms.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-14 mt-16 sm:mt-20 md:mt-28">
                            {otherPrograms.map((program, idx) => (
                                <div
                                    key={program.id}
                                    className={`space-y-4 sm:space-y-5 md:space-y-12${idx >= 2 ? " hidden sm:block" : ""}`}
                                >
                                    <div
                                        className={`w-full h-[220px] sm:h-[260px] md:h-[305px] bg-default rounded-sm ${
                                            idx % 2 === 0 ? "lg:h-[354px]" : "lg:h-[320px]"
                                        }`}
                                    />
                                    <h1 className="editor-font font-bold text-lg sm:text-xl md:text-2xl lg:text-[40px] lg:leading-[2.5rem]">
                                        {program.title}
                                    </h1>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    );
}
