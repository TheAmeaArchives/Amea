"use client";

import React, { useState } from "react";
import type { GalleryItem, SiteContentMap } from "@/lib/types";
import { EditableText } from "@/components/admin/editable-text";
import { Play } from "lucide-react";

interface GalleryPageClientProps {
  content: SiteContentMap;
  items: GalleryItem[];
  featuredItem: GalleryItem | null;
}

export function GalleryPageClient({ content, items, featuredItem }: GalleryPageClientProps) {
  const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;
  const hasItems = items.length > 0;
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const isValidExternalUrl = (url: string | null | undefined): url is string => {
    if (!url || url.trim() === "") return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const isDirectVideoUrl = (url: string) => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    const hasVideoExtension = videoExtensions.some(ext => url.toLowerCase().includes(ext));
    // Also check for Supabase storage video bucket URLs
    const isSupabaseVideo = url.includes("supabase") && url.includes("/videos/");
    return hasVideoExtension || isSupabaseVideo;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("/embed/")) return url;
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="akira text-5xl">
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
      
      {/* Featured Item Hero Section */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-default rounded-lg overflow-hidden">
        {featuredItem ? (
          <>
            {(() => {
              const videoUrl = featuredItem.video_url;
              const imageUrl = featuredItem.image_url;
              
              // Check for valid YouTube URL
              if (isValidExternalUrl(videoUrl) && isYouTubeUrl(videoUrl)) {
                const embedUrl = getYouTubeEmbedUrl(videoUrl);
                if (embedUrl) {
                  return (
                    <iframe
                      src={embedUrl}
                      title={featuredItem.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
              }
              
              // Check for valid direct video URL
              if (isValidExternalUrl(videoUrl) && isDirectVideoUrl(videoUrl)) {
                return (
                  <video
                    src={videoUrl}
                    poster={isValidExternalUrl(imageUrl) ? imageUrl : undefined}
                    className="w-full h-full object-cover"
                    controls
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                  />
                );
              }
              
              // Fall back to image
              if (isValidExternalUrl(imageUrl)) {
                return (
                  <img
                    src={imageUrl}
                    alt={featuredItem.title}
                    className="w-full h-full object-cover"
                  />
                );
              }
              
              // No valid media
              return (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-16 h-16 text-white/50" />
                </div>
              );
            })()}
            {/* Featured item overlay with title - hidden when video is playing */}
            <div 
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 sm:p-8 transition-opacity duration-300 ${
                isVideoPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                {featuredItem.title}
              </h2>
              {featuredItem.description && (
                <p className="text-white/80 mt-2 text-sm sm:text-base line-clamp-2">
                  {featuredItem.description}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
            <Play className="w-16 h-16 mb-4" />
            <p className="text-lg">Featured content coming soon</p>
          </div>
        )}
      </div>
      <div className="py-24 center">
        <h1 className="text-[32px] font-normal text-center leading-relaxed">
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
                  <h1 className="text-xl font-medium">{item.title}</h1>
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
