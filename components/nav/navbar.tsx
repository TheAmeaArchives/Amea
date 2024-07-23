"use client";

import React, { useState } from "react";
import Logo from "../logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Hamburger from "./hamburger";
import { navItems } from "@/constants";
import Link from "next/link";
import Footer from "@/components/footer";

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  return (
      <>
          <div className={cn("fixed top-0 w-full h-20 bg-white max-sm:px-[30px] px-[100px]", {
              "z-[100]": !isActive,
              "nav-active": isActive
          })}>
              <nav className="h-full items-center flex justify-between  relative overflow-hidden">
                  <Logo />
                  <Links isActive={isActive} />
                  <MobileLinks isActive={isActive} />
                  <Hamburger setIsActive={setIsActive} isActive={isActive} />
              </nav>
          </div>
      </>
  );
};

const Links = ({ isActive }: { isActive: boolean }) => {
  const pathname = usePathname();
  return (
      <>
          {/*Desktop view*/}
          <div
              className={cn(
                  "flex-1 max-sm:hidden absolute w-[65%] h-full left-0 center right-0 top-[-80px] m-auto transition-all duration-300",
                  {
                      "top-[0px]": isActive,
                  }
              )}
          >
              <ul className="w-full flex justify-around">
                  {navItems.map((item) => {
                      //some code here
                      const isActive = pathname === item.href;
                      return (
                          <li
                              className={cn("relative transition-all duration-300 link", {
                                  "after:bg-default after:h-[2px] after:left-0 after:transition-all after:duration-300 after:w-1/2 after:bottom-0 after:absolute after:hover:w-full":
                                  isActive,
                              })}
                              key={item.title}
                          >
                              <Link href={item.href} className={cn("capitalize ")}>
                                  {item.title}
                              </Link>
                          </li>
                      );
                  })}
              </ul>
          </div>
      </>
  );
};

const MobileLinks = ({ isActive }: { isActive: boolean }) => {
    const pathname = usePathname();
    return (
        // Mobile view
        <div
            className={cn("sm:hidden", {
                "max-sm:hidden": !isActive,
                "requires-no-scroll": isActive
            })}
        >
                <div
                    className={cn("fixed overflow-y-hidden inset-0 bg-white/90 w-screen h-screen transition-all duration-300 ease-in-out"
                    )}
                >
                    <ul className="flex flex-col gap-y-5 ml-10 mt-20 w-full z-[100]">
                        {navItems.map((item) => {
                            //some code here
                            const isActive = pathname === item.href;
                            return (
                                <li
                                    className={cn("aileron font-normal relative transition-all duration-300 link", {
                                        "after:bg-default after:h-[2px] after:left-0 after:transition-all after:duration-300 after:w-1/2 after:bottom-0 after:absolute after:hover:w-full":
                                        isActive,
                                    })}
                                    key={item.title}
                                >
                                    <Link href={item.href} className={cn("uppercase text-xl")}>
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="absolute top-[75%] flex justify-center w-full hover:text-red-500"><Footer /></div>
                </div>
        </div>

    );
};

export default Navbar;
