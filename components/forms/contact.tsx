"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import React, { FormEventHandler, useState } from "react";
import type { SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";

interface ContactFormProps {
  content: SiteContentMap;
}

const ContactForm = ({ content }: ContactFormProps) => {
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

  const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 font-light">
      <div className="flex flex-col gap-3 sm:gap-4">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl editor-font">
          <EditableText
            contentKey="contact_form_title"
            defaultValue={getContentValue('contact_form_title', "Let's talk")}
          >
            {getContentValue('contact_form_title', "Let's talk")}
          </EditableText>
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          <EditableText
            contentKey="contact_form_description"
            defaultValue={getContentValue('contact_form_description', "Have a question, idea, or collaboration in mind?")}
            multiline
          >
            {getContentValue('contact_form_description', "Have a question, idea, or collaboration in mind? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.")}
          </EditableText>
        </p>
        <Link href={`mailto:${getContentValue('contact_email', 'ameaarchives@gmail.com')}`} className="text-default hover:underline text-sm sm:text-base">
          <EditableText
            contentKey="contact_email"
            defaultValue={getContentValue('contact_email', 'ameaarchives@gmail.com')}
          >
            {getContentValue('contact_email', 'ameaarchives@gmail.com')}
          </EditableText>
        </Link>
      </div>
      {submitted ? (
        <div className="py-8 sm:py-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold editor-font mb-2">Thank you!</h2>
          <p className="text-sm sm:text-base">Your message has been sent. We&apos;ll get back to you soon.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 py-2 px-6 bg-default text-white rounded-sm font-medium text-sm sm:text-base hover:bg-default/90 transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label className="text-sm sm:text-base font-medium">Name</label>
            <input
              className="border rounded-sm outline-none p-2.5 sm:p-3 text-sm sm:text-base focus:border-default transition-all"
              value={formState.name}
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label className="text-sm sm:text-base font-medium">E-mail</label>
            <input
              type="email"
              className="border rounded-sm outline-none p-2.5 sm:p-3 text-sm sm:text-base focus:border-default transition-all"
              value={formState.email}
              onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label className="text-sm sm:text-base font-medium">Message</label>
            <textarea
              className="border rounded-sm outline-none p-2.5 sm:p-3 text-sm sm:text-base resize-none h-48 sm:h-56 md:h-64 focus:border-default transition-all"
              value={formState.message}
              onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-6 sm:px-8 bg-default text-white rounded-sm font-medium text-sm sm:text-base disabled:opacity-50 hover:bg-default/90 transition-colors"
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
