"use client";

import { socialLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FooterProps {
  socialUrls?: Record<string, string>;
}

const Footer = ({ socialUrls }: FooterProps) => {
  const links = socialLinks.map(link => ({
    ...link,
    url: socialUrls?.[`social_${link.name.replace('-', '_')}`] || link.url
  }));

  return (
    <footer className="h-20 w-full">
      <div className="h-20 max-width xl:p-0 px-4">
        <div className="h-full w-full flex items-center justify-center gap-5">
          {links.map((link) => (
            <Link href={link.url} target="_blank" key={link.name}>
              <Image
                src={link.path}
                alt={link.name}
                width={20}
                height={20}
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
