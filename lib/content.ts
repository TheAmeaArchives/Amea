import { fetchServerData } from "@/lib/backend/server-api";
import type { SiteContentMap } from "@/lib/types";

export async function getSiteContent(): Promise<SiteContentMap> {
  return (await fetchServerData<SiteContentMap>("/api/public/site-content")) ?? {};
}

export async function getContentByKeys(keys: string[]): Promise<SiteContentMap> {
  if (keys.length === 0) {
    return {};
  }

  const query = new URLSearchParams({
    keys: keys.join(","),
  });

  return (await fetchServerData<SiteContentMap>(`/api/public/site-content?${query.toString()}`)) ?? {};
}

export function getContent(contentMap: SiteContentMap, key: string, fallback: string = ""): string {
  return contentMap[key] ?? fallback;
}
