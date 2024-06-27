import Back from "@/components/back";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Contributors = () => {
  return (
    <div className="flex flex-col gap-5">
      <Back />
      <div className="flex flex-col gap-10">
        <div className="w-full gap-4 flex justify-between">
          <h1 className="text-5xl font-bold akira w-fit">OUR CONTRIBUTORS</h1>
          <div
            className={cn(
              "h-10 border rounded-full w-10 flex-col gap-100 center cursor-pointer"
            )}
          >
            <Search className="h-4 w-4 text-border" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-10">
          {Array.from({ length: 12 }).map((_, index) => (
            <Link href={`/member/${index + 1}`} className="w-full group">
              <div key={index} className="relative w-full h-72 bg-black">
                <Image
                  src="/test.svg"
                  alt="Amea project collaborator"
                  className="object-cover"
                  fill
                />
              </div>
              <div className="flex flex-col mt-2 ">
                <h1 className="group-hover:underline">John Rushworth </h1>{" "}
                <span className="font-light aileron text-sm">Yaounde</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contributors;
