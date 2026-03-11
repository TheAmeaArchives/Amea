import { getAdminProfile, hasPermission } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  FlaskConical,
  Users,
  Image as ImageIcon,
  Mail,
  HandHelping,
} from "lucide-react";
import Link from "next/link";
import type { Permission } from "@/lib/types";

interface StatCard {
  label: string;
  count: number;
  icon: React.ReactNode;
  href: string;
  permission: Permission;
}

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    profile,
    { count: blogCount },
    { count: experimentCount },
    { count: teamCount },
    { count: galleryCount },
    { count: contactCount },
    { count: volunteerCount },
  ] = await Promise.all([
    getAdminProfile(),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("experiments").select("*", { count: "exact", head: true }),
    supabase.from("team_members").select("*", { count: "exact", head: true }),
    supabase.from("gallery_items").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("read", false),
    supabase.from("volunteer_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  if (!profile) redirect("/admin/login");

  const stats: StatCard[] = [
    {
      label: "Blog Posts",
      count: blogCount ?? 0,
      icon: <FileText size={24} />,
      href: "/admin/blog",
      permission: "blog",
    },
    {
      label: "Experiments",
      count: experimentCount ?? 0,
      icon: <FlaskConical size={24} />,
      href: "/admin/experiments",
      permission: "experiments",
    },
    {
      label: "Team Members",
      count: teamCount ?? 0,
      icon: <Users size={24} />,
      href: "/admin/team",
      permission: "team",
    },
    {
      label: "Gallery Items",
      count: galleryCount ?? 0,
      icon: <ImageIcon size={24} />,
      href: "/admin/gallery",
      permission: "gallery",
    },
    {
      label: "Unread Contacts",
      count: contactCount ?? 0,
      icon: <Mail size={24} />,
      href: "/admin/contacts",
      permission: "contacts",
    },
    {
      label: "Pending Volunteers",
      count: volunteerCount ?? 0,
      icon: <HandHelping size={24} />,
      href: "/admin/volunteers",
      permission: "volunteers",
    },
  ];

  const visibleStats = stats.filter((s) => hasPermission(profile, s.permission));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold aileron">
          Welcome back, {profile.full_name.split(" ")[0]}
        </h1>
        <p className="text-sm text-black/50 mt-1">
          Here&apos;s an overview of your content
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleStats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-black/60">
                  {stat.label}
                </CardTitle>
                <div className="text-default">{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.count}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
