import ChamberHeader from "@/components/chambers/header";
import Search from "@/components/chambers/search";
import Link from "next/link";
import React from "react";
import {Bookmark} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Experiment } from "@/lib/types";

const ChamberOne = async () => {
    const supabase = createClient();
    const { data: experiments } = await supabase
        .from("experiments")
        .select("*")
        .eq("published", true)
        .eq("chamber", "i")
        .order("created_at", { ascending: false });

    const hasExperiments = experiments && experiments.length > 0;

    return (
        <div className="flex flex-col gap-20">
            <ChamberHeader
                title="chamber i"
                description="Insights from curated experiments."
            />
            <Search mode="BAR" />

            {hasExperiments ? (
                <>
                    {/*Mobile view of articles*/}
                    <div className="flex flex-col gap-20 md:mt-20 md:px-40 md:hidden">
                        {(experiments as Experiment[]).map((experiment) => (
                            <div
                                key={experiment.id}
                                className="relative after:absolute after:h-2 flex after:-bottom-10 gap-5 after:w-full after:left-0 after:bg-black/10  after:-z-10"
                            >
                                <div className="w-full flex min-h-24 h-full max-h-28">
                                    <div className="flex-1">
                                        <div className="flex flex-col gap-2">
                                            <Link href={`i/experiments/${experiment.slug}`} className="block">
                                                <h1 className="text-2xl line-clamp-4 font-bold aileron">
                                                    {experiment.title}
                                                </h1>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="min-h-24 h-full max-h-28 flex flex-col justify-between">
                                        {experiment.image_url ? (
                                            <img
                                                src={experiment.image_url}
                                                alt={experiment.title}
                                                className="h-[59px] w-20 object-cover"
                                            />
                                        ) : (
                                            <div className="h-[59px] w-20 bg-default" />
                                        )}
                                        <span className="w-full flex justify-end"><Bookmark className="w-5 h-5 text-default" /></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/*Desktop view of articles*/}
                    <div className="flex flex-col gap-20 mt-20 md:px-40 max-md:hidden">
                        {(experiments as Experiment[]).map((experiment) => (
                            <div
                                key={experiment.id}
                                className="relative after:absolute after:h-2 flex after:-bottom-10 gap-5 after:w-full after:left-0 after:bg-black/10  after:-z-10"
                            >
                                <div className="w-full flex h-full items-center gap-20">
                                    <div className="flex-1">
                                        <Link href={`i/experiments/${experiment.slug}`} className="block">
                                            <div className="flex flex-col gap-2">
                                                <h1 className="text-[32px] font-bold aileron">
                                                    {experiment.title}
                                                </h1>
                                            </div>
                                        </Link>
                                        <div className="flex justify-between text-zinc-500 capitalize">
                                            <span>{experiment.curator ?? ""}</span>
                                            <span>{experiment.editor ?? ""}</span>
                                        </div>
                                    </div>
                                    {experiment.image_url ? (
                                        <img
                                            src={experiment.image_url}
                                            alt={experiment.title}
                                            className="h-[155.84px] w-72 object-cover"
                                        />
                                    ) : (
                                        <div className="h-[155.84px] w-72 bg-default" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center mt-10">
                    <p className="text-xl text-gray-500 aileron">No experiments published yet.</p>
                    <p className="text-sm text-gray-400 mt-2">Check back soon for new insights.</p>
                </div>
            )}
        </div>
    );
};

export default ChamberOne;
