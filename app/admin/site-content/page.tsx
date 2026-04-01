import { redirect } from "next/navigation";
import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { SiteContent } from "@/lib/types";
import { SITE_CONTENT_SECTIONS } from "@/lib/types";
import SiteContentClient from "./site-content-client";

export default async function SiteContentAdminPage() {
  const [profile, data] = await Promise.all([
    getAdminProfile(),
    fetchServerData<SiteContent[]>("/api/admin/site-content"),
  ]);

  if (!profile || !hasPermission(profile, "site_content")) {
    redirect("/admin");
  }

  return <SiteContentClient entries={data ?? []} sections={SITE_CONTENT_SECTIONS} />;
}
