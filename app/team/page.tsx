import { supporters } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Teams = () => {
  return (
    <div className="min-h-screen py-40 px-[100px]">
      <div className="h-screen center">
        <p className="text-center text-[40px] font-primary font-semibold">
          Different shades <br /> of{" "}
          <span className="relative after:absolute after:bg-default after:w-full after:h-1/3 after:left-0 after:bottom-[3px] after:-z-10">
            Red
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-10">
          <h1 className="text-5xl font-bold font-akira">OUR TEAM</h1>
          <p className="text-xl font-light font-primary max-w-4xl">
            We are in 2500 BC, Egypt. About 30,000 of the best craftsmen,
            sculptors and other skilled workers of the time use their combined
            talents, knowledge and experience to mold and piece together humble
            blocks of stones to build up what would be-till today-one of the
            most majestic structures on Earth: The Great Pyramids.
          </p>
        </div>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-10">
            <h1 className="text-5xl font-bold font-akira">OUR COLLABORATORS</h1>
            <p className="text-xl font-light font-primary max-w-4xl">
              We are in 2500 BC, Egypt. About 30,000 of the best craftsmen,
              sculptors and other skilled workers of the time use their combined
              talents.
            </p>
          </div>
          <div className="max-w-4xl mx-auto w-full grid grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="relative h-72">
                <Image src="/girl.svg" alt="Amea project collaborator" fill />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-10">
            <h1 className="text-5xl font-bold font-akira">OUR COLLABORATORS</h1>
            <p className="text-xl font-light font-primary max-w-4xl">
              We are in 2500 BC, Egypt. About 30,000 of the best craftsmen,
              sculptors and other skilled workers of the time use their combined
              talents.
            </p>
          </div>
          <div className="max-w-4xl mx-auto w-full grid grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="relative h-72">
                <Image src="/girl.svg" alt="Amea project collaborator" fill />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-10">
            <h1 className="text-5xl font-bold font-akira">OUR SUPPORTERS</h1>
            <p className="text-xl font-light font-primary max-w-4xl">
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
          <h1 className="text-5xl font-bold font-akira">BE PART</h1>
          <p className="text-xl font-light font-primary max-w-4xl italic">
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
