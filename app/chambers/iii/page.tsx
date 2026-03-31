import { fetchServerData } from "@/lib/backend/server-api";
import { getSiteContent } from "@/lib/content";
import type { ChamberContent } from "@/lib/types";
import { ChamberThreeClient } from "./chamber-three-client";

const ChamberThree = async () => {
    const content = await getSiteContent();
    const data = await fetchServerData<ChamberContent[]>("/api/public/chambers/iii/content");

    return <ChamberThreeClient content={content} chamberContent={data ?? []} />;
};

export default ChamberThree;
