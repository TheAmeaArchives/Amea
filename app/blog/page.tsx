import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/content";
import type { BlogPost } from "@/lib/types";
import { BlogPageClient } from "./blog-client";

const Blogs = async () => {
    const supabase = createClient();
    const content = await getSiteContent();
    
    const { data: posts } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

    return <BlogPageClient content={content} posts={(posts as BlogPost[]) ?? []} />;
};

export default Blogs;
