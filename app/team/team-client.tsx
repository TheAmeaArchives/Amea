"use client";

import TeamText from "@/components/team-text-bg";
import type { TeamMember, Contributor, SiteContentMap } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { EditableText } from "@/components/admin/editable-text";

interface TeamPageClientProps {
    content: SiteContentMap;
    collaborators: TeamMember[];
    contributors: Contributor[];
    supportersList: { name: string; path: string; href: string }[];
}

export function TeamPageClient({ content, collaborators, contributors, supportersList }: TeamPageClientProps) {
    const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;

    return (
        <div className="min-h-screen font-light md:-translate-y-10 lg:-translate-y-20 relative">
            <section className="max-md:hidden">
                <TeamText content={content} />
            </section>
            <div className="flex flex-col gap-16">
                <div className="flex flex-col gap-10">
                    <h1 className="text-5xl font-bold akira">
                        <EditableText
                            contentKey="team_page_title"
                            defaultValue={getContentValue('team_page_title', 'OUR TEAM')}
                        >
                            {getContentValue('team_page_title', 'OUR TEAM')}
                        </EditableText>
                    </h1>
                    <p className="text-xl font-light max-w-4xl">
                        <EditableText
                            contentKey="team_page_description"
                            defaultValue={getContentValue('team_page_description', 'We are in 2500 BC, Egypt...')}
                            multiline
                        >
                            {getContentValue('team_page_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge and experience to mold and piece together humble blocks of stones to build up what would be-till today-one of the most majestic structures on Earth: The Great Pyramids.')}
                        </EditableText>
                    </p>
                </div>
                <div className="flex flex-col gap-16">
                    <div className="flex flex-col gap-10">
                        <h1 className="text-5xl font-bold akira">
                            <EditableText
                                contentKey="team_collaborators_title"
                                defaultValue={getContentValue('team_collaborators_title', 'OUR COLLABORATORS')}
                            >
                                {getContentValue('team_collaborators_title', 'OUR COLLABORATORS')}
                            </EditableText>
                        </h1>
                        <p className="text-xl font-light max-w-4xl">
                            <EditableText
                                contentKey="team_collaborators_description"
                                defaultValue={getContentValue('team_collaborators_description', 'We are in 2500 BC, Egypt...')}
                                multiline
                            >
                                {getContentValue('team_collaborators_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents.')}
                            </EditableText>
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto w-full grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 relative">
                        {collaborators.length > 0 ? (
                            collaborators.map((collab, i) => (
                                <div key={collab.id} className={`relative h-48 sm:h-56 md:h-72${i >= 2 ? " max-md:hidden" : ""}`}>
                                    <Image
                                        src={collab.image_url ?? "/girl.svg"}
                                        alt={collab.name}
                                        className="object-cover"
                                        fill
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 md:col-span-3 flex flex-col items-center justify-center py-16 text-center">
                                <p className="text-lg text-gray-500 aileron">No collaborators listed yet.</p>
                            </div>
                        )}
                        {collaborators.length > 0 && (
                            <Link
                                href={"#"}
                                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 bg-white rounded-full absolute top-1/2 md:top-auto md:bottom-5 -right-3 sm:-right-5 md:-right-7 -translate-y-1/2 md:translate-y-0 shadow-[0px_0px_5px_5px_rgba(0,0,0,0.15)] z-20 center"
                            >
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-default cursor-pointer" />
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-16">
                    <div className="flex flex-col gap-10">
                        <h1 className="text-5xl font-bold akira">
                            <EditableText
                                contentKey="team_contributors_title"
                                defaultValue={getContentValue('team_contributors_title', 'OUR CONTRIBUTORS')}
                            >
                                {getContentValue('team_contributors_title', 'OUR CONTRIBUTORS')}
                            </EditableText>
                        </h1>
                        <p className="text-xl font-light max-w-4xl">
                            <EditableText
                                contentKey="team_contributors_description"
                                defaultValue={getContentValue('team_contributors_description', 'We are in 2500 BC, Egypt...')}
                                multiline
                            >
                                {getContentValue('team_contributors_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents.')}
                            </EditableText>
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto w-full grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 relative">
                        {contributors.length > 0 ? (
                            contributors.map((contributor, i) => (
                                <a href={`/contributors/${contributor.id}`} className="block w-full" key={contributor.id}>
                                    <div className={`relative h-48 sm:h-56 md:h-72${i >= 2 ? " max-md:hidden" : ""}`}>
                                        <Image
                                            src={contributor.image_url ?? "/girl.svg"}
                                            alt={contributor.name}
                                            className="object-cover"
                                            fill
                                        />
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className="col-span-2 md:col-span-3 flex flex-col items-center justify-center py-16 text-center">
                                <p className="text-lg text-gray-500 aileron">No contributors listed yet.</p>
                            </div>
                        )}
                        {contributors.length > 0 && (
                            <a
                                href={"/contributors"}
                                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 bg-white rounded-full absolute top-1/2 md:top-auto md:bottom-5 -right-3 sm:-right-5 md:-right-7 -translate-y-1/2 md:translate-y-0 z-10 shadow-[0px_0px_5px_5px_rgba(0,0,0,0.15)] center"
                            >
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-default cursor-pointer" />
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-16">
                    <div className="flex flex-col gap-10">
                        <h1 className="text-5xl font-bold akira">
                            <EditableText
                                contentKey="team_supporters_title"
                                defaultValue={getContentValue('team_supporters_title', 'OUR SUPPORTERS')}
                            >
                                {getContentValue('team_supporters_title', 'OUR SUPPORTERS')}
                            </EditableText>
                        </h1>
                        <p className="text-xl font-light max-w-4xl">
                            <EditableText
                                contentKey="team_supporters_description"
                                defaultValue={getContentValue('team_supporters_description', 'We are in 2500 BC, Egypt...')}
                                multiline
                            >
                                {getContentValue('team_supporters_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents.')}
                            </EditableText>
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto w-full gap-3 sm:gap-4 md:gap-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center">
                        {[...supportersList, ...supportersList].map((supporter, i) => (
                            <Link
                                className="relative h-[60px] sm:h-[80px] md:h-[100px] w-full lg:w-auto lg:flex-1 lg:min-w-[120px] lg:max-w-[180px]"
                                key={`${supporter.name}-${i}`}
                                href={supporter.href}
                                target="_blank"
                            >
                                <Image
                                    alt={`Amea ${supporter.name} supporter`}
                                    src={supporter.path}
                                    fill
                                    className="grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer object-contain"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-10">
                    <h1 className="text-5xl font-bold akira">
                        <EditableText
                            contentKey="team_be_part_title"
                            defaultValue={getContentValue('team_be_part_title', 'BE PART')}
                        >
                            {getContentValue('team_be_part_title', 'BE PART')}
                        </EditableText>
                    </h1>
                    <p className="text-xl font-light max-w-4xl italic">
                        <EditableText
                            contentKey="team_be_part_text"
                            defaultValue={getContentValue('team_be_part_text', 'You too can pose your block on this edifice. Just click')}
                        >
                            {getContentValue('team_be_part_text', 'You too can pose your block on this edifice. Just click')}
                        </EditableText>{" "}
                        <Link href="/contact" className="text-default hover:underline">
                            here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
