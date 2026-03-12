import { getSiteContent } from "@/lib/content";
import { ArchivesPageClient } from "./archives-client";

const Archives = async () => {
    const content = await getSiteContent();
    return <ArchivesPageClient content={content} />;
};

export default Archives;
