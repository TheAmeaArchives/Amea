import { redirect } from "next/navigation";
import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { ContactSubmission } from "@/lib/types";
import ContactsClient from "./contacts-client";

export default async function ContactsAdminPage() {
  const [profile, data] = await Promise.all([
    getAdminProfile(),
    fetchServerData<ContactSubmission[]>("/api/v1/admin/contact-submissions"),
  ]);

  if (!profile || !hasPermission(profile, "contacts")) {
    redirect("/admin");
  }

  return <ContactsClient contacts={data ?? []} />;
}
