import { supporters as fallbackSupporters } from "@/constants";
import { fetchServerData } from "@/lib/backend/server-api";
import { getSiteContent } from "@/lib/content";
import type { TeamMember, Contributor, Supporter } from "@/lib/types";
import { TeamPageClient } from "./team-client";

const Teams = async () => {
    const content = await getSiteContent();
    const payload = await fetchServerData<{
        team_members: TeamMember[];
        collaborators: TeamMember[];
        contributors: Contributor[];
        supporters: Supporter[];
    }>("/api/public/team");
    const teamMembers = payload?.team_members ?? [];
    const collaborators = payload?.collaborators ?? [];
    const contributors = payload?.contributors ?? [];
    const dbSupporters = payload?.supporters ?? [];

    const hasSupporters = dbSupporters.length > 0;
    const supportersList = hasSupporters
        ? dbSupporters.map((s) => ({ name: s.name, path: s.logo_url ?? "", href: s.website_url ?? "#" }))
        : fallbackSupporters.map((s) => ({ name: s.name, path: s.path, href: s.path }));

    return (
        <TeamPageClient 
            content={content}
            teamMembers={teamMembers}
            collaborators={collaborators}
            contributors={contributors}
            supportersList={supportersList}
        />
    );
};

export default Teams;
