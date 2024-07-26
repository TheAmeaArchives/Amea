import React from "react";
import Search from "@/components/chambers/search";
import {ArrowRight} from "lucide-react";
import Image from "next/image";

const Programs = () => {
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
            <div className="flex max-md:flex-col md:gap-x-11 mt-20 gap-y-14">
                <div className="w-full max-md:h-[350px] bg-default md:flex-[2]" />
                <div className="flex-1 md:space-y-16">
                    <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem] max-md:mb-11">Letter from the Editor: You Are Safe Here</h1>
                    <p className="aileron font-light md:text-xl text-base max-md:mb-5">We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge and experience to mold and piece together humble blocks of stones to build up what would be-till today-one of the most majestic structures on Earth: The Great Pyramids.</p>
                    <div className="flex gap-x-2.5 "><span>KNOW MORE</span><ArrowRight className="w-4 h-4 my-auto" /></div>
                </div>
            </div>
            <div className="flex max-md:flex-col gap-y-[72px] mt-16 gap-x-[70px]">
                <div className="w-full space-y-14">
                    <div className="relative w-32 h-28 mx-auto">
                        <Image src={"/circlelayer.svg"} alt={"circle-2layer"} fill />
                    </div>
                    <div className="space-y-12">
                        <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem]">Letter from the Editor: You Are Safe Here</h1>
                        <p className="aileron font-light md:text-xl text-base">We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge.</p>
                    </div>
                </div>
                <div className="w-full space-y-14 md:mt-20">
                    <div className="relative w-32 h-28 mx-auto">
                        <Image src={"/diamondlayer.svg"} alt={"diamond-2layer"} fill />
                    </div>
                    <div className="space-y-12">
                        <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem]">Letter from the Editor: You Are Safe Here</h1>
                        <p className="aileron font-light md:text-xl text-base">We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge.</p>
                    </div>
                </div>
                <div className="w-full space-y-14">
                    <div className="relative w-32 h-28 mx-auto">
                        <Image src={"/trianglelayer.svg"} alt={"triangle-2layer"} fill />
                    </div>
                    <div className="space-y-12">
                        <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem]">Letter from the Editor: You Are Safe Here</h1>
                        <p className="aileron font-light md:text-xl text-base">We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge.</p>
                    </div>
                </div>
            </div>
            <div className="flex max-md:flex-col gap-14 mt-28">
                <div className="space-y-5 md:space-y-12">
                    <div className="w-full max-md:h-[305px] bg-default h-[354px]" />
                    <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem]">Letter from the Editor</h1>
                </div>
                <div className="space-y-5 md:space-y-12">
                    <div className="w-full max-md:h-[305px] bg-default h-[320px]" />
                    <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem]">Letter from the Editor</h1>
                </div>
                <div className="space-y-5 md:space-y-12 max-md:hidden">
                    <div className="w-full max-md:h-[305px] bg-default h-[354px]" />
                    <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem]">Letter from the Editor</h1>
                </div>
                <div className="space-y-5 md:space-y-12 max-md:hidden">
                    <div className="w-full max-md:h-[305px] bg-default h-[320px]" />
                    <h1 className="editor-font font-bold text-xl md:text-[40px] md:leading-[2.5rem]">Letter from the Editor</h1>
                </div>
            </div>

        </>
    );
};

export default Programs;
