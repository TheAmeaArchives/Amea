import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/content";
import type { Program } from "@/lib/types";
import { ProgramsPageClient } from "./programs-client";

const Programs = async () => {
    const supabase = createClient();
    const content = await getSiteContent();
    
    const { data } = await supabase
        .from("programs")
        .select("*")
        .order("order_index", { ascending: true });

    return <ProgramsPageClient content={content} programs={(data as Program[]) ?? []} />;
};

export default Programs;
