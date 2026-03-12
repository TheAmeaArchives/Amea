"use client";

import React from "react";
import type { GalleryItem, SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";

interface GalleryPageClientProps {
  content: SiteContentMap;
  items: GalleryItem[];
}

export function GalleryPageClient({ content, items }: GalleryPageClientProps) {
  const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;
  const hasItems = items.length > 0;

  return (
    <div className="flex flex-col gap-10">
      <div className="akira text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        <h1>
          <EditableText
            contentKey="gallery_title_1"
            defaultValue={getContentValue('gallery_title_1', 'Grand')}
          >
            {getContentValue('gallery_title_1', 'Grand')}
          </EditableText>
        </h1>
        <h1>
          <EditableText
            contentKey="gallery_title_2"
            defaultValue={getContentValue('gallery_title_2', 'Gallery')}
          >
            {getContentValue('gallery_title_2', 'Gallery')}
          </EditableText>
        </h1>
      </div>
      <div className="h-[500px] bg-default center rounded-lg">
        {/* Featured gallery image placeholder */}
      </div>
      <div className="py-24 center">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[32px] font-normal text-center leading-relaxed">
          <EditableText
            contentKey="gallery_description"
            defaultValue={getContentValue('gallery_description', 'Display of projects built & impact created using our insights.')}
          >
            {getContentValue('gallery_description', 'Display of projects built & impact created using our insights.')}
          </EditableText>
        </h1>
      </div>
      <div className="center">
        <div className="h-full w-full grid grid-cols-3 gap-4 p-5">
          {hasItems ? (
            items.map((item) => (
              <div className="flex flex-col gap-3" key={item.id}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-56 rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-default w-full h-56 rounded-lg" />
                )}
                <div>
                  <h1 className="text-base sm:text-lg md:text-xl font-medium">{item.title}</h1>
                  <p className="text-sm text-black/70">{item.description ?? ""}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 sm:py-20 text-center">
              <p className="text-lg sm:text-xl text-gray-500 aileron">No gallery items yet.</p>
              <p className="text-sm text-gray-400 mt-2">Check back soon for new projects.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
