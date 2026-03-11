"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { TeamMember, Contributor } from "@/lib/types";
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
import ImageUpload from "@/components/admin/image-upload";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  createContributor,
  updateContributor,
  deleteContributor,
} from "@/app/admin/actions/team";

interface TeamClientProps {
  teamMembers: TeamMember[];
  collaborators: TeamMember[];
  contributors: Contributor[];
}

interface MemberFormState {
  name: string;
  role: string;
  bio: string;
  image_url: string | null;
  order_index: string;
}

interface ContributorFormState {
  name: string;
  location: string;
  bio: string;
  image_url: string | null;
}

const defaultMemberForm: MemberFormState = {
  name: "",
  role: "",
  bio: "",
  image_url: null,
  order_index: "0",
};

const defaultContributorForm: ContributorFormState = {
  name: "",
  location: "",
  bio: "",
  image_url: null,
};

export default function TeamClient({
  teamMembers,
  collaborators,
  contributors,
}: TeamClientProps) {
  const router = useRouter();

  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState<MemberFormState>(defaultMemberForm);
  const [teamLoading, setTeamLoading] = useState(false);

  const [collabDialogOpen, setCollabDialogOpen] = useState(false);
  const [editingCollab, setEditingCollab] = useState<TeamMember | null>(null);
  const [collabForm, setCollabForm] =
    useState<MemberFormState>(defaultMemberForm);
  const [collabLoading, setCollabLoading] = useState(false);

  const [contribDialogOpen, setContribDialogOpen] = useState(false);
  const [editingContrib, setEditingContrib] = useState<Contributor | null>(
    null
  );
  const [contribForm, setContribForm] = useState<ContributorFormState>(
    defaultContributorForm
  );
  const [contribLoading, setContribLoading] = useState(false);

  function openCreateMember(type: "team" | "collaborator") {
    const form = { ...defaultMemberForm };
    if (type === "team") {
      setEditingTeam(null);
      setTeamForm(form);
      setTeamDialogOpen(true);
    } else {
      setEditingCollab(null);
      setCollabForm(form);
      setCollabDialogOpen(true);
    }
  }

  function openEditMember(member: TeamMember) {
    const form: MemberFormState = {
      name: member.name,
      role: member.role ?? "",
      bio: member.bio ?? "",
      image_url: member.image_url,
      order_index: String(member.order_index),
    };
    if (member.member_type === "team") {
      setEditingTeam(member);
      setTeamForm(form);
      setTeamDialogOpen(true);
    } else {
      setEditingCollab(member);
      setCollabForm(form);
      setCollabDialogOpen(true);
    }
  }

  async function handleMemberSubmit(type: "team" | "collaborator") {
    const isTeam = type === "team";
    const form = isTeam ? teamForm : collabForm;
    const editing = isTeam ? editingTeam : editingCollab;
    const setLoading = isTeam ? setTeamLoading : setCollabLoading;
    const setOpen = isTeam ? setTeamDialogOpen : setCollabDialogOpen;

    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("name", form.name);
      fd.set("role", form.role);
      fd.set("bio", form.bio);
      fd.set("image_url", form.image_url ?? "");
      fd.set("member_type", type);
      fd.set("order_index", form.order_index);

      if (editing) {
        await updateTeamMember(editing.id, fd);
        toast({ title: `${isTeam ? "Team member" : "Collaborator"} updated` });
      } else {
        await createTeamMember(fd);
        toast({ title: `${isTeam ? "Team member" : "Collaborator"} created` });
      }
      setOpen(false);
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

  async function handleDeleteMember(member: TeamMember) {
    if (!confirm(`Delete "${member.name}"? This cannot be undone.`)) return;
    try {
      await deleteTeamMember(member.id);
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

  function openCreateContributor() {
    setEditingContrib(null);
    setContribForm({ ...defaultContributorForm });
    setContribDialogOpen(true);
  }

  function openEditContributor(c: Contributor) {
    setEditingContrib(c);
    setContribForm({
      name: c.name,
      location: c.location ?? "",
      bio: c.bio ?? "",
      image_url: c.image_url,
    });
    setContribDialogOpen(true);
  }

  async function handleContributorSubmit() {
    if (!contribForm.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    setContribLoading(true);
    try {
      const fd = new FormData();
      fd.set("name", contribForm.name);
      fd.set("location", contribForm.location);
      fd.set("bio", contribForm.bio);
      fd.set("image_url", contribForm.image_url ?? "");

      if (editingContrib) {
        await updateContributor(editingContrib.id, fd);
        toast({ title: "Contributor updated" });
      } else {
        await createContributor(fd);
        toast({ title: "Contributor created" });
      }
      setContribDialogOpen(false);
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setContribLoading(false);
    }
  }

  async function handleDeleteContributor(c: Contributor) {
    if (!confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    try {
      await deleteContributor(c.id);
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

  function renderMemberTable(members: TeamMember[], type: "team" | "collaborator") {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-20">Order</TableHead>
            <TableHead className="w-28 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No {type === "team" ? "team members" : "collaborators"} yet
              </TableCell>
            </TableRow>
          ) : (
            members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  {m.image_url ? (
                    <Image
                      src={m.image_url}
                      alt={m.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-10 h-10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      N/A
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="text-muted-foreground">{m.role ?? "—"}</TableCell>
                <TableCell>{m.order_index}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditMember(m)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMember(m)}
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
    );
  }

  function renderMemberDialog(
    type: "team" | "collaborator",
    open: boolean,
    setOpen: (v: boolean) => void,
    form: MemberFormState,
    setForm: (v: MemberFormState) => void,
    editing: TeamMember | null,
    loading: boolean
  ) {
    const label = type === "team" ? "Team Member" : "Collaborator";
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${label}` : `Add ${label}`}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? `Update the details for this ${label.toLowerCase()}.`
                : `Fill in the details to add a new ${label.toLowerCase()}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor={`${type}-name`}>Name *</Label>
              <Input
                id={`${type}-name`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${type}-role`}>Role</Label>
              <Input
                id={`${type}-role`}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Director, Researcher"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${type}-bio`}>Bio</Label>
              <Textarea
                id={`${type}-bio`}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Brief biography..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder={type === "team" ? "team" : "collaborators"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${type}-order`}>Order Index</Label>
              <Input
                id={`${type}-order`}
                type="number"
                value={form.order_index}
                onChange={(e) =>
                  setForm({ ...form, order_index: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleMemberSubmit(type)}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : `Add ${label}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team & Contributors</h1>
        <p className="text-muted-foreground mt-1">
          Manage team members, collaborators, and contributors.
        </p>
      </div>

      <Tabs defaultValue="team">
        <TabsList>
          <TabsTrigger value="team">
            Team Members ({teamMembers.length})
          </TabsTrigger>
          <TabsTrigger value="collaborators">
            Collaborators ({collaborators.length})
          </TabsTrigger>
          <TabsTrigger value="contributors">
            Contributors ({contributors.length})
          </TabsTrigger>
        </TabsList>

        {/* Team Members Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openCreateMember("team")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
          <div className="rounded-md border bg-white">
            {renderMemberTable(teamMembers, "team")}
          </div>
          {renderMemberDialog(
            "team",
            teamDialogOpen,
            setTeamDialogOpen,
            teamForm,
            setTeamForm,
            editingTeam,
            teamLoading
          )}
        </TabsContent>

        {/* Collaborators Tab */}
        <TabsContent value="collaborators" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openCreateMember("collaborator")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Collaborator
            </Button>
          </div>
          <div className="rounded-md border bg-white">
            {renderMemberTable(collaborators, "collaborator")}
          </div>
          {renderMemberDialog(
            "collaborator",
            collabDialogOpen,
            setCollabDialogOpen,
            collabForm,
            setCollabForm,
            editingCollab,
            collabLoading
          )}
        </TabsContent>

        {/* Contributors Tab */}
        <TabsContent value="contributors" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openCreateContributor}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contributor
            </Button>
          </div>
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributors.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No contributors yet
                    </TableCell>
                  </TableRow>
                ) : (
                  contributors.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        {c.image_url ? (
                          <Image
                            src={c.image_url}
                            alt={c.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover w-10 h-10"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            N/A
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {c.location ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditContributor(c)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteContributor(c)}
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

          <Dialog open={contribDialogOpen} onOpenChange={setContribDialogOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingContrib ? "Edit Contributor" : "Add Contributor"}
                </DialogTitle>
                <DialogDescription>
                  {editingContrib
                    ? "Update the details for this contributor."
                    : "Fill in the details to add a new contributor."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="contrib-name">Name *</Label>
                  <Input
                    id="contrib-name"
                    value={contribForm.name}
                    onChange={(e) =>
                      setContribForm({ ...contribForm, name: e.target.value })
                    }
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contrib-location">Location</Label>
                  <Input
                    id="contrib-location"
                    value={contribForm.location}
                    onChange={(e) =>
                      setContribForm({
                        ...contribForm,
                        location: e.target.value,
                      })
                    }
                    placeholder="e.g. New York, USA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contrib-bio">Bio</Label>
                  <Textarea
                    id="contrib-bio"
                    value={contribForm.bio}
                    onChange={(e) =>
                      setContribForm({ ...contribForm, bio: e.target.value })
                    }
                    placeholder="Brief biography..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <ImageUpload
                    value={contribForm.image_url}
                    onChange={(url) =>
                      setContribForm({ ...contribForm, image_url: url })
                    }
                    folder="contributors"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setContribDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContributorSubmit}
                  disabled={contribLoading}
                >
                  {contribLoading
                    ? "Saving..."
                    : editingContrib
                      ? "Save Changes"
                      : "Add Contributor"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
