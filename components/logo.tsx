import Image from "next/image";
import React from "react";

const Logo = ({ width, height }: { width?: number; height?: number }) => {
  return (
    <Image
      src="/logo.svg"
      width={width ? width : 150}
      height={height ? height : 9}
      alt="Amea logo"
    />
  );
};

export default Logo;
