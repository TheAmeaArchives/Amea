import { createClient } from "@/lib/supabase/server";
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

  const supabase = createClient();
  const { data: experiment } = await supabase
    .from("experiments")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!experiment) notFound();

  return <ExperimentEditForm experiment={experiment as Experiment} />;
}
