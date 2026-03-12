import { supporters as fallbackSupporters } from "@/constants";
import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/content";
import type { TeamMember, Contributor, Supporter } from "@/lib/types";
import { TeamPageClient } from "./team-client";

const Teams = async () => {
    const supabase = createClient();
    const content = await getSiteContent();

    const [collaboratorsRes, contributorsRes, supportersRes] = await Promise.all([
        supabase
            .from("team_members")
            .select("*")
            .eq("member_type", "collaborator")
            .order("order_index"),
        supabase
            .from("contributors")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(6),
        supabase
            .from("supporters")
            .select("*")
            .order("order_index"),
    ]);

    const collaborators = (collaboratorsRes.data as TeamMember[] | null) ?? [];
    const contributors = (contributorsRes.data as Contributor[] | null) ?? [];
    const dbSupporters = (supportersRes.data as Supporter[] | null) ?? [];

    const hasSupporters = dbSupporters.length > 0;
    const supportersList = hasSupporters
        ? dbSupporters.map((s) => ({ name: s.name, path: s.logo_url ?? "", href: s.website_url ?? "#" }))
        : fallbackSupporters.map((s) => ({ name: s.name, path: s.path, href: s.path }));

    return (
        <TeamPageClient 
            content={content}
            collaborators={collaborators}
            contributors={contributors}
            supportersList={supportersList}
        />
    );
};

export default Teams;
