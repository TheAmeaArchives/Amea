"use client";

import Link from "next/link";
import React from "react";

const ContactForm = () => {
  return (
    <div className=" flex flex-col gap-8 font-light">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-5xl editor-font">Let&apos;s talk</h1>
        <p className="">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam esse
          quibusdam exercitationem aliquid minus ab ratione corrupti corporis?
          Porro est, modi ipsa quidem enim at perspiciatis quo saepe. Saepe,
          doloribus!
        </p>
        <Link href="mailto:ameaarchieves@gmail.com">
          ameaachieves....@gmail.com
        </Link>
      </div>
      <form className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <p>Name</p>
          <input className="border-1 border rounded-sm outline-none p-2 focus:border-default transition-all" />
        </div>
        <div className="flex flex-col gap-2">
          <p>E-mail</p>
          <input className="border-1 border rounded-sm outline-none p-2 focus:border-default transition-all" />
        </div>
        <div className="flex flex-col gap-2">
          <p>Name</p>
          <textarea className="border-1 border rounded-sm outline-none p-2 resize-none h-64 focus:border-default transition-all" />
        </div>
        <div className="flex justify-end">
          <button className="p-[5px] px-6 bg-default text-white rounded-sm font-medium">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
