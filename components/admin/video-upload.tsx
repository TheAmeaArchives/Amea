"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, AlertCircle, Video } from "lucide-react";

interface VideoUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}

export default function VideoUpload({
  value,
  onChange,
  folder = "videos",
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Video file must be less than 100MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
          setError("Storage bucket 'videos' not found. Please create it in Supabase Dashboard > Storage.");
        } else if (uploadError.message.includes("row-level security") || uploadError.message.includes("policy")) {
          setError("Permission denied. Please check storage bucket policies.");
        } else {
          setError(uploadError.message);
        }
        console.error("Upload failed:", uploadError);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("videos").getPublicUrl(fileName);

      onChange(publicUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange(null);
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        <div className="relative inline-block">
          <video
            src={value}
            className="w-[300px] h-[170px] rounded-md border object-cover bg-black"
            controls
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 rounded-full bg-default p-1 text-white shadow-md hover:bg-default/90"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors ${
            uploading ? "border-black/10 cursor-wait" : "border-black/20 hover:border-default/50"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-black/40 mb-2" />
              <span className="text-sm text-black/40">Uploading video...</span>
            </>
          ) : (
            <>
              <Video className="h-6 w-6 text-black/40 mb-2" />
              <span className="text-sm text-black/40">Click to upload video</span>
              <span className="text-xs text-black/30 mt-1">MP4, WebM, MOV (max 100MB)</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/ogg"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />

      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Replace Video"}
        </Button>
      )}
    </div>
  );
}
