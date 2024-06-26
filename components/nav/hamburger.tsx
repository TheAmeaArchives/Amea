"use client";
import { cn } from "@/lib/utils";

export default function Hamburger({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (content: boolean) => void;
}) {
  return (
    <div
      className={cn("h-10 w-10 bg-black cursor-pointer")}
      onClick={() => setIsActive(!isActive)}
    >
      <div>
        <div></div>
      </div>
    </div>
  );
}
