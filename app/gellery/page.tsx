import React from "react";

const Gallery = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="h-screen center font-primary">
        <h1 className="text-4xl font-bold">The Grand Galery</h1>
      </div>
      <div className="h-screen center font-primary">
        <h1 className="text-[32px] font-normal text-center">
          Display of projects built & impact <br /> created using our insights.
        </h1>
      </div>
      <div className="h- center font-primary">
        <div className="h-full w-full  grid grid-cols-3 gap-4 p-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="flex flex-col gap-3" key={index}>
              <div className="bg-default w-full h-56 rounded-lg" />
              <div>
                <h1 className="text-xl font-medium">Title</h1>
                <p className="text-sm text-black/70">Lorem ipsum dolor sit.</p>
                <p className="text-sm text-black/70">Lorem</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
