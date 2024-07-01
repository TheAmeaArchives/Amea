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
      <h1 className="text-5xl font-bold uppercase akira">{title}</h1>
      <p className="font-light text-2xl">{description}</p>

    </div>
  );
};

export default ChamberHeader;
