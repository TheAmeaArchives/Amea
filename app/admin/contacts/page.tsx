import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { ContactSubmission } from "@/lib/types";
import ContactsClient from "./contacts-client";

export default async function ContactsAdminPage() {
  const supabase = createClient();

  const [profile, { data }] = await Promise.all([
    getAdminProfile(),
    supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
  ]);

  if (!profile || !hasPermission(profile, "contacts")) {
    redirect("/admin");
  }

  return <ContactsClient contacts={(data as ContactSubmission[]) ?? []} />;
}
