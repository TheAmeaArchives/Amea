"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Supporter } from "@/lib/types";
import { toast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/admin/image-upload";
import {
  createSupporter,
  updateSupporter,
  deleteSupporter,
} from "@/app/admin/actions/supporters";

interface SupportersClientProps {
  supporters: Supporter[];
}

interface FormState {
  name: string;
  logo_url: string | null;
  website_url: string;
  order_index: string;
}

const defaultForm: FormState = {
  name: "",
  logo_url: null,
  website_url: "",
  order_index: "0",
};

export default function SupportersClient({
  supporters,
}: SupportersClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Supporter | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ ...defaultForm });
    setDialogOpen(true);
  }

  function openEdit(supporter: Supporter) {
    setEditing(supporter);
    setForm({
      name: supporter.name,
      logo_url: supporter.logo_url,
      website_url: supporter.website_url ?? "",
      order_index: String(supporter.order_index),
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("name", form.name);
      fd.set("logo_url", form.logo_url ?? "");
      fd.set("website_url", form.website_url);
      fd.set("order_index", form.order_index);

      if (editing) {
        await updateSupporter(editing.id, fd);
        toast({ title: "Supporter updated" });
      } else {
        await createSupporter(fd);
        toast({ title: "Supporter created" });
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

  async function handleDelete(supporter: Supporter) {
    if (!confirm(`Delete "${supporter.name}"? This cannot be undone.`)) return;
    try {
      await deleteSupporter(supporter.id);
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
          <h1 className="text-2xl font-bold tracking-tight">Supporters</h1>
          <p className="text-muted-foreground mt-1">
            Manage supporter organizations and logos.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supporter
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="w-20">Order</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supporters.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  No supporters yet
                </TableCell>
              </TableRow>
            ) : (
              supporters.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {s.logo_url ? (
                      <Image
                        src={s.logo_url}
                        alt={s.name}
                        width={40}
                        height={40}
                        className="rounded object-contain w-10 h-10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>
                    {s.website_url ? (
                      <a
                        href={s.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        {new URL(s.website_url).hostname}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{s.order_index}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(s)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(s)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Supporter" : "Add Supporter"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details for this supporter."
                : "Fill in the details to add a new supporter."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="sup-name">Name *</Label>
              <Input
                id="sup-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Organization name"
              />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <ImageUpload
                value={form.logo_url}
                onChange={(url) => setForm({ ...form, logo_url: url })}
                folder="supporters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sup-website">Website URL</Label>
              <Input
                id="sup-website"
                type="url"
                value={form.website_url}
                onChange={(e) =>
                  setForm({ ...form, website_url: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sup-order">Order Index</Label>
              <Input
                id="sup-order"
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
                  : "Add Supporter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
