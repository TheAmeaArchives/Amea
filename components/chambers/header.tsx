import React from "react";

const ChamberHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-5xl max-md:text-2xl font-bold uppercase akira">{title}</h1>
      <p className="font-light max-md:text-base text-2xl">{description}</p>

    </div>
  );
};

export default ChamberHeader;
