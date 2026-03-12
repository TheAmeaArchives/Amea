import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/content";
import type { Experiment } from "@/lib/types";
import { ChamberOneClient } from "./chamber-one-client";

const ChamberOne = async () => {
    const supabase = createClient();
    const content = await getSiteContent();
    
    const { data: experiments } = await supabase
        .from("experiments")
        .select("*")
        .eq("published", true)
        .eq("chamber", "i")
        .order("created_at", { ascending: false });

    return <ChamberOneClient content={content} experiments={(experiments as Experiment[]) ?? []} />;
};

export default ChamberOne;
