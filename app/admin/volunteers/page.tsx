import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { VolunteerSubmission } from "@/lib/types";
import VolunteersClient from "./volunteers-client";

export default async function VolunteersAdminPage() {
  const supabase = createClient();

  const [profile, { data }] = await Promise.all([
    getAdminProfile(),
    supabase.from("volunteer_submissions").select("*").order("created_at", { ascending: false }),
  ]);

  if (!profile || !hasPermission(profile, "volunteers")) {
    redirect("/admin");
  }

  return (
    <VolunteersClient volunteers={(data as VolunteerSubmission[]) ?? []} />
  );
}
