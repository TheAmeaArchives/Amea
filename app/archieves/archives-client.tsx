"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";

interface ArchivesPageClientProps {
    content: SiteContentMap;
}

export function ArchivesPageClient({ content }: ArchivesPageClientProps) {
    const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;
    
    return (
        <div className="min-h-screen">
            <div className="min-h-[300px] sm:h-80 md:h-96 justify-center gap-4 sm:gap-5 flex flex-col text-start z-50">
                <h1 className="akira text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold md:mt-16 lg:mt-24 leading-tight">
                    <EditableText
                        contentKey="archives_title"
                        defaultValue={getContentValue('archives_title', 'How the pyramids were built ( Kind of )')}
                    >
                        {getContentValue('archives_title', 'How the pyramids were built ( Kind of )')}
                    </EditableText>
                </h1>
                <p className="max-w-xl font-light text-sm sm:text-base">
                    <EditableText
                        contentKey="archives_description"
                        defaultValue={getContentValue('archives_description', 'We are in 2500 BC, Egypt...')}
                        multiline
                    >
                        {getContentValue('archives_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge and experience to mold and piece together humble blocks of stones to build up what would be-till today-one of the most majestic structures on Earth: The Great Pyramids.')}
                    </EditableText>
                </p>
            </div>

            {/*Desktop view - visible on md and up*/}
            <div className="absolute this hidden md:block font-light aileron">
                <Image
                    src="/triangle.svg"
                    alt="theAmeaarchives chamber folder"
                    fill
                    className="absolute object-contain"
                />

                <Link
                    href="/chambers/i"
                    className="circle absolute top-[50%] right-[14%] center text-white hover:scale-105 transition-transform"
                >
                    <EditableText
                        contentKey="chamber_i_title"
                        defaultValue={getContentValue('chamber_i_title', 'Chamber I')}
                    >
                        {getContentValue('chamber_i_title', 'Chamber I')}
                    </EditableText>
                </Link>
                <Link
                    href="/chambers/ii"
                    className="circle absolute top-[64%] left-[27%] center text-white hover:scale-105 transition-transform"
                >
                    <EditableText
                        contentKey="chamber_ii_title"
                        defaultValue={getContentValue('chamber_ii_title', 'Chamber II')}
                    >
                        {getContentValue('chamber_ii_title', 'Chamber II')}
                    </EditableText>
                </Link>
                <Link
                    href="/chambers/iii"
                    className="circle absolute bottom-[0%] right-[22%] center text-white hover:scale-105 transition-transform"
                >
                    <EditableText
                        contentKey="chamber_iii_title"
                        defaultValue={getContentValue('chamber_iii_title', 'Chamber III')}
                    >
                        {getContentValue('chamber_iii_title', 'Chamber III')}
                    </EditableText>
                </Link>
            </div>

            {/*Mobile view - visible below md*/}
            <div className="min-h-[380px] sm:h-[450px] mt-4 sm:mt-5 relative md:hidden aileron font-light">
                <div className="relative w-full max-w-[320px] sm:max-w-[355px] h-[280px] sm:h-[350px]">
                    <Image
                        src="/triangle1.svg"
                        alt="theAmeaarchives chamber folder"
                        fill
                        className="object-contain"
                    />
                </div>

                <Link
                    href="/chambers/i"
                    className="circle absolute right-0 top-8 sm:top-14 center text-white hover:scale-105 transition-transform"
                >
                    {getContentValue('chamber_i_title', 'Chamber I')}
                </Link>

                <Link
                    href="/chambers/ii"
                    className="circle absolute left-0 bottom-20 sm:bottom-28 bg-black center text-white hover:scale-105 transition-transform"
                >
                    {getContentValue('chamber_ii_title', 'Chamber II')}
                </Link>
                <Link
                    href="/chambers/iii"
                    className="circle absolute bottom-2 sm:bottom-6 right-0 center text-white hover:scale-105 transition-transform"
                >
                    {getContentValue('chamber_iii_title', 'Chamber III')}
                </Link>
            </div>
        </div>
    );
}
