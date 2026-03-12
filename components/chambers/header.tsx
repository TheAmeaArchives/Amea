import React from "react";

const ChamberHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase akira">{title}</h1>
      <p className="font-light text-base sm:text-lg md:text-xl lg:text-2xl">{description}</p>
    </div>
  );
};

export default ChamberHeader;
