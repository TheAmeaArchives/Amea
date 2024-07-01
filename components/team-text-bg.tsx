import React from "react";

const TeamText = () => {
  return (
    <div className="team-screen center h-[603px] border-black/50 relative overflow-hidden">
      <p className="text-center text-[40px]  font-semibold aileron">
        Different shades <br /> of{" "}
        <span className="relative after:absolute after:bg-default after:w-full after:h-1/3 after:left-0 after:bottom-[3px] after:-z-10">
          Red
        </span>
      </p>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col editor-font text-[32px]">
        <div className="p-5 flex-1 relative">
          <p className=" anim  w-fit absolute top-10 right-1/3">Students</p>
          <p className="anim absolute bottom-0 left-40">Writers</p>
        </div>
        <div className="p-5 flex-1  max-w-[80%] mx-auto w-full relative">
          <p className="anim absolute  left-40 ">Speakers</p>

          <p className="anim absolute -top-4 left-0 w-fit right-0 mx-auto text-center">
            Engineers
          </p>
          <p className="anim absolute right-40">Educator</p>
        </div>
        <div className="p-5 flex-1  flex flex-col gap-1">
          <p className="anim flex- flex">Researchers</p>
          <p className="anim flex-1  flex self-end">Professors</p>
        </div>
        <div className="p-5 flex-1 max-w-[80%] w-full center flex flex-col relative">
          <p className="anim absolute top-0 left-5">Changers</p>
          <p className="anim">Doctors</p>
          <p className="anim absolute right-0 top-0">Entrepreneurs</p>
        </div>
        <div className="p-5 flex-1 max-w-[50%] self-end w-full relative">
          <p className="anim absolute bottom-0 ">Designers</p>
          <p className="anim absolute right-40 top-0">Marketers</p>
        </div>
      </div>
    </div>
  );
};

export default TeamText;
