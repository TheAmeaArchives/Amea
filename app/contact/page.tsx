import ContactForm from "@/components/forms/contact";
import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen w-full lg:center flex-col lg:flex-row ">
      <div className="flex-[1.5] gap-3 mb-8">
        <h1 className="text-5xl max-md:text-2xl font-bold akira">CONTACT US</h1>
      </div>
      <div className="flex-[2]">
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
