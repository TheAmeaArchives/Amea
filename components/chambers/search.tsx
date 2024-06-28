"use client";

import React, { useState } from "react";
import { Search as Icon } from "lucide-react";
import { cn } from "@/lib/utils";

const Search = ({ mode }: { mode: "ICON" | "BAR" }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="flex-1 items-center flex justify-end">
      <div
        className={cn(
          "h-10 border rounded-full w-10 gap-100 center overflow-hidden cursor-pointer relative duration-300 transition-all",
          { "w-full": clicked }
        )}
      >
        <input
          className={cn(
            "opacity-0 duration-300 transition-all pointer-events-none  outline-none text-black focus:outline-none focus-within:outline-none pr-11 pl-4 h-full border-none",
            {
              "opacity-100 pointer-events-auto flex-1": clicked,
            }
          )}
          autoFocus={clicked}
        />

        <div
          onClick={() => setClicked((prev) => !prev)}
          className="h-10 w-10 absolute bg-center right-0 rounded-full center text-border bg-white"
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default Search;

{
  /* <input
  className={cn(
    "opacity-0 duration-300 transition-all pointer-events-none  outline-none text-black focus:outline-none focus-within:outline-none px-5 h-full border-none",
    {
      "opacity-100 pointer-events-auto flex-1": clicked,
    }
  )}
  autoFocus={clicked}
/>; */
}
