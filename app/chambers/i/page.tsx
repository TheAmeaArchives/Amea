import { fetchServerData } from "@/lib/backend/server-api";
import { getSiteContent } from "@/lib/content";
import type { Experiment } from "@/lib/types";
import { ChamberOneClient } from "./chamber-one-client";

const ChamberOne = async () => {
    const content = await getSiteContent();

    const experiments = await fetchServerData<Experiment[]>(
        "/api/v1/public/experiments?published=true&chamber=i"
    );

    return <ChamberOneClient content={content} experiments={experiments ?? []} />;
};

export default ChamberOne;
