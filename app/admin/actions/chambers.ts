"use server";

import { requestServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function upsertChamberStat(id: string | null, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "chambers")) throw new Error("Unauthorized");

  const data = {
    label: formData.get("label") as string,
    value: formData.get("value") as string,
    chamber: "ii",
    order_index: parseInt(formData.get("order_index") as string, 10) || 0,
  };

  if (id) {
    await requestServerData({
      path: `/api/v1/admin/chamber-stats/${encodeURIComponent(id)}`,
      method: "PATCH",
      body: data,
    });
  } else {
    await requestServerData({
      path: "/api/v1/admin/chamber-stats",
      method: "POST",
      body: data,
    });
  }

  revalidatePath("/admin/chambers");
  revalidatePath("/chambers/ii");
}

export async function deleteChamberStat(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "chambers")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/v1/admin/chamber-stats/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/chambers");
  revalidatePath("/chambers/ii");
}

export async function upsertChamberBelief(id: string | null, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "chambers")) throw new Error("Unauthorized");

  const data = {
    title: formData.get("title") as string,
    content: (formData.get("content") as string) || null,
    chamber: "ii",
    order_index: parseInt(formData.get("order_index") as string, 10) || 0,
  };

  if (id) {
    await requestServerData({
      path: `/api/v1/admin/chamber-beliefs/${encodeURIComponent(id)}`,
      method: "PATCH",
      body: data,
    });
  } else {
    await requestServerData({
      path: "/api/v1/admin/chamber-beliefs",
      method: "POST",
      body: data,
    });
  }

  revalidatePath("/admin/chambers");
  revalidatePath("/chambers/ii");
}

export async function deleteChamberBelief(id: string) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "chambers")) throw new Error("Unauthorized");

  await requestServerData({
    path: `/api/v1/admin/chamber-beliefs/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  revalidatePath("/admin/chambers");
  revalidatePath("/chambers/ii");
}

export async function upsertChamberContent(id: string | null, formData: FormData) {
  const profile = await getAdminProfile();
  if (!hasPermission(profile, "chambers")) throw new Error("Unauthorized");

  const data = {
    chamber: formData.get("chamber") as string,
    section: formData.get("section") as string,
    content: (formData.get("content") as string) || null,
  };

  if (id) {
    await requestServerData({
      path: `/api/v1/admin/chamber-content/${encodeURIComponent(id)}`,
      method: "PATCH",
      body: data,
    });
  } else {
    await requestServerData({
      path: "/api/v1/admin/chamber-content",
      method: "POST",
      body: data,
    });
  }

  revalidatePath("/admin/chambers");
  revalidatePath("/chambers/iii");
}
