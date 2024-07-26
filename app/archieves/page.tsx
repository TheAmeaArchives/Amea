import Image from "next/image";
import Link from "next/link";
import React from "react";

const Archives = () => {
    return (
        <div className="">
            <div className="h-96 justify-center gap-5 max-md:gap-y-12 flex flex-col text-start z-50">
                <h1 className="akira md:text-5xl text-2xl max-md:w-72 font-bold md:mt-24">
                    How the pyramids <br /> were built <br className="md:hidden" /> ( Kind of )
                </h1>
                <p className="max-w-xl font-light">
                    We are in 2500 BC, Egypt. About 30,000 of the best craftsmen,
                    sculptors and other skilled workers of the time use their combined
                    talents, knowledge and experience to mold and piece together humble
                    blocks of stones to build up what would be-till today-one of the most
                    majestic structures on Earth: The Great Pyramids.
                </p>
            </div>

            {/*Desktop view*/}
            <div className="absolute this overflow-hidden max-md:hidden font-light aileron">
                <Image
                    src="/triangle.svg"
                    alt="theAmeaarchives chamber folder"
                    fill
                    className=" translate-x-10 absolute object-contain"
                />

                <div className="absolute bottom-0 right-0 w-[63%]  h-1/2">
                    <div className="relative h-full w-full">
                        <div className="circle absolute right-0 center">
                            <a href={"/chambers/i"} className="text-white">
                                Chamber I
                            </a>
                        </div>
                        <div className="circle absolute top-0 bottom-0 bg-black my-auto center">
                            <a href={"/chambers/ii"} className="text-white">
                                Chamber II
                            </a>
                        </div>
                        <div className="absolute bottom-20 right-4">
                            <a href={`/chambers/iii`} className="text-white">
                                Chamber III
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/*Mobile view*/}
            <div className="h-[450px] mt-5 relative overflow-hidden md:hidden aileron font-light -right-9">
                <Image
                    src="/triangle1.svg"
                    alt="theAmeaarchives chamber folder"
                    width={355}
                    height={350}
                    className="object-contain"
                />


                <div className="circle absolute right-0 top-14 center">
                    <a href={"/chambers/i"} className="text-white">
                        Chamber I
                    </a>
                </div>

                <div className="circle absolute left-0 bottom-28 bg-black center">
                    <a href={"/chambers/ii"} className="text-white">
                        Chamber II
                    </a>
                </div>
                <div className="absolute bottom-6 right-0 circle center">
                    <a href={`/chambers/iii`} className="text-white">
                        Chamber III
                    </a>
                </div>

            </div>
        </div>
    );
};

export default Archives;
