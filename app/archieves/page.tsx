import Image from "next/image";
import React from "react";

const Archives = () => {
  return (
    <div className="relative ">
      <div className="h-96 justify-center gap-//5 flex flex-col text-start z-50">
        <h1 className="akira text-5xl font-bold ">
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
      <div className="absolute this">
        <Image
          src="/triangle.svg"
          alt="theAmeaarchives chamber folder"
          fill
          className=" translate-x-10 absolute "
        />
      </div>
    </div>
  );
};

export default Archives;
