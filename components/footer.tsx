"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer
      className={cn("h-20 w-full bg-emerald-500", {
        hidden: pathname === "/",
      })}
    >
      <div className="h-20 max-width bg-black xl:p-0 px-4">
        <div className="bg-red-500 h-full w-full"></div>
      </div>
    </footer>
  );
};

export default Footer;
