import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import type { Experiment } from "@/lib/types";
import ExperimentEditForm from "./experiment-edit-form";

export default async function EditExperimentPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getAdminProfile();
  if (!profile || !hasPermission(profile, "experiments")) redirect("/admin");

  const experiment = await fetchServerData<Experiment>(
    `/api/v1/admin/experiments/${encodeURIComponent(params.id)}`
  );

  if (!experiment) notFound();

  return <ExperimentEditForm experiment={experiment} />;
}
