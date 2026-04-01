import Image from "next/image";
import React from "react";
import { getSiteContent, getContent } from "@/lib/content";
import { AboutClient } from "./about-client";

const About = async () => {
  const content = await getSiteContent();

  return <AboutClient content={content} />;
};

export default About;
