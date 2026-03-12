"use client";

import React, { useState } from "react";
import { Search as Icon } from "lucide-react";
import { cn } from "@/lib/utils";

const Search = ({ mode }: { mode: "ICON" | "BAR" }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="flex-1 h-fit flex justify-end">
      {mode === "ICON" && (
        <div
          className={cn(
            "h-9 sm:h-10 border border-black/80 rounded-full w-9 sm:w-10 gap-100 center overflow-hidden cursor-pointer relative duration-300 transition-all",
            { "w-full max-w-xs sm:max-w-sm md:max-w-md": clicked }
          )}
        >
          <input
            className={cn(
              "opacity-0 duration-300 transition-all pointer-events-none outline-none text-black/80 focus:outline-none focus-within:outline-none pr-10 sm:pr-11 pl-3 sm:pl-4 h-full border-none placeholder:text-black/80 text-sm sm:text-base",
              {
                "opacity-100 pointer-events-auto flex-1": clicked,
              }
            )}
            placeholder="Search..."
            type="text"
            autoFocus={clicked}
          />

          <div
            onClick={() => setClicked((prev) => !prev)}
            className="h-9 w-9 sm:h-10 sm:w-10 absolute bg-center right-0 rounded-full center text-black/80 bg-white"
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      )}
      {mode === "BAR" && (
        <div className="h-9 sm:h-10 border border-black/90 w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search..."
            className="duration-300 transition-all w-full outline-none text-black focus:outline-none focus-within:outline-none pr-10 sm:pr-11 pl-3 sm:pl-4 h-full border-none placeholder:text-black/80 text-black/80 text-sm sm:text-base"
          />
        </div>
      )}
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
