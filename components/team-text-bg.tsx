"use client";

import React from "react";
import type { SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";

interface TeamTextProps {
  content: SiteContentMap;
}

const TeamText = ({ content }: TeamTextProps) => {
  const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;

  return (
    <div className="team-screen center h-[400px] md:h-[500px] lg:h-[603px] border-black/50 relative overflow-hidden">
      <p className="text-center text-2xl md:text-3xl lg:text-[40px] font-semibold aileron z-10">
        <EditableText
          contentKey="team_hero_text_1"
          defaultValue={getContentValue('team_hero_text_1', 'Different shades')}
        >
          {getContentValue('team_hero_text_1', 'Different shades')}
        </EditableText>{" "}
        <br />{" "}
        <EditableText
          contentKey="team_hero_text_2"
          defaultValue={getContentValue('team_hero_text_2', 'of')}
        >
          {getContentValue('team_hero_text_2', 'of')}
        </EditableText>{" "}
        <span className="relative after:absolute after:bg-default after:w-full after:h-1/3 after:left-0 after:bottom-[3px] after:-z-10">
          <EditableText
            contentKey="team_hero_highlight"
            defaultValue={getContentValue('team_hero_highlight', 'Red')}
          >
            {getContentValue('team_hero_highlight', 'Red')}
          </EditableText>
        </span>
      </p>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col editor-font text-lg md:text-2xl lg:text-[32px]">
        <div className="p-3 md:p-5 flex-1 relative">
          <p className="anim w-fit absolute top-6 md:top-10 right-[25%] md:right-1/3">Students</p>
          <p className="anim absolute bottom-0 left-[10%] md:left-40">Writers</p>
        </div>
        <div className="p-3 md:p-5 flex-1 max-w-[90%] md:max-w-[80%] mx-auto w-full relative">
          <p className="anim absolute left-[10%] md:left-40">Speakers</p>
          <p className="anim absolute -top-2 md:-top-4 left-0 w-fit right-0 mx-auto text-center">
            Engineers
          </p>
          <p className="anim absolute right-[10%] md:right-40">Educator</p>
        </div>
        <div className="p-3 md:p-5 flex-1 flex flex-col gap-1">
          <p className="anim flex-1 flex">Researchers</p>
          <p className="anim flex-1 flex self-end">Professors</p>
        </div>
        <div className="p-3 md:p-5 flex-1 max-w-[90%] md:max-w-[80%] w-full center flex flex-col relative">
          <p className="anim absolute top-0 left-2 md:left-5">Changers</p>
          <p className="anim">Doctors</p>
          <p className="anim absolute right-0 top-0">Entrepreneurs</p>
        </div>
        <div className="p-3 md:p-5 flex-1 max-w-[70%] md:max-w-[50%] self-end w-full relative">
          <p className="anim absolute bottom-0">Designers</p>
          <p className="anim absolute right-[15%] md:right-40 top-0">Marketers</p>
        </div>
      </div>
    </div>
  );
};

export default TeamText;
