"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star, Video } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { toast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/admin/image-upload";
import VideoUpload from "@/components/admin/video-upload";
import {
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  setFeaturedGalleryItem,
  unsetFeaturedGalleryItem,
} from "@/app/admin/actions/gallery";

interface GalleryClientProps {
  items: GalleryItem[];
}

interface FormState {
  title: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  order_index: string;
}

const defaultForm: FormState = {
  title: "",
  description: "",
  image_url: null,
  video_url: null,
  order_index: "0",
};

export default function GalleryClient({ items }: GalleryClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ ...defaultForm });
    setDialogOpen(true);
  }

  function openEdit(item: GalleryItem) {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description ?? "",
      image_url: item.image_url,
      video_url: item.video_url,
      order_index: String(item.order_index),
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("title", form.title);
      fd.set("description", form.description);
      fd.set("image_url", form.image_url ?? "");
      fd.set("video_url", form.video_url ?? "");
      fd.set("order_index", form.order_index);

      if (editing) {
        await updateGalleryItem(editing.id, fd);
        toast({ title: "Gallery item updated" });
      } else {
        await createGalleryItem(fd);
        toast({ title: "Gallery item created" });
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSetFeatured(item: GalleryItem) {
    try {
      if (item.featured) {
        await unsetFeaturedGalleryItem(item.id);
        toast({ title: "Removed from featured" });
      } else {
        await setFeaturedGalleryItem(item.id);
        toast({ title: "Set as featured" });
      }
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  async function handleDelete(item: GalleryItem) {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await deleteGalleryItem(item.id);
      toast({ title: "Deleted successfully" });
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grand Gallery</h1>
          <p className="text-muted-foreground mt-1">
            Manage gallery images and descriptions.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border bg-white p-12 text-center text-muted-foreground">
          No gallery items yet. Click &quot;Add Item&quot; to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-lg border bg-white overflow-hidden group ${item.featured ? "ring-2 ring-yellow-400" : ""}`}
            >
              <div className="relative aspect-[4/3] bg-gray-50">
                {item.featured && (
                  <Badge className="absolute top-2 left-2 z-10 bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                {item.video_url && (
                  <Badge className="absolute top-2 right-2 z-10 bg-blue-500 hover:bg-blue-500">
                    <Video className="h-3 w-3 mr-1" />
                    Video
                  </Badge>
                )}
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-300">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{item.title}</h3>
                  <span className="shrink-0 text-xs text-muted-foreground bg-gray-100 rounded px-1.5 py-0.5">
                    #{item.order_index}
                  </span>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 pt-1">
                  <Button
                    variant={item.featured ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSetFeatured(item)}
                    className={item.featured ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-900" : ""}
                  >
                    <Star className={`h-3.5 w-3.5 mr-1 ${item.featured ? "fill-current" : ""}`} />
                    {item.featured ? "Featured" : "Set Featured"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1 text-destructive" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Gallery Item" : "Add Gallery Item"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details for this gallery item."
                : "Fill in the details to add a new gallery item."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="gallery-title">Title *</Label>
              <Input
                id="gallery-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Item title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-desc">Description</Label>
              <Textarea
                id="gallery-desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Brief description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Image (Thumbnail)</Label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="gallery"
              />
            </div>
            <div className="space-y-2">
              <Label>Video (optional)</Label>
              <VideoUpload
                value={form.video_url}
                onChange={(url) => setForm({ ...form, video_url: url })}
                folder="gallery"
              />
              <p className="text-xs text-muted-foreground">
                Upload a video file (MP4, WebM, MOV) or leave empty to use image only.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-order">Order Index</Label>
              <Input
                id="gallery-order"
                type="number"
                value={form.order_index}
                onChange={(e) =>
                  setForm({ ...form, order_index: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
