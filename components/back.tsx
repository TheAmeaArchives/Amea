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
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
};

export default Back;
