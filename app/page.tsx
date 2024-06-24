import Hamburger from "@/components/nav/hamburger";
import Image from "next/image";
import React from "react";

const LandingPage = () => {
  return (
    <div className="w-full h-screen center flex-col gap-8 font-primary">
      <div className="absolute top-20 left-0  h-96 w-96 2xl:h-[500px] 2xl:w-[500px]">
        <Image src="/path1.svg" alt="Amea hero path one" fill className="" />
      </div>
      <h1 className="text-5xl text-center font-bold">
        The Amea <br /> Archives
      </h1>
      <span className="w-1 bg-black h-36 rounded" />
      <div className="absolute bottom-0 right-0 h-96 w-96 2xl:h-[500px] 2xl:w-[500px] overflow-hidden">
        <Image
          src="/path2.svg"
          alt="Amea hero path one"
          className="absolute right-0  translate-x-3 translate-y-3"
          fill
        />
      </div>
      <Hamburger lone />
    </div>
  );
};

export default LandingPage;
