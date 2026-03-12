import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/content";
import type { GalleryItem } from "@/lib/types";
import { GalleryPageClient } from "./gallery-client";

const Gallery = async () => {
  const supabase = createClient();
  const content = await getSiteContent();
  
  const [{ data: items }, { data: featuredData }] = await Promise.all([
    supabase
      .from("gallery_items")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("gallery_items")
      .select("*")
      .eq("featured", true)
      .single(),
  ]);

  const featuredItem = featuredData as GalleryItem | null;

  return (
    <GalleryPageClient 
      content={content} 
      items={(items as GalleryItem[]) ?? []} 
      featuredItem={featuredItem}
    />
  );
};

export default Gallery;
