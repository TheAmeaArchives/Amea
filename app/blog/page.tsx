import { fetchServerData } from "@/lib/backend/server-api";
import { getSiteContent } from "@/lib/content";
import type { BlogPost } from "@/lib/types";
import { BlogPageClient } from "./blog-client";

const Blogs = async () => {
    const content = await getSiteContent();

    const posts = await fetchServerData<BlogPost[]>("/api/public/blog-posts?published=true");

    return <BlogPageClient content={content} posts={posts ?? []} />;
};

export default Blogs;
