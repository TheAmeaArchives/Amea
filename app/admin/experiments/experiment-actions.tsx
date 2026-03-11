"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteExperiment,
  toggleExperimentPublished,
} from "@/app/admin/actions/experiments";
import { toast } from "@/lib/use-toast";
import type { Experiment } from "@/lib/types";
import Link from "next/link";

export default function ExperimentActions({
  experiment,
}: {
  experiment: Experiment;
}) {
  const router = useRouter();

  async function handleToggle() {
    try {
      await toggleExperimentPublished(experiment.id, !experiment.published);
      toast({
        title: experiment.published
          ? "Experiment unpublished"
          : "Experiment published",
      });
      router.refresh();
    } catch {
      toast({
        title: "Failed to update experiment",
        variant: "destructive",
      });
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this experiment?")) return;
    try {
      await deleteExperiment(experiment.id);
      toast({ title: "Experiment deleted" });
      router.refresh();
    } catch {
      toast({
        title: "Failed to delete experiment",
        variant: "destructive",
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/experiments/${experiment.id}`}>
            <Pencil size={14} className="mr-2" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggle}>
          {experiment.published ? (
            <>
              <EyeOff size={14} className="mr-2" />
              Unpublish
            </>
          ) : (
            <>
              <Eye size={14} className="mr-2" />
              Publish
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 size={14} className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
