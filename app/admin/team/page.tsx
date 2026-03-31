import { redirect } from "next/navigation";
import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { TeamMember, Contributor } from "@/lib/types";
import TeamClient from "./team-client";

export default async function TeamAdminPage() {
  const [profile, teamRes, collabRes, contribRes] = await Promise.all([
    getAdminProfile(),
    fetchServerData<TeamMember[]>("/api/admin/team-members?member_type=team"),
    fetchServerData<TeamMember[]>("/api/admin/team-members?member_type=collaborator"),
    fetchServerData<Contributor[]>("/api/admin/contributors"),
  ]);

  if (!profile || !hasPermission(profile, "team")) {
    redirect("/admin");
  }

  return (
    <TeamClient
      teamMembers={teamRes ?? []}
      collaborators={collabRes ?? []}
      contributors={contribRes ?? []}
    />
  );
}
