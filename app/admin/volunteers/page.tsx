import { redirect } from "next/navigation";
import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { VolunteerSubmission } from "@/lib/types";
import VolunteersClient from "./volunteers-client";

export default async function VolunteersAdminPage() {
  const [profile, data] = await Promise.all([
    getAdminProfile(),
    fetchServerData<VolunteerSubmission[]>("/api/v1/admin/volunteer-submissions"),
  ]);

  if (!profile || !hasPermission(profile, "volunteers")) {
    redirect("/admin");
  }

  return (
    <VolunteersClient volunteers={data ?? []} />
  );
}
