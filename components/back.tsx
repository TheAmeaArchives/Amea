"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Back = () => {
  const router = useRouter();
  return (
    <button
      className="h-10 w-10 center duration-300 transition-all"
      onClick={() => router.back()}
    >
      <ArrowLeft className="w-9 h-9 md:w-14 md:h-14" />
    </button>
  );
};

export default Back;
