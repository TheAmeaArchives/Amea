"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/admin/image-upload";
import { updateExperiment } from "@/app/admin/actions/experiments";
import { toast } from "@/lib/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Experiment } from "@/lib/types";

export default function ExperimentEditForm({
  experiment,
}: {
  experiment: Experiment;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(experiment.title);
  const [slug, setSlug] = useState(experiment.slug);
  const [description, setDescription] = useState(
    experiment.description ?? ""
  );
  const [content, setContent] = useState(
    experiment.content ? JSON.stringify(experiment.content, null, 2) : ""
  );
  const [image, setImage] = useState<string | null>(experiment.image_url);
  const [curator, setCurator] = useState(experiment.curator ?? "");
  const [editor, setEditor] = useState(experiment.editor ?? "");
  const [chamber, setChamber] = useState(experiment.chamber);
  const [published, setPublished] = useState(experiment.published);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("slug", slug);
      formData.set("description", description);
      formData.set("content", content || "");
      formData.set("image_url", image ?? "");
      formData.set("curator", curator);
      formData.set("editor", editor);
      formData.set("chamber", chamber);
      formData.set("published", String(published));

      await updateExperiment(experiment.id, formData);
      toast({ title: "Experiment updated" });
      router.push("/admin/experiments");
    } catch (err: any) {
      toast({
        title: "Failed to update experiment",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/experiments">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold aileron">Edit Experiment</h1>
          <p className="text-sm text-black/50 mt-1">
            Update &ldquo;{experiment.title}&rdquo;
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter experiment title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="experiment-url-slug"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the experiment"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Image</Label>
          <ImageUpload
            value={image}
            onChange={setImage}
            folder="experiments"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="curator">Curator</Label>
            <Input
              id="curator"
              value={curator}
              onChange={(e) => setCurator(e.target.value)}
              placeholder="Curator name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editor">Editor</Label>
            <Input
              id="editor"
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              placeholder="Editor name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Chamber</Label>
          <Select value={chamber} onValueChange={setChamber}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="i">Chamber I</SelectItem>
              <SelectItem value="ii">Chamber II</SelectItem>
              <SelectItem value="iii">Chamber III</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content (JSON)</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Enter content as JSON string'
            rows={10}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-[#e9190f]"
          />
          <Label htmlFor="published" className="cursor-pointer">
            Published
          </Label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-default hover:bg-default/90 text-white"
          >
            {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
            Save Changes
          </Button>
          <Link href="/admin/experiments">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
