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
        "h-10 w-10  cursor-pointer hamburger  flex flex-col justify-evenly"
      )}
      onClick={() => setIsActive(!isActive)}
    >
      <div className="" />
      <div className="" />
      <div className="" />
    </div>
  );
}
