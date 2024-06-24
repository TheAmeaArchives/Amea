import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({ width, height }: { width?: number; height?: number }) => {
  return (
    <Link href="/">
      <Image
        src="/logo.svg"
        width={width ? width : 150}
        height={height ? height : 9}
        alt="Amea logo"
      />
    </Link>
  );
};

export default Logo;
