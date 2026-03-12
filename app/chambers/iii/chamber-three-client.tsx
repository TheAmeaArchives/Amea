"use client";

import React from "react";
import type { ChamberContent, SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";

interface ChamberThreeClientProps {
    content: SiteContentMap;
    chamberContent: ChamberContent[];
}

export function ChamberThreeClient({ content, chamberContent }: ChamberThreeClientProps) {
    const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase akira">
                    <EditableText
                        contentKey="chamber_iii_title"
                        defaultValue={getContentValue('chamber_iii_title', 'Chamber III')}
                    >
                        {getContentValue('chamber_iii_title', 'Chamber III')}
                    </EditableText>
                </h1>
                <p className="font-light text-base sm:text-lg md:text-xl lg:text-2xl">
                    <EditableText
                        contentKey="chamber_iii_subtitle"
                        defaultValue={getContentValue('chamber_iii_subtitle', 'Business and Consultance.')}
                    >
                        {getContentValue('chamber_iii_subtitle', 'Business and Consultance.')}
                    </EditableText>
                </p>
            </div>
            <section className="space-y-10">
                {chamberContent.length > 0 ? (
                    chamberContent.map((item) => (
                        <p key={item.id} className="text-xl max-md:text-base font-light">
                            {item.content ?? ""}
                        </p>
                    ))
                ) : (
                    <p className="text-xl max-md:text-base font-light text-gray-500 text-center py-10">
                        Content coming soon.
                    </p>
                )}
            </section>
        </div>
    );
}
