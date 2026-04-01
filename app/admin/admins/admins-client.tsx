"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Power, Mail, Ban } from "lucide-react";
import type { AdminInvite, AdminProfile, AdminRole, Permission } from "@/lib/types";
import { ALL_PERMISSIONS, PERMISSION_LABELS } from "@/lib/types";
import { toast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  createAdminInvite,
  revokeAdminInvite,
  updateAdmin,
  toggleAdminActive,
} from "@/app/admin/actions/admins";

interface AdminsClientProps {
  admins: AdminProfile[];
  invites: AdminInvite[];
  currentUserId: string;
}

interface CreateFormState {
  email: string;
  full_name: string;
  role: AdminRole;
  permissions: Permission[];
  expires_in_days: string;
}

interface EditFormState {
  full_name: string;
  role: AdminRole;
  permissions: Permission[];
  is_active: boolean;
}

const defaultCreateForm: CreateFormState = {
  email: "",
  full_name: "",
  role: "admin",
  permissions: [],
  expires_in_days: "7",
};

const defaultEditForm: EditFormState = {
  full_name: "",
  role: "admin",
  permissions: [],
  is_active: true,
};

export default function AdminsClient({
  admins,
  invites,
  currentUserId,
}: AdminsClientProps) {
  const router = useRouter();

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormState>(defaultCreateForm);
  const [creating, setCreating] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminProfile | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(defaultEditForm);
  const [saving, setSaving] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [revokingInviteId, setRevokingInviteId] = useState<string | null>(null);

  function openCreate() {
    setCreateForm({ ...defaultCreateForm });
    setCreateOpen(true);
  }

  function openEdit(admin: AdminProfile) {
    setEditingAdmin(admin);
    setEditForm({
      full_name: admin.full_name,
      role: admin.role,
      permissions: [...admin.permissions],
      is_active: admin.is_active,
    });
    setEditOpen(true);
  }

  function toggleCreatePermission(perm: Permission) {
    setCreateForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  }

  function toggleEditPermission(perm: Permission) {
    setEditForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  }

  async function handleCreate() {
    if (!createForm.email.trim() || !createForm.full_name.trim()) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const fd = new FormData();
      fd.set("email", createForm.email);
      fd.set("full_name", createForm.full_name);
      fd.set("role", createForm.role);
      fd.set(
        "permissions",
        JSON.stringify(createForm.role === "super_admin" ? [] : createForm.permissions)
      );
      fd.set("expires_in_days", createForm.expires_in_days);

      await createAdminInvite(fd);
      toast({ title: "Invite sent successfully" });
      setCreateOpen(false);
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate() {
    if (!editingAdmin || !editForm.full_name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("full_name", editForm.full_name);
      fd.set("role", editForm.role);
      fd.set(
        "permissions",
        JSON.stringify(editForm.role === "super_admin" ? [] : editForm.permissions)
      );
      fd.set("is_active", String(editForm.is_active));

      await updateAdmin(editingAdmin.id, fd);
      toast({ title: "Admin updated successfully" });
      setEditOpen(false);
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(admin: AdminProfile) {
    setTogglingId(admin.id);
    try {
      await toggleAdminActive(admin.id, !admin.is_active);
      toast({
        title: admin.is_active ? "Admin deactivated" : "Admin activated",
      });
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  }

  async function handleRevokeInvite(invite: AdminInvite) {
    setRevokingInviteId(invite.id);
    try {
      await revokeAdminInvite(invite.id);
      toast({ title: "Invite revoked" });
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setRevokingInviteId(null);
    }
  }

  function PermissionsCheckboxes({
    selected,
    onToggle,
    disabled,
  }: {
    selected: Permission[];
    onToggle: (p: Permission) => void;
    disabled?: boolean;
  }) {
    return (
      <div className="space-y-2">
        <Label>Permissions</Label>
        {disabled ? (
          <p className="text-sm text-muted-foreground">
            Super admins have all permissions automatically.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {ALL_PERMISSIONS.map((perm) => (
              <label
                key={perm}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(perm)}
                  onChange={() => onToggle(perm)}
                  className="h-4 w-4 rounded border-gray-300 text-[#e9190f] focus:ring-[#e9190f]"
                />
                {PERMISSION_LABELS[perm]}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Manage live admin users, pending invites, roles, and permissions.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Invite Admin
        </Button>
      </div>

      <div className="rounded-md border bg-white p-4">
        <p className="text-sm font-medium text-foreground">How admin access works</p>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>The first successful sign-in on a fresh system is bootstrapped as a Super Admin.</p>
          <p>Super Admins can invite additional people and set each invite to either Admin or Super Admin.</p>
          <p>Roles remain editable later, and Super Admins automatically have all permissions.</p>
          <p>Invited users sign in with their invited email and accept the invite link to join.</p>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invitee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No admin invites yet.
                </TableCell>
              </TableRow>
            ) : (
              invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <div className="font-medium">{invite.full_name}</div>
                    <div className="text-sm text-muted-foreground">{invite.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={invite.role === "super_admin" ? "default" : "secondary"}>
                      {invite.role === "super_admin" ? "Super Admin" : "Admin"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(invite.expires_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {invite.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {invite.status === "pending" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeInvite(invite)}
                        disabled={revokingInviteId === invite.id}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No admin accounts found yet. The first successful sign-in will be promoted to Super Admin automatically unless there is already a pending invite flow in progress.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">
                    {admin.full_name}
                    {admin.id === currentUserId && (
                      <span className="text-xs text-muted-foreground ml-1.5">
                        (you)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{admin.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={admin.role === "super_admin" ? "default" : "secondary"}
                    >
                      {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {admin.role === "super_admin" ? (
                      <span className="text-xs text-muted-foreground">All</span>
                    ) : admin.permissions.length === 0 ? (
                      <span className="text-xs text-muted-foreground">None</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs">
                            {PERMISSION_LABELS[p]}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={admin.is_active ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {admin.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(admin)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(admin)}
                        disabled={
                          admin.id === currentUserId ||
                          togglingId === admin.id
                        }
                        title={admin.is_active ? "Deactivate" : "Activate"}
                      >
                        <Power
                          className={`h-4 w-4 ${
                            admin.is_active
                              ? "text-destructive"
                              : "text-green-600"
                          }`}
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Admin Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invite Admin</DialogTitle>
            <DialogDescription>
              Send an email invite. The recipient will sign in with the invited email and accept the invite to join.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm({ ...createForm, email: e.target.value })
                }
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-name">Full Name *</Label>
              <Input
                id="create-name"
                value={createForm.full_name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, full_name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(val: AdminRole) =>
                  setCreateForm({ ...createForm, role: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Admins get only the permissions you select. Super Admins always have full access.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Invite expiry</Label>
              <Select
                value={createForm.expires_in_days}
                onValueChange={(val) =>
                  setCreateForm({ ...createForm, expires_in_days: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <PermissionsCheckboxes
              selected={createForm.permissions}
              onToggle={toggleCreatePermission}
              disabled={createForm.role === "super_admin"}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              <Mail className="h-4 w-4 mr-2" />
              {creating ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>
              Update admin details, role, and permissions for {editingAdmin?.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={editForm.full_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(val: AdminRole) =>
                  setEditForm({ ...editForm, role: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Switching to Super Admin grants full access and makes individual permissions unnecessary.
              </p>
            </div>
            <PermissionsCheckboxes
              selected={editForm.permissions}
              onToggle={toggleEditPermission}
              disabled={editForm.role === "super_admin"}
            />
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editForm.is_active ? "active" : "inactive"}
                onValueChange={(val) =>
                  setEditForm({ ...editForm, is_active: val === "active" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
