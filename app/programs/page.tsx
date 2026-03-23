import { fetchServerData } from "@/lib/backend/server-api";
import { getSiteContent } from "@/lib/content";
import type { Program } from "@/lib/types";
import { ProgramsPageClient } from "./programs-client";

const Programs = async () => {
    const content = await getSiteContent();
    const data = await fetchServerData<Program[]>("/api/v1/public/programs");

    return <ProgramsPageClient content={content} programs={data ?? []} />;
};

export default Programs;
