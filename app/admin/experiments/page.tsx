import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
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
import type { Experiment } from "@/lib/types";
import ExperimentActions from "./experiment-actions";

export default async function AdminExperimentsPage() {
  const [profile, experiments] = await Promise.all([
    getAdminProfile(),
    fetchServerData<Experiment[]>("/api/admin/experiments"),
  ]);

  if (!profile || !hasPermission(profile, "experiments")) redirect("/admin");

  const items = experiments ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold aileron">Experiments</h1>
          <p className="text-sm text-black/50 mt-1">
            Manage experiments across chambers
          </p>
        </div>
        <Link href="/admin/experiments/new">
          <Button className="bg-default hover:bg-default/90 text-white">
            <Plus size={16} className="mr-2" />
            New Experiment
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border p-12 text-center">
          <p className="text-black/40 text-sm">No experiments yet.</p>
          <Link href="/admin/experiments/new">
            <Button variant="outline" className="mt-4">
              Create your first experiment
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Chamber</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((experiment) => (
                <TableRow key={experiment.id}>
                  <TableCell className="font-medium">
                    {experiment.title}
                  </TableCell>
                  <TableCell className="uppercase text-sm text-black/60">
                    {experiment.chamber}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={experiment.published ? "default" : "secondary"}
                    >
                      {experiment.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-black/50 text-sm">
                    {new Date(experiment.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    <ExperimentActions experiment={experiment} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
