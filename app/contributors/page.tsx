import Image from "next/image";
import Link from "next/link";
import React from "react";

const Contributors = () => {
    return (
        <>
            <div className="flex flex-col gap-10">
                <div className="w-full gap-4 flex flex-col">
                    <h1 className="text-5xl max-md:text-2xl font-bold akira w-fit">OUR CONTRIBUTORS</h1>
                    <p className="text-xl max-md:text-base font-light max-w-4xl">We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled</p>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-3 max-md:gap-y-8 gap-10">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <Link
                            href={`/member/${index + 1}`}
                            className="w-full group"
                            key={index}
                        >
                            <div className="relative w-full h-72 bg-black">
                                <Image
                                    src="/test.svg"
                                    alt="Amea project collaborator"
                                    className="object-cover"
                                    fill
                                />
                            </div>
                            <div className="flex flex-col mt-2 ">
                                <h1 className="group-hover:underline">John Rushworth </h1>
                                <span className="font-light aileron text-sm">Yaounde</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </>
    );
};

export default Contributors;
