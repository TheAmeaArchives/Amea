"use client"
import { constants as fallbackConstants, stats as fallbackStats } from "@/constants";
import type { SiteContentMap } from "@/lib/types";
import React from "react";
import { EditableText } from "@/components/admin/editable-text";
import { VolunteerButton } from "@/components/volunteer-form";

interface ChamberTwoClientProps {
    stats: { count: string; text: string }[];
    beliefs: { name: string; description: string }[];
    content: SiteContentMap;
}

const ChamberTwoClient = ({ stats: propStats, beliefs: propBeliefs, content }: ChamberTwoClientProps) => {
    const stats = propStats.length > 0 ? propStats : fallbackStats;
    const constants = propBeliefs.length > 0 ? propBeliefs : fallbackConstants;

    const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold uppercase akira">
                    <EditableText
                        contentKey="chamber_ii_title"
                        defaultValue={getContentValue('chamber_ii_title', 'Chamber II')}
                    >
                        {getContentValue('chamber_ii_title', 'Chamber II')}
                    </EditableText>
                </h1>
                <p className="font-light text-2xl">
                    <EditableText
                        contentKey="chamber_ii_subtitle"
                        defaultValue={getContentValue('chamber_ii_subtitle', 'A Virtual Research Center.')}
                    >
                        {getContentValue('chamber_ii_subtitle', 'A Virtual Research Center.')}
                    </EditableText>
                </p>
            </div>
            <div className="flex flex-col gap-y-12 sm:gap-y-16 md:gap-y-[70px] items-center bg">
                <div className="h-full flex w-full items-center justify-around sm:justify-evenly gap-2 sm:gap-4">
                    {stats.map((stat) => (
                        <div key={stat.text} className="text-center flex-1 sm:flex-none">
                            <h2 className="editor-font text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{stat.count}</h2>
                            <p className="max-w-24 sm:max-w-32 text-center text-sm sm:text-lg md:text-xl lg:text-2xl aileron font-light mt-1 sm:mt-2 mx-auto">
                                {stat.text}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2 items-center gap-y-10 sm:gap-y-14 md:gap-y-10">
                    <div className="w-0.5 sm:w-1 bg-black h-32 sm:h-48 md:h-60 rounded" />
                    <VolunteerButton label={getContentValue('chamber_ii_cta', 'Volunteer to participate')} />
                </div>
            </div>
            <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 mt-12 sm:mt-16 md:mt-20">
                {constants.map((constant) => (
                    <div key={constant.name} className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold akira">{constant.name}</h1>
                        <p className="text-base sm:text-lg md:text-xl font-light">{constant.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChamberTwoClient;
