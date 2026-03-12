import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/content";
import type { Contributor } from "@/lib/types";
import { ContributorsPageClient } from "./contributors-client";

const Contributors = async () => {
    const supabase = createClient();
    const content = await getSiteContent();
    
    const { data } = await supabase
        .from("contributors")
        .select("*")
        .order("created_at", { ascending: false });

    return <ContributorsPageClient content={content} contributors={(data as Contributor[]) ?? []} />;
};

export default Contributors;
