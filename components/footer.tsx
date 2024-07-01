"use client";

import { socialLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="h-20 w-full">
      <div className="h-20 max-width  xl:p-0 px-4">
        <div className="h-full w-full flex items-center justify-center gap-5">
          {socialLinks.map((link) => (
            <Link href={link.url} target="_blank" key={link.name}>
              <Image src={link.path} alt={link.name} width={20} height={20} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
