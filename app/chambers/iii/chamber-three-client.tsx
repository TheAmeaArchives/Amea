"use client";

import React from "react";
import type { ChamberContent, SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";
import { VolunteerButton } from "@/components/volunteer-form";

interface ChamberThreeClientProps {
    content: SiteContentMap;
    chamberContent: ChamberContent[];
}

export function ChamberThreeClient({ content, chamberContent }: ChamberThreeClientProps) {
    const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold uppercase akira">
                    <EditableText
                        contentKey="chamber_iii_title"
                        defaultValue={getContentValue('chamber_iii_title', 'Chamber III')}
                    >
                        {getContentValue('chamber_iii_title', 'Chamber III')}
                    </EditableText>
                </h1>
                <p className="font-light text-2xl">
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

            {/* Volunteer CTA Section */}
            <div className="flex flex-col items-center gap-6 sm:gap-8 mt-16 sm:mt-20 py-12 sm:py-16 border-t border-gray-200">
                <p className="text-lg sm:text-xl text-gray-600 text-center aileron font-light max-w-xl">
                    Want to collaborate with us on business solutions? Reach out as a volunteer.
                </p>
                <VolunteerButton label="Volunteer to collaborate" />
            </div>
        </div>
    );
}
