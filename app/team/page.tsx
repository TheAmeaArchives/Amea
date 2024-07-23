import TeamText from "@/components/team-text-bg";
import { supporters } from "@/constants";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Teams = () => {
    return (
        <div className="min-h-screen font-light -translate-y-20 max-md:mt-24 relative">
            <section className="max-md:hidden">
                <TeamText />
            </section>
            <div className="flex flex-col gap-16">
                <div className="flex flex-col gap-10">
                    <h1 className="text-5xl max-md:text-2xl font-bold akira">OUR TEAM</h1>
                    <p className="text-xl max-md:text-base font-light  max-w-4xl">
                        We are in 2500 BC, Egypt. About 30,000 of the best craftsmen,
                        sculptors and other skilled workers of the time use their combined
                        talents, knowledge and experience to mold and piece together humble
                        blocks of stones to build up what would be-till today-one of the
                        most majestic structures on Earth: The Great Pyramids.
                    </p>
                </div>
                <div className="flex flex-col gap-16">
                    <div className="flex flex-col gap-10">
                        <h1 className="text-5xl max-md:text-2xl font-bold akira">OUR COLLABORATORS</h1>
                        <p className="text-xl max-md:text-base font-light  max-w-4xl">
                            We are in 2500 BC, Egypt. About 30,000 of the best craftsmen,
                            sculptors and other skilled workers of the time use their combined
                            talents.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto w-full md:grid md:grid-cols-3 md:gap-5 max-md:space-y-7 relative">
                        <div className="relative h-72"><Image src="/girl.svg" alt="Amea project collaborator" className="object-cover" fill /></div>
                        <div className="relative h-72"><Image src="/girl.svg" alt="Amea project collaborator" className="object-cover" fill /></div>
                        <div className="relative h-72 max-md:hidden"><Image src="/girl.svg" alt="Amea project collaborator" className="object-cover" fill /></div>
                        <div className="relative h-72 max-md:hidden"><Image src="/girl.svg" alt="Amea project collaborator" className="object-cover" fill /></div>
                        <div className="relative h-72 max-md:hidden"><Image src="/girl.svg" alt="Amea project collaborator" className="object-cover" fill /></div>
                        <div className="relative h-72 max-md:hidden"><Image src="/girl.svg" alt="Amea project collaborator" className="object-cover" fill /></div>
                        <Link
                            href={"#"}
                            className="h-14 w-14 bg-white rounded-full absolute max-md:top-1/2 md:bottom-5 -right-7 max-md:-translate-y-[60px] shadow-[0px_0px_5px_5px_rgba(0,0,0,0.15)] z-20 center"
                        >
                            <ArrowRight className="w-7 h-7 text-default cursor-pointer" />
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-16">
                    <div className="flex flex-col gap-10">
                        <h1 className="text-5xl max-md:text-2xl font-bold akira">OUR CONTRIBUTORS</h1>
                        <p className="text-xl max-md:text-base font-light  max-w-4xl">
                            We are in 2500 BC, Egypt. About 30,000 of the best craftsmen,
                            sculptors and other skilled workers of the time use their combined
                            talents.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto w-full md:grid md:grid-cols-3 md:gap-5 max-md:space-y-7 relative">
                        <div className="relative h-72"><Image src="/girl.svg" alt="Amea project contributor" className="object-cover" fill /></div>
                        <div className="relative h-72"><Image src="/girl.svg" alt="Amea project contributor" className="object-cover" fill /></div>
                        <div className="relative h-72 max-md:hidden"><Image src="/girl.svg" alt="Amea project contributor" className="object-cover" fill /></div>
                        <div className="relative h-72 max-md:hidden"><Image src="/girl.svg" alt="Amea project contributor" className="object-cover" fill /></div>
                        <div className="relative h-72 max-md:hidden"><Image src="/girl.svg" alt="Amea project contributor" className="object-cover" fill /></div>
                        <div className="relative h-72 max-md:hidden"><Image src="/girl.svg" alt="Amea project contributor" className="object-cover" fill /></div>
                        <Link
                            href={"/contributors"}
                            className="h-14 w-14 bg-white rounded-full absolute max-md:top-1/2 md:bottom-5 -right-7 max-md:-translate-y-[60px] z-10 shadow-[0px_0px_5px_5px_rgba(0,0,0,0.15)] center"
                        >
                            <ArrowRight className="w-7 h-7 text-default cursor-pointer" />
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-16">
                    <div className="flex flex-col gap-10">
                        <h1 className="text-5xl max-md:text-2xl font-bold akira">OUR SUPPORTERS</h1>
                        <p className="text-xl max-md:text-base font-light max-w-4xl">
                            We are in 2500 BC, Egypt. About 30,000 of the best craftsmen,
                            sculptors and other skilled workers of the time use their combined
                            talents.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto w-full gap-5 flex">
                        {[...supporters, ...supporters].map((supporter) => (
                            <Link
                                className="relative h-[100px] flex-1"
                                key={supporter.name}
                                href={supporter.path}
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
                    <h1 className="text-5xl max-md:text-2xl font-bold akira">BE PART</h1>
                    <p className="text-xl max-md:text-base font-light  max-w-4xl italic">
                        You too can pose your block on this edifice. Just click{" "}
                        <Link href="/nothing" className="text-default">
                            here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Teams;
