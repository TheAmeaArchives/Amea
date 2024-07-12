"use client";
import { cn } from "@/lib/utils";
import "./style.scss";

export default function Hamburger({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (content: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "h-11 w-11  cursor-pointer hamburger center overflow-hidden transition-all duration-150", {
            "max-sm:z-50": isActive
          }
      )}
      onClick={() => setIsActive(!isActive)}
    >
      <div className="content  flex flex-col justify-evenly center relative">
        <div
          className={cn("bg-default transition-all duration-150", {
            "absolute h-full bg-black -rotate-45 bottom-3": isActive,
          })}
        />
        <div
          className={cn(
            "bg-default -translate-x-2 transition-all duration-150",
            {
              "-translate-x-[35.2px]": isActive,
            }
          )}
        />
        <div
          className={cn("bg-default transition-all duration-150", {
            "absolute h-full bg-black rotate-45 bottom-3": isActive,
          })}
        />
      </div>
    </div>
  );
}
