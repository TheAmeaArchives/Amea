"use client";

import React from "react";
import type { SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";
import ContactForm from "@/components/forms/contact";

interface ContactPageClientProps {
  content: SiteContentMap;
}

export function ContactPageClient({ content }: ContactPageClientProps) {
  const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;
  
  return (
    <div className="min-h-screen w-full flex flex-row items-start gap-16">
      <div className="flex-[1.5]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold akira">
          <EditableText
            contentKey="contact_title"
            defaultValue={getContentValue('contact_title', 'CONTACT US')}
          >
            {getContentValue('contact_title', 'CONTACT US')}
          </EditableText>
        </h1>
      </div>
      <div className="flex-1 lg:flex-[2] w-full max-w-2xl">
        <ContactForm content={content} />
      </div>
    </div>
  );
}
