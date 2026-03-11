import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { SiteContent } from "@/lib/types";
import SiteContentClient from "./site-content-client";

export default async function SiteContentAdminPage() {
  const supabase = createClient();

  const [profile, { data }] = await Promise.all([
    getAdminProfile(),
    supabase.from("site_content").select("*").order("key"),
  ]);

  if (!profile || !hasPermission(profile, "site_content")) {
    redirect("/admin");
  }

  return <SiteContentClient entries={(data as SiteContent[]) ?? []} />;
}
