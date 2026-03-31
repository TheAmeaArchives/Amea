import { fetchServerData } from "@/lib/backend/server-api";
import { getSiteContent } from "@/lib/content";
import type { GalleryItem } from "@/lib/types";
import { GalleryPageClient } from "./gallery-client";

const Gallery = async () => {
  const content = await getSiteContent();
  const payload = await fetchServerData<{
    items: GalleryItem[];
    featured_item: GalleryItem | null;
  }>("/api/public/gallery");
  const items = payload?.items ?? [];
  const featuredItem = payload?.featured_item ?? null;

  return (
    <GalleryPageClient 
      content={content} 
      items={items}
      featuredItem={featuredItem}
    />
  );
};

export default Gallery;
