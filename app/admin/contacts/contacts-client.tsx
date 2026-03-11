"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Mail, MailOpen, Eye } from "lucide-react";
import type { ContactSubmission } from "@/lib/types";
import { toast } from "@/lib/use-toast";
import { cn } from "@/lib/utils";
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
  markContactRead,
  deleteContact,
} from "@/app/admin/actions/submissions";

interface ContactsClientProps {
  contacts: ContactSubmission[];
}

export default function ContactsClient({ contacts }: ContactsClientProps) {
  const router = useRouter();
  const [viewing, setViewing] = useState<ContactSubmission | null>(null);

  async function handleToggleRead(contact: ContactSubmission) {
    try {
      await markContactRead(contact.id, !contact.read);
      toast({ title: contact.read ? "Marked as unread" : "Marked as read" });
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  async function handleDelete(contact: ContactSubmission) {
    if (
      !confirm(
        `Delete message from "${contact.name}"? This cannot be undone.`
      )
    )
      return;
    try {
      await deleteContact(contact.id);
      toast({ title: "Contact deleted" });
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
          Contact Submissions
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage messages from the contact form.
        </p>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="max-w-xs">Message</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No contact submissions yet
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((c) => (
                <TableRow
                  key={c.id}
                  className={cn(
                    "cursor-pointer",
                    !c.read && "bg-blue-50/60 hover:bg-blue-50"
                  )}
                  onClick={() => setViewing(c)}
                >
                  <TableCell
                    className={cn("font-medium", !c.read && "font-semibold")}
                  >
                    {c.name}
                  </TableCell>
                  <TableCell className="text-sm">{c.email}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                    {c.message.length > 60
                      ? c.message.slice(0, 60) + "…"
                      : c.message}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.read ? "secondary" : "default"}>
                      {c.read ? "Read" : "Unread"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(c.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className="flex justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        title={c.read ? "Mark unread" : "Mark read"}
                        onClick={() => handleToggleRead(c)}
                      >
                        {c.read ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <MailOpen className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View message"
                        onClick={() => setViewing(c)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c)}
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

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>Message from {viewing.name}</DialogTitle>
                <DialogDescription>
                  {viewing.email} &middot; {formatDate(viewing.created_at)}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {viewing.message}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleRead(viewing)}
                >
                  {viewing.read ? (
                    <>
                      <Mail className="h-4 w-4 mr-1" />
                      Mark Unread
                    </>
                  ) : (
                    <>
                      <MailOpen className="h-4 w-4 mr-1" />
                      Mark Read
                    </>
                  )}
                </Button>
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
