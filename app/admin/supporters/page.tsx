import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { Supporter } from "@/lib/types";
import SupportersClient from "./supporters-client";

export default async function SupportersAdminPage() {
  const supabase = createClient();

  const [profile, { data }] = await Promise.all([
    getAdminProfile(),
    supabase.from("supporters").select("*").order("order_index"),
  ]);

  if (!profile || !hasPermission(profile, "supporters")) {
    redirect("/admin");
  }

  return <SupportersClient supporters={(data as Supporter[]) ?? []} />;
}
