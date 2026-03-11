import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { Program } from "@/lib/types";
import ProgramsClient from "./programs-client";

export default async function ProgramsAdminPage() {
  const supabase = createClient();

  const [profile, { data }] = await Promise.all([
    getAdminProfile(),
    supabase.from("programs").select("*").order("order_index"),
  ]);

  if (!profile || !hasPermission(profile, "programs")) {
    redirect("/admin");
  }

  return <ProgramsClient programs={(data as Program[]) ?? []} />;
}
