"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function markContactRead(id: string, read: boolean) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "contacts")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/contact-submissions/${encodeURIComponent(id)}/read`,
    method: "PATCH",
    body: { read },
  });
  revalidatePath("/admin/contacts");
}

export async function deleteContact(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "contacts")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/contact-submissions/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/contacts");
}

export async function updateVolunteerStatus(id: string, status: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "volunteers")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/volunteer-submissions/${encodeURIComponent(id)}/status`,
    method: "PATCH",
    body: { status },
  });
  revalidatePath("/admin/volunteers");
}

export async function deleteVolunteer(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "volunteers")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/admin/volunteer-submissions/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/volunteers");
}
