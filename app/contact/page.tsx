import { getSiteContent } from "@/lib/content";
import { ContactPageClient } from "./contact-client";

const Contact = async () => {
  const content = await getSiteContent();
  return <ContactPageClient content={content} />;
};

export default Contact;
