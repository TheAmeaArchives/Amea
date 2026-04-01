import { redirect } from "next/navigation";
import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { Program } from "@/lib/types";
import ProgramsClient from "./programs-client";

export default async function ProgramsAdminPage() {
  const [profile, data] = await Promise.all([
    getAdminProfile(),
    fetchServerData<Program[]>("/api/admin/programs"),
  ]);

  if (!profile || !hasPermission(profile, "programs")) {
    redirect("/admin");
  }

  return <ProgramsClient programs={data ?? []} />;
}
