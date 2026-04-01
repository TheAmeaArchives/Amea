import { redirect } from "next/navigation";
import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { Supporter } from "@/lib/types";
import SupportersClient from "./supporters-client";

export default async function SupportersAdminPage() {
  const [profile, data] = await Promise.all([
    getAdminProfile(),
    fetchServerData<Supporter[]>("/api/admin/supporters"),
  ]);

  if (!profile || !hasPermission(profile, "supporters")) {
    redirect("/admin");
  }

  return <SupportersClient supporters={data ?? []} />;
}
