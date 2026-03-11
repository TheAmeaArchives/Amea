"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import type { ChamberStat, ChamberBelief, ChamberContent } from "@/lib/types";
import { toast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  upsertChamberStat,
  deleteChamberStat,
  upsertChamberBelief,
  deleteChamberBelief,
  upsertChamberContent,
} from "@/app/admin/actions/chambers";

interface ChambersClientProps {
  stats: ChamberStat[];
  beliefs: ChamberBelief[];
  content: ChamberContent[];
}

interface StatForm {
  value: string;
  label: string;
  order_index: string;
}

interface BeliefForm {
  title: string;
  content: string;
  order_index: string;
}

interface ContentForm {
  section: string;
  content: string;
}

const defaultStatForm: StatForm = { value: "", label: "", order_index: "0" };
const defaultBeliefForm: BeliefForm = {
  title: "",
  content: "",
  order_index: "0",
};
const defaultContentForm: ContentForm = { section: "", content: "" };

export default function ChambersClient({
  stats,
  beliefs,
  content,
}: ChambersClientProps) {
  const router = useRouter();

  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<ChamberStat | null>(null);
  const [statForm, setStatForm] = useState<StatForm>(defaultStatForm);

  const [beliefDialogOpen, setBeliefDialogOpen] = useState(false);
  const [editingBelief, setEditingBelief] = useState<ChamberBelief | null>(
    null
  );
  const [beliefForm, setBeliefForm] = useState<BeliefForm>(defaultBeliefForm);

  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ChamberContent | null>(
    null
  );
  const [contentForm, setContentForm] =
    useState<ContentForm>(defaultContentForm);

  const [loading, setLoading] = useState(false);

  // --- Stats ---
  function openCreateStat() {
    setEditingStat(null);
    setStatForm({ ...defaultStatForm });
    setStatDialogOpen(true);
  }

  function openEditStat(stat: ChamberStat) {
    setEditingStat(stat);
    setStatForm({
      value: stat.value,
      label: stat.label,
      order_index: String(stat.order_index),
    });
    setStatDialogOpen(true);
  }

  async function handleStatSubmit() {
    if (!statForm.value.trim() || !statForm.label.trim()) {
      toast({ title: "Value and label are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("value", statForm.value);
      fd.set("label", statForm.label);
      fd.set("order_index", statForm.order_index);
      await upsertChamberStat(editingStat?.id ?? null, fd);
      toast({ title: editingStat ? "Stat updated" : "Stat created" });
      setStatDialogOpen(false);
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

  async function handleDeleteStat(stat: ChamberStat) {
    if (!confirm(`Delete stat "${stat.label}"? This cannot be undone.`)) return;
    try {
      await deleteChamberStat(stat.id);
      toast({ title: "Stat deleted" });
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  // --- Beliefs ---
  function openCreateBelief() {
    setEditingBelief(null);
    setBeliefForm({ ...defaultBeliefForm });
    setBeliefDialogOpen(true);
  }

  function openEditBelief(belief: ChamberBelief) {
    setEditingBelief(belief);
    setBeliefForm({
      title: belief.title,
      content: belief.content ?? "",
      order_index: String(belief.order_index),
    });
    setBeliefDialogOpen(true);
  }

  async function handleBeliefSubmit() {
    if (!beliefForm.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("title", beliefForm.title);
      fd.set("content", beliefForm.content);
      fd.set("order_index", beliefForm.order_index);
      await upsertChamberBelief(editingBelief?.id ?? null, fd);
      toast({ title: editingBelief ? "Belief updated" : "Belief created" });
      setBeliefDialogOpen(false);
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

  async function handleDeleteBelief(belief: ChamberBelief) {
    if (!confirm(`Delete belief "${belief.title}"? This cannot be undone.`))
      return;
    try {
      await deleteChamberBelief(belief.id);
      toast({ title: "Belief deleted" });
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  // --- Content ---
  function openCreateContent() {
    setEditingContent(null);
    setContentForm({ ...defaultContentForm });
    setContentDialogOpen(true);
  }

  function openEditContent(entry: ChamberContent) {
    setEditingContent(entry);
    setContentForm({
      section: entry.section,
      content: entry.content ?? "",
    });
    setContentDialogOpen(true);
  }

  async function handleContentSubmit() {
    if (!contentForm.section.trim()) {
      toast({ title: "Section is required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("chamber", "iii");
      fd.set("section", contentForm.section);
      fd.set("content", contentForm.content);
      await upsertChamberContent(editingContent?.id ?? null, fd);
      toast({
        title: editingContent ? "Content updated" : "Content created",
      });
      setContentDialogOpen(false);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chambers</h1>
        <p className="text-muted-foreground mt-1">
          Manage Chamber II stats, beliefs, and Chamber III content.
        </p>
      </div>

      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="beliefs">Beliefs</TabsTrigger>
          <TabsTrigger value="content">Chamber III Content</TabsTrigger>
        </TabsList>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openCreateStat}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stat
            </Button>
          </div>
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Value</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead className="w-20">Order</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No stats yet
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.value}</TableCell>
                      <TableCell>{s.label}</TableCell>
                      <TableCell>{s.order_index}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditStat(s)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteStat(s)}
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
        </TabsContent>

        {/* Beliefs Tab */}
        <TabsContent value="beliefs" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openCreateBelief}>
              <Plus className="h-4 w-4 mr-2" />
              Add Belief
            </Button>
          </div>
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Content Preview</TableHead>
                  <TableHead className="w-20">Order</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {beliefs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No beliefs yet
                    </TableCell>
                  </TableRow>
                ) : (
                  beliefs.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.title}</TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {b.content
                          ? b.content.length > 80
                            ? b.content.slice(0, 80) + "…"
                            : b.content
                          : "—"}
                      </TableCell>
                      <TableCell>{b.order_index}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditBelief(b)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBelief(b)}
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
        </TabsContent>

        {/* Chamber III Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openCreateContent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>
          <div className="space-y-4">
            {content.length === 0 ? (
              <div className="rounded-md border bg-white p-8 text-center text-muted-foreground">
                No Chamber III content yet
              </div>
            ) : (
              content.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-md border bg-white p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      {entry.section}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditContent(entry)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {entry.content || "—"}
                  </p>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Stat Dialog */}
      <Dialog open={statDialogOpen} onOpenChange={setStatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStat ? "Edit Stat" : "Add Stat"}
            </DialogTitle>
            <DialogDescription>
              {editingStat
                ? "Update the details for this stat."
                : "Fill in the details to add a new Chamber II stat."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="stat-value">Value *</Label>
              <Input
                id="stat-value"
                value={statForm.value}
                onChange={(e) =>
                  setStatForm({ ...statForm, value: e.target.value })
                }
                placeholder='e.g. "150+"'
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stat-label">Label *</Label>
              <Input
                id="stat-label"
                value={statForm.label}
                onChange={(e) =>
                  setStatForm({ ...statForm, label: e.target.value })
                }
                placeholder="e.g. Members"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stat-order">Order Index</Label>
              <Input
                id="stat-order"
                type="number"
                value={statForm.order_index}
                onChange={(e) =>
                  setStatForm({ ...statForm, order_index: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatSubmit} disabled={loading}>
              {loading
                ? "Saving..."
                : editingStat
                  ? "Save Changes"
                  : "Add Stat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Belief Dialog */}
      <Dialog open={beliefDialogOpen} onOpenChange={setBeliefDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBelief ? "Edit Belief" : "Add Belief"}
            </DialogTitle>
            <DialogDescription>
              {editingBelief
                ? "Update the details for this belief."
                : "Fill in the details to add a new Chamber II belief."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="belief-title">Title *</Label>
              <Input
                id="belief-title"
                value={beliefForm.title}
                onChange={(e) =>
                  setBeliefForm({ ...beliefForm, title: e.target.value })
                }
                placeholder="Belief title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="belief-content">Content</Label>
              <Textarea
                id="belief-content"
                value={beliefForm.content}
                onChange={(e) =>
                  setBeliefForm({ ...beliefForm, content: e.target.value })
                }
                placeholder="Belief content"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="belief-order">Order Index</Label>
              <Input
                id="belief-order"
                type="number"
                value={beliefForm.order_index}
                onChange={(e) =>
                  setBeliefForm({ ...beliefForm, order_index: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBeliefDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBeliefSubmit} disabled={loading}>
              {loading
                ? "Saving..."
                : editingBelief
                  ? "Save Changes"
                  : "Add Belief"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Dialog */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingContent ? "Edit Section" : "Add Section"}
            </DialogTitle>
            <DialogDescription>
              {editingContent
                ? "Update the content for this section."
                : "Add a new section to Chamber III."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="content-section">Section Key *</Label>
              <Input
                id="content-section"
                value={contentForm.section}
                onChange={(e) =>
                  setContentForm({ ...contentForm, section: e.target.value })
                }
                placeholder="e.g. intro, mission, vision"
                disabled={!!editingContent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-body">Content</Label>
              <Textarea
                id="content-body"
                value={contentForm.content}
                onChange={(e) =>
                  setContentForm({ ...contentForm, content: e.target.value })
                }
                placeholder="Section content"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setContentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleContentSubmit} disabled={loading}>
              {loading
                ? "Saving..."
                : editingContent
                  ? "Save Changes"
                  : "Add Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
