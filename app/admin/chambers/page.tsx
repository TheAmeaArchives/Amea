import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { ChamberStat, ChamberBelief, ChamberContent } from "@/lib/types";
import ChambersClient from "./chambers-client";

export default async function ChambersAdminPage() {
  const supabase = createClient();

  const [profile, statsRes, beliefsRes, contentRes] = await Promise.all([
    getAdminProfile(),
    supabase.from("chamber_stats").select("*").order("order_index"),
    supabase.from("chamber_beliefs").select("*").order("order_index"),
    supabase.from("chamber_content").select("*").eq("chamber", "iii").order("section"),
  ]);

  if (!profile || !hasPermission(profile, "chambers")) {
    redirect("/admin");
  }

  return (
    <ChambersClient
      stats={(statsRes.data as ChamberStat[]) ?? []}
      beliefs={(beliefsRes.data as ChamberBelief[]) ?? []}
      content={(contentRes.data as ChamberContent[]) ?? []}
    />
  );
}
