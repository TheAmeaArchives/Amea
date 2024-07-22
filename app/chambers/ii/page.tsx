import ChamberHeader from "@/components/chambers/header";
import { constants, stats } from "@/constants";
import Link from "next/link";
import React from "react";

const ChamberTwo = () => {
  return (
    <div className="flex flex-col gap-10">
      <ChamberHeader
        title="chamber ii"
        description="A Virtual Research Center."
      />
      <div className="flex flex-col gap-y-[70px] items-center bg">
        <div className="h-full flex w-full items-center md:justify-evenly">
          {stats.map((stat) => (
            <div key={stat.text} className="text-center">
              <h2 className="editor-font text-5xl max-md:text-4xl font-bold">{stat.count}</h2>
              <p className="max-w-32 text-center text-2xl max-md:text-xl aileron font-light mt-2">
                {stat.text}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 items-center gap-y-20 md:gap-y-10">
          <div className="w-1 bg-black h-60 rounded" />
          <Link
            href="/chambers/i/volunteer"
            className="text-center w-[110px] md:w-[185px] text-default text-2xl max-md:text-lg pb-2 border-b-2 border-default"
          >
            Volunteer to participate
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-20 mt-20">
        {constants.map((constant) => (
          <div key={constant.name} className="flex flex-col gap-6">
            <h1 className="text-5xl max-md:text-2xl font-bold akira">{constant.name}</h1>
            <p className="text-xl max-md:text-base font-light">{constant.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChamberTwo;
