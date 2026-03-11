import React from "react";
import Search from "@/components/chambers/search";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Program } from "@/lib/types";

const iconMap: Record<string, string> = {
    circle: "/circlelayer.svg",
    diamond: "/diamondlayer.svg",
    triangle: "/trianglelayer.svg",
};

const Programs = async () => {
    const supabase = createClient();
    const { data } = await supabase
        .from("programs")
        .select("*")
        .order("order_index", { ascending: true });

    const programs = (data as Program[] | null) ?? [];
    const featuredProgram = programs.find((p) => p.featured);
    const iconPrograms = programs.filter((p) => p.icon_type && !p.featured);
    const otherPrograms = programs.filter((p) => !p.icon_type && !p.featured);

    return (
        <>
            <div className="flex gap-y-7 max-md:flex-col justify-between">
                <div className="flex-1">
                    <h1 className="text-5xl max-md:text-2xl font-bold akira">OUR PROGRAMS</h1>
                    <p className="md:text-2xl text-sm aileron font-light">
                        Insights from curated experiments.
                    </p>
                </div>
                <span className="max-md:w-full max-md:flex max-md:justify-end">
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
                        <div className="flex max-md:flex-col md:gap-x-11 mt-20 gap-y-14">
                            <div className="w-full max-md:h-[350px] bg-default md:flex-[2]" />
                            <div className="flex-1 md:space-y-16">
                                <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem] max-md:mb-11">
                                    {featuredProgram.title}
                                </h1>
                                <p className="aileron font-light md:text-xl text-base max-md:mb-5">
                                    {featuredProgram.description ?? ""}
                                </p>
                                <div className="flex gap-x-2.5">
                                    <span>KNOW MORE</span>
                                    <ArrowRight className="w-4 h-4 my-auto" />
                                </div>
                            </div>
                        </div>
                    )}

                    {iconPrograms.length > 0 && (
                        <div className="flex max-md:flex-col gap-y-[72px] mt-16 gap-x-[70px]">
                            {iconPrograms.map((program, idx) => (
                                <div
                                    key={program.id}
                                    className={`w-full space-y-14${idx === 1 ? " md:mt-20" : ""}`}
                                >
                                    <div className="relative w-32 h-28 mx-auto">
                                        <Image
                                            src={iconMap[program.icon_type ?? "circle"]}
                                            alt={`${program.icon_type}-2layer`}
                                            fill
                                        />
                                    </div>
                                    <div className="space-y-12">
                                        <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem]">
                                            {program.title}
                                        </h1>
                                        <p className="aileron font-light md:text-xl text-base">
                                            {program.description ?? ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {otherPrograms.length > 0 && (
                        <div className="flex max-md:flex-col gap-14 mt-28">
                            {otherPrograms.map((program, idx) => (
                                <div
                                    key={program.id}
                                    className={`space-y-5 md:space-y-12${idx >= 2 ? " max-md:hidden" : ""}`}
                                >
                                    <div
                                        className={`w-full max-md:h-[305px] bg-default ${
                                            idx % 2 === 0 ? "h-[354px]" : "h-[320px]"
                                        }`}
                                    />
                                    <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem]">
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
};

export default Programs;
