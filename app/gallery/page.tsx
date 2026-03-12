import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/content";
import type { GalleryItem } from "@/lib/types";
import { GalleryPageClient } from "./gallery-client";

const Gallery = async () => {
  const supabase = createClient();
  const content = await getSiteContent();
  
  const { data: items } = await supabase
    .from("gallery_items")
    .select("*")
    .order("order_index", { ascending: true });

  return <GalleryPageClient content={content} items={(items as GalleryItem[]) ?? []} />;
};

export default Gallery;
