import { createClient } from "@/lib/supabase/server";
import type { SiteContentMap } from "@/lib/types";

export async function getSiteContent(): Promise<SiteContentMap> {
  const supabase = createClient();
  const { data } = await supabase.from("site_content").select("key, value");
  
  if (!data) return {};
  
  return Object.fromEntries(
    data.map((item) => [item.key, item.value ?? ""])
  );
}

export async function getContentByKeys(keys: string[]): Promise<SiteContentMap> {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_content")
    .select("key, value")
    .in("key", keys);
  
  if (!data) return {};
  
  return Object.fromEntries(
    data.map((item) => [item.key, item.value ?? ""])
  );
}

export function getContent(contentMap: SiteContentMap, key: string, fallback: string = ""): string {
  return contentMap[key] ?? fallback;
}
