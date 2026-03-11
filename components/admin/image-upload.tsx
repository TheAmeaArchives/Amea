"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError, data } = await supabase.storage
        .from("images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
          setError("Storage bucket 'images' not found. Please create it in Supabase Dashboard > Storage.");
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
      } = supabase.storage.from("images").getPublicUrl(fileName);

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
          <img
            src={value}
            alt="Uploaded"
            className="w-[200px] h-[200px] rounded-md border object-cover"
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
              <span className="text-sm text-black/40">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-black/40 mb-2" />
              <span className="text-sm text-black/40">Click to upload</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
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
          {uploading ? "Uploading..." : "Replace Image"}
        </Button>
      )}
    </div>
  );
}
