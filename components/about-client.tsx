"use client";

import Image from "next/image";
import React from "react";
import type { SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";

interface AboutClientProps {
  content: SiteContentMap;
}

export function AboutClient({ content }: AboutClientProps) {
  const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;

  return (
    <div className="min-h-screen flex flex-col gap-80">
      <div>
        <div className="flex max-lg:flex-col lg:items-center gap-y-10 lg:justify-around">
          <div className="editor-font font-medium leading-[.9] max-lg:leading-[.8] text-[148px]">
            <h1 className="text max-lg:text-[68px]">
              <EditableText
                contentKey="home_about_heading_1"
                defaultValue={getContentValue('home_about_heading_1', 'AI.')}
              >
                {getContentValue('home_about_heading_1', 'AI.')}
              </EditableText>
            </h1>
            <h1 className="text max-lg:text-[68px]">
              <EditableText
                contentKey="home_about_heading_2"
                defaultValue={getContentValue('home_about_heading_2', 'Penicillin.')}
              >
                {getContentValue('home_about_heading_2', 'Penicillin.')}
              </EditableText>
            </h1>
            <h1 className="text max-lg:text-[68px]">
              <EditableText
                contentKey="home_about_heading_3"
                defaultValue={getContentValue('home_about_heading_3', 'Fire.')}
              >
                {getContentValue('home_about_heading_3', 'Fire.')}
              </EditableText>
            </h1>
          </div>
          <div className="flex flex-col gap-8 text-xl font-light aileron max-w-[550px]">
            <p>
              <EditableText
                contentKey="home_about_text_1"
                defaultValue={getContentValue('home_about_text_1', 'All major innovations in history have at least one thing in common; they are human-centred.')}
                multiline
              >
                {getContentValue('home_about_text_1', 'All major innovations in history have at least one thing in common; they are human-centred.')}
              </EditableText>
            </p>
            <p>
              <EditableText
                contentKey="home_about_text_2"
                defaultValue={getContentValue('home_about_text_2', 'We are in an era with no precedent in history.')}
                multiline
              >
                {getContentValue('home_about_text_2', 'We are in an era with no precedent in history.')}
              </EditableText>
            </p>
            <p>
              <EditableText
                contentKey="home_about_text_3"
                defaultValue={getContentValue('home_about_text_3', "Unfortunately, building such innovations doesn't happen naturally. It happens by design.")}
                multiline
              >
                {getContentValue('home_about_text_3', "Unfortunately, building such innovations doesn't happen naturally. It happens by design.")}
              </EditableText>
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex max-lg:flex-col lg:justify-around lg:items-center gap-10">
          <div className="lg:hidden editor-font">
            <h1 className="font-medium text text-[68px] relative flex flex-col leading-[.9]">
              <span>
                <EditableText
                  contentKey="home_innovation_heading_1"
                  defaultValue={getContentValue('home_innovation_heading_1', 'Innovation')}
                >
                  {getContentValue('home_innovation_heading_1', 'Innovation')}
                </EditableText>
              </span>
              <span>
                <EditableText
                  contentKey="home_innovation_heading_2"
                  defaultValue={getContentValue('home_innovation_heading_2', 'Behavioral')}
                >
                  {getContentValue('home_innovation_heading_2', 'Behavioral')}
                </EditableText>
              </span>
              <span>
                <EditableText
                  contentKey="home_innovation_heading_3"
                  defaultValue={getContentValue('home_innovation_heading_3', 'Science.')}
                >
                  {getContentValue('home_innovation_heading_3', 'Science.')}
                </EditableText>
              </span>
              <p className="text-default absolute text-7xl w-full h-full -top-6 left-0 center">&</p>
            </h1>
          </div>
          <div className="flex flex-col gap-8 text-xl w-full max-w-[520px] aileron font-light">
            <EditableText
              contentKey="home_innovation_text"
              defaultValue={getContentValue('home_innovation_text', 'Now this begs the question "How?" Our approach to moving forward that mission is threefold.')}
              multiline
            >
              {getContentValue('home_innovation_text', 'Now this begs the question "How?" Our approach to moving forward that mission is threefold.')}
            </EditableText>
          </div>
          <div className="max-lg:hidden editor-font">
            <h1 className="font-medium text text-[148px] relative flex flex-col gap-5 leading-[.8]">
              <span>
                <EditableText
                  contentKey="home_innovation_heading_1"
                  defaultValue={getContentValue('home_innovation_heading_1', 'Innovation')}
                >
                  {getContentValue('home_innovation_heading_1', 'Innovation')}
                </EditableText>
              </span>
              <span>
                <EditableText
                  contentKey="home_innovation_heading_2"
                  defaultValue={getContentValue('home_innovation_heading_2', 'Behavioral')}
                >
                  {getContentValue('home_innovation_heading_2', 'Behavioral')}
                </EditableText>
              </span>
              <span>
                <EditableText
                  contentKey="home_innovation_heading_3"
                  defaultValue={getContentValue('home_innovation_heading_3', 'Science.')}
                >
                  {getContentValue('home_innovation_heading_3', 'Science.')}
                </EditableText>
              </span>
              <span className="text-default absolute w-full h-full -top-16 left-0 center">
                &
              </span>
            </h1>
          </div>
        </div>
      </div>
      <div className="gap-10 center flex-col editor-font">
        <Image src="/big.svg" alt="Amea big logo" width={250} height={250} className="w-[250px] h-[250px]" />
        <p className="text-center text-3xl">
          <span className="relative after:absolute after:bg-default after:w-full after:h-1/3 after:left-0 after:bottom-[3px] after:-z-10">
            <EditableText
              contentKey="home_tagline"
              defaultValue={getContentValue('home_tagline', "It's all about insights")}
            >
              {getContentValue('home_tagline', "It's all about insights")}
            </EditableText>
          </span>
        </p>
      </div>
    </div>
  );
}
