import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { TeamMember, Contributor } from "@/lib/types";
import TeamClient from "./team-client";

export default async function TeamAdminPage() {
  const supabase = createClient();

  // Fetch auth and all data in parallel
  const [profile, teamRes, collabRes, contribRes] = await Promise.all([
    getAdminProfile(),
    supabase.from("team_members").select("*").eq("member_type", "team").order("order_index"),
    supabase.from("team_members").select("*").eq("member_type", "collaborator").order("order_index"),
    supabase.from("contributors").select("*").order("name"),
  ]);

  if (!profile || !hasPermission(profile, "team")) {
    redirect("/admin");
  }

  return (
    <TeamClient
      teamMembers={(teamRes.data as TeamMember[]) ?? []}
      collaborators={(collabRes.data as TeamMember[]) ?? []}
      contributors={(contribRes.data as Contributor[]) ?? []}
    />
  );
}
