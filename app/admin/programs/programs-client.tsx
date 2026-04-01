"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Circle, Diamond, Triangle } from "lucide-react";
import type { Program } from "@/lib/types";
import { toast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProgram,
  updateProgram,
  deleteProgram,
} from "@/app/admin/actions/programs";

interface ProgramsClientProps {
  programs: Program[];
}

interface FormState {
  title: string;
  description: string;
  icon_type: string;
  featured: boolean;
  order_index: string;
}

const defaultForm: FormState = {
  title: "",
  description: "",
  icon_type: "circle",
  featured: false,
  order_index: "0",
};

const iconMap = {
  circle: Circle,
  diamond: Diamond,
  triangle: Triangle,
} as const;

export default function ProgramsClient({ programs }: ProgramsClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ ...defaultForm });
    setDialogOpen(true);
  }

  function openEdit(program: Program) {
    setEditing(program);
    setForm({
      title: program.title,
      description: program.description ?? "",
      icon_type: program.icon_type ?? "circle",
      featured: program.featured,
      order_index: String(program.order_index),
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
      fd.set("icon_type", form.icon_type);
      fd.set("featured", String(form.featured));
      fd.set("order_index", form.order_index);

      if (editing) {
        await updateProgram(editing.id, fd);
        toast({ title: "Program updated" });
      } else {
        await createProgram(fd);
        toast({ title: "Program created" });
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

  async function handleDelete(program: Program) {
    if (!confirm(`Delete "${program.title}"? This cannot be undone.`)) return;
    try {
      await deleteProgram(program.id);
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

  function renderIcon(type: string | null) {
    const Icon = iconMap[type as keyof typeof iconMap];
    if (!Icon) return <span className="text-muted-foreground">—</span>;
    return <Icon className="h-4 w-4" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Programs</h1>
          <p className="text-muted-foreground mt-1">
            Manage programs and their details.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="w-24">Icon</TableHead>
              <TableHead className="w-24">Featured</TableHead>
              <TableHead className="w-20">Order</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  No programs yet
                </TableCell>
              </TableRow>
            ) : (
              programs.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium">{p.title}</span>
                      {p.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                          {p.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {renderIcon(p.icon_type)}
                      <span className="text-xs text-muted-foreground capitalize">
                        {p.icon_type ?? "none"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.featured ? (
                      <Badge variant="default">Featured</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell>{p.order_index}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p)}
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
              {editing ? "Edit Program" : "Add Program"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details for this program."
                : "Fill in the details to add a new program."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="prog-title">Title *</Label>
              <Input
                id="prog-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Program title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prog-desc">Description</Label>
              <Textarea
                id="prog-desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Program description..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon Type</Label>
              <Select
                value={form.icon_type}
                onValueChange={(v) => setForm({ ...form, icon_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circle">
                    <span className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5" /> Circle
                    </span>
                  </SelectItem>
                  <SelectItem value="diamond">
                    <span className="flex items-center gap-2">
                      <Diamond className="h-3.5 w-3.5" /> Diamond
                    </span>
                  </SelectItem>
                  <SelectItem value="triangle">
                    <span className="flex items-center gap-2">
                      <Triangle className="h-3.5 w-3.5" /> Triangle
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="prog-featured"
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="prog-featured" className="cursor-pointer">
                Featured program
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prog-order">Order Index</Label>
              <Input
                id="prog-order"
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
                  : "Add Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
