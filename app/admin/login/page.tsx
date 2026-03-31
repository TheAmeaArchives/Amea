import { redirect } from "next/navigation";
import { getCurrentAdminProfile } from "@/lib/auth/server";
import AdminLoginForm from "./admin-login-form";

export default async function AdminLoginPage() {
  const profile = await getCurrentAdminProfile();

  if (profile?.is_active) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
