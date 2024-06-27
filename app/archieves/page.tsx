import Image from "next/image";
import Link from "next/link";
import React from "react";

const Archives = () => {
  return (
    <div className="">
      <div className="h-96 justify-center gap-5 flex flex-col text-start z-50">
        <h1 className="akira text-5xl font-bold mt-24">
          How the pyramids <br /> were built ( Kind of )
        </h1>
        <p className="max-w-xl font-light">
          We are in 2500 BC, Egypt. About 30,000 of the best craftsmen,
          sculptors and other skilled workers of the time use their combined
          talents, knowledge and experience to mold and piece together humble
          blocks of stones to build up what would be-till today-one of the most
          majestic structures on Earth: The Great Pyramids.
        </p>
      </div>
      <div className="absolute this overflow-hidden">
        <Image
          src="/triangle.svg"
          alt="theAmeaarchives chamber folder"
          fill
          className=" translate-x-10 absolute object-contain"
        />

        <div className="absolute bottom-0 right-0 w-[63%]  h-1/2">
          <div className="relative h-full w-full">
            <div className="circle absolute right-0 center">
              <Link href="/chambers/i" className="text-white">
                Chamber i
              </Link>
            </div>
            <div className="circle absolute top-0 bottom-0 bg-black my-auto center">
              <Link href="/chambers/ii" className="text-white">
                Chamber ii
              </Link>
            </div>
            <div className="absolute bottom-20 right-4">
              <Link href={`/chambers/iii`} className="text-white">
                Chamber iii
              </Link>
            </div>
          </div>
          {/* <div className="circle absolute" /> */}
        </div>
      </div>
    </div>
  );
};

export default Archives;
