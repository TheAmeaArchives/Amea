import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAdminProfile } from "@/lib/admin";
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";

export const metadata = {
  title: "Admin | The Amea Archives",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = headers().get("x-url") ?? "";

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isBlogEditor = pathname.includes("/admin/blog/new") || 
    (pathname.includes("/admin/blog/") && pathname !== "/admin/blog");
  
  if (isBlogEditor) {
    const profile = await getAdminProfile();
    if (!profile || !profile.is_active) {
      redirect("/admin/login");
    }
    return <>{children}</>;
  }

  const profile = await getAdminProfile();

  if (!profile || !profile.is_active) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader profile={profile} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
