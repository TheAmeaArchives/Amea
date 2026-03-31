import { fetchServerData } from "@/lib/backend/server-api";
import { getSiteContent } from "@/lib/content";
import type { ChamberStat, ChamberBelief } from "@/lib/types";
import ChamberTwoClient from "./chamber-two-client";

const ChamberTwoPage = async () => {
    const content = await getSiteContent();

    const chamberData = await fetchServerData<{
        stats: ChamberStat[];
        beliefs: ChamberBelief[];
    }>("/api/public/chambers/ii");
    const chamberStats = chamberData?.stats ?? [];
    const chamberBeliefs = chamberData?.beliefs ?? [];

    const stats = chamberStats.map((s) => ({ count: s.value, text: s.label }));
    const beliefs = chamberBeliefs.map((b) => ({ name: b.title, description: b.content ?? "" }));

    return <ChamberTwoClient stats={stats} beliefs={beliefs} content={content} />;
};

export default ChamberTwoPage;
