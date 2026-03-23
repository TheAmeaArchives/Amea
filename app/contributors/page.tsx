import { fetchServerData } from "@/lib/backend/server-api";
import { getSiteContent } from "@/lib/content";
import type { Contributor } from "@/lib/types";
import { ContributorsPageClient } from "./contributors-client";

const Contributors = async () => {
    const content = await getSiteContent();
    const data = await fetchServerData<Contributor[]>("/api/v1/public/contributors");

    return <ContributorsPageClient content={content} contributors={data ?? []} />;
};

export default Contributors;
