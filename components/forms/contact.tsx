"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import React, { FormEventHandler, useState } from "react";

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      await supabase.from("contact_submissions").insert({
        name: formState.name,
        email: formState.email,
        message: formState.message,
      });
      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
    } catch {
      // Submission failed silently
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" flex flex-col gap-8 font-light">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-5xl max-md:text-2xl editor-font">Let&apos;s talk</h1>
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
      {submitted ? (
        <div className="py-10 text-center">
          <h2 className="text-2xl font-bold editor-font mb-2">Thank you!</h2>
          <p>Your message has been sent. We&apos;ll get back to you soon.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 p-[5px] px-6 bg-default text-white rounded-sm font-medium"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <p>Name</p>
            <input
              className="border-1 border rounded-sm outline-none p-2 focus:border-default transition-all"
              value={formState.name}
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>E-mail</p>
            <input
              type="email"
              className="border-1 border rounded-sm outline-none p-2 focus:border-default transition-all"
              value={formState.email}
              onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Message</p>
            <textarea
              className="border-1 border rounded-sm outline-none p-2 resize-none h-64 focus:border-default transition-all"
              value={formState.message}
              onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="p-[5px] px-6 bg-default text-white rounded-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
