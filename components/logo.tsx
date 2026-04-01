import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({ width, height }: { width?: number; height?: number }) => {
  const resolvedWidth = width ?? 127;
  const resolvedHeight = height ?? 53;

  return (
    <Link href="/">
      <Image
        src="/logo.svg"
        width={resolvedWidth}
        height={resolvedHeight}
        alt="Amea logo"
        loading="eager"
        priority
        style={{ width: "auto", height: "auto" }}
      />
    </Link>
  );
};

export default Logo;
