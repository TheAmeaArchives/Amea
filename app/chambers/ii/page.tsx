import { createClient } from "@/lib/supabase/server";
import type { ChamberStat, ChamberBelief } from "@/lib/types";
import ChamberTwoClient from "./chamber-two-client";

const ChamberTwoPage = async () => {
    const supabase = createClient();

    const [statsRes, beliefsRes] = await Promise.all([
        supabase
            .from("chamber_stats")
            .select("*")
            .eq("chamber", "ii")
            .order("order_index"),
        supabase
            .from("chamber_beliefs")
            .select("*")
            .eq("chamber", "ii")
            .order("order_index"),
    ]);

    const chamberStats = (statsRes.data as ChamberStat[] | null) ?? [];
    const chamberBeliefs = (beliefsRes.data as ChamberBelief[] | null) ?? [];

    const stats = chamberStats.map((s) => ({ count: s.value, text: s.label }));
    const beliefs = chamberBeliefs.map((b) => ({ name: b.title, description: b.content ?? "" }));

    return <ChamberTwoClient stats={stats} beliefs={beliefs} />;
};

export default ChamberTwoPage;
