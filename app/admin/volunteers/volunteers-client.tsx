"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye } from "lucide-react";
import type { VolunteerSubmission } from "@/lib/types";
import { toast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
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
  updateVolunteerStatus,
  deleteVolunteer,
} from "@/app/admin/actions/submissions";

interface VolunteersClientProps {
  volunteers: VolunteerSubmission[];
}

const STATUS_OPTIONS = ["pending", "contacted", "accepted", "rejected"] as const;

const STATUS_BADGE_VARIANT: Record<
  string,
  "secondary" | "outline" | "default" | "destructive"
> = {
  pending: "secondary",
  contacted: "outline",
  accepted: "default",
  rejected: "destructive",
};

export default function VolunteersClient({
  volunteers,
}: VolunteersClientProps) {
  const router = useRouter();
  const [viewing, setViewing] = useState<VolunteerSubmission | null>(null);

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateVolunteerStatus(id, status);
      toast({ title: `Status updated to ${status}` });
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  async function handleDelete(volunteer: VolunteerSubmission) {
    if (
      !confirm(
        `Delete volunteer "${volunteer.name}"? This cannot be undone.`
      )
    )
      return;
    try {
      await deleteVolunteer(volunteer.id);
      toast({ title: "Volunteer deleted" });
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Volunteer Submissions
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and manage volunteer applications.
        </p>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead className="w-40">Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No volunteer submissions yet
                </TableCell>
              </TableRow>
            ) : (
              volunteers.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-sm">{v.email}</TableCell>
                  <TableCell className="text-sm">
                    {v.whatsapp || "—"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={v.status}
                      onValueChange={(val) => handleStatusChange(v.id, val)}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            <Badge
                              variant={STATUS_BADGE_VARIANT[opt]}
                              className="text-xs"
                            >
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(v.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View details"
                        onClick={() => setViewing(v)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(v)}
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

      <Dialog
        open={!!viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      >
        <DialogContent>
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.name}</DialogTitle>
                <DialogDescription>
                  Submitted {formatDate(viewing.created_at)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Email
                    </span>
                    <a
                      href={`mailto:${viewing.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {viewing.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">
                      WhatsApp
                    </span>
                    <span>{viewing.whatsapp || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Status
                    </span>
                    <Badge variant={STATUS_BADGE_VARIANT[viewing.status]}>
                      {viewing.status.charAt(0).toUpperCase() +
                        viewing.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Select
                  value={viewing.status}
                  onValueChange={(val) => {
                    handleStatusChange(viewing.id, val);
                    setViewing({ ...viewing, status: val as VolunteerSubmission["status"] });
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleDelete(viewing);
                    setViewing(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
