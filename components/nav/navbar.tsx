"use client";

import React, { useState } from "react";
import Logo from "../logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Hamburger from "./hamburger";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div
      className={cn("fixed top-0 w-full h-20 bg-white", {
        hidden: pathname === "/",
      })}
    >
      <nav className="max-width h-full items-center flex justify-between px-5">
        <Logo />
        <Hamburger lone />
      </nav>
    </div>
  );
};

export default Navbar;
