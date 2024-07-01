import Back from "@/components/back";
import React, { ReactNode } from "react";

const ChambersLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-4 ">
      <Back />
      <div>{children}</div>
    </div>
  );
};

export default ChambersLayout;
