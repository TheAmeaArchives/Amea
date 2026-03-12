import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/content";
import type { ChamberContent } from "@/lib/types";
import { ChamberThreeClient } from "./chamber-three-client";

const ChamberThree = async () => {
    const supabase = createClient();
    const content = await getSiteContent();
    
    const { data } = await supabase
        .from("chamber_content")
        .select("*")
        .eq("chamber", "iii")
        .order("section");

    return <ChamberThreeClient content={content} chamberContent={(data as ChamberContent[]) ?? []} />;
};

export default ChamberThree;
