import ChamberHeader from "@/components/chambers/header";
import Search from "@/components/chambers/search";
import Link from "next/link";
import React from "react";

const ChamberOne = () => {
  return (
    <div className="flex flex-col gap-20">
      <ChamberHeader
        title="chamber i"
        description="Insights from curated experiments."
      />
      <Search />

      <div className="flex flex-col gap-20 mt-20">
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
