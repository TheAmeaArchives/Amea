import About from "@/components/about";
import Hero from "@/components/hero";
import Hamburger from "@/components/nav/hamburger";
import Image from "next/image";
import React from "react";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <About />
    </>
  );
};

export default LandingPage;
