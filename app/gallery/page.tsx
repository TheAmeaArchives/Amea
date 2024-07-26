import React from "react";

const Gallery = () => {
  return (
    <div className="flex flex-col gap-10 ">
      <div className="akira text-5xl">
        <h1>Grand</h1>
        <h1>Gallery</h1>
      </div>
      <div className="h-[500px] bg-default center">
        {/* <h1 className="text-4xl font-bold">The Grand Gallery</h1> */}
      </div>
      <div className="h-screen center ">
        <h1 className="text-[32px] max-md:text-xl font-normal text-center">
          Display of projects built & impact <br /> created using our insights.
        </h1>
      </div>
      <div className="h- center ">
        <div className="h-full w-full md:grid md:grid-cols-3 md:gap-4 max-md:space-y-11 p-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="flex flex-col gap-3" key={index}>
              <div className="bg-default w-full h-56 rounded-lg" />
              <div>
                <h1 className="text-xl font-medium">Title</h1>
                <p className="text-sm text-black/70">Lorem ipsum dolor sit.</p>
                <p className="text-sm text-black/70 max-md:hidden">Lorem</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
