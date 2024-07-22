import ChamberHeader from "@/components/chambers/header";
import Search from "@/components/chambers/search";
import Link from "next/link";
import React from "react";
import {Bookmark} from "lucide-react";

const ChamberOne = () => {
    return (
        <div className="flex flex-col gap-20">
            <ChamberHeader
                title="chamber i"
                description="Insights from curated experiments."
            />
            <Search mode="BAR" />

            {/*Mobile view of articles*/}
            <div className="flex flex-col gap-20 md:mt-20 md:px-40 md:hidden">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="relative after:absolute after:h-2 flex after:-bottom-10 gap-5 after:w-full after:left-0 after:bg-black/10  after:-z-10"
                    >
                        <div className="w-full flex min-h-24 h-full max-h-28">
                            <div className="flex-1">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-2xl line-clamp-4 font-bold aileron">
                                        {index % 2 === 0 ? (
                                            "'Shoking' Obidience"
                                        ) : (
                                            "The Mozart Effect | Rauscher, Shaw, Ky | Stanford University, California | 1993."
                                        )}

                                    </h1>
                                </div>
                            </div>
                            <div className="min-h-24 h-full max-h-28 flex flex-col justify-between">
                                <div className="h-[59px] w-20 bg-default" />
                                <span className="w-full flex justify-end"><Bookmark className="w-5 h-5 text-default" /></span>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/*Desktop view of articles*/}
            <div className="flex flex-col gap-20 mt-20 md:px-40 max-md:hidden">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="relative after:absolute after:h-2 flex after:-bottom-10 gap-5 after:w-full after:left-0 after:bg-black/10  after:-z-10"
                    >
                        <div className="w-full flex h-full items-center gap-20">
                            <div className="flex-1">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-[32px] font-bold aileron">
                                        &apos;Shoking&apos; Obidience
                                    </h1>
                                    <h1 className="text-[32px] font-bold aileron">
                                        | Milgram Experiment
                                    </h1>
                                </div>
                                <div className="flex justify-between text-zinc-500 capitalize">
                                    <span>tag</span>
                                    <span>tag</span>
                                    <span>tag</span>
                                </div>
                            </div>
                            <div className="h-[155.84px] w-72 bg-default" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChamberOne;
