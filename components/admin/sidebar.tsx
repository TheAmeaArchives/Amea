"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AdminProfile, Permission } from "@/lib/types";
import {
  LayoutDashboard,
  FileText,
  FlaskConical,
  Users,
  Image as ImageIcon,
  Presentation,
  Heart,
  Building2,
  Mail,
  HandHelping,
  Globe,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: Permission;
  superAdminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Blog Posts",
    href: "/admin/blog",
    icon: <FileText size={18} />,
    permission: "blog",
  },
  {
    label: "Experiments",
    href: "/admin/experiments",
    icon: <FlaskConical size={18} />,
    permission: "experiments",
  },
  {
    label: "Team",
    href: "/admin/team",
    icon: <Users size={18} />,
    permission: "team",
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: <ImageIcon size={18} />,
    permission: "gallery",
  },
  {
    label: "Programs",
    href: "/admin/programs",
    icon: <Presentation size={18} />,
    permission: "programs",
  },
  {
    label: "Supporters",
    href: "/admin/supporters",
    icon: <Heart size={18} />,
    permission: "supporters",
  },
  {
    label: "Chambers",
    href: "/admin/chambers",
    icon: <Building2 size={18} />,
    permission: "chambers",
  },
  {
    label: "Contacts",
    href: "/admin/contacts",
    icon: <Mail size={18} />,
    permission: "contacts",
  },
  {
    label: "Volunteers",
    href: "/admin/volunteers",
    icon: <HandHelping size={18} />,
    permission: "volunteers",
  },
  {
    label: "Site Content",
    href: "/admin/site-content",
    icon: <Globe size={18} />,
    permission: "site_content",
  },
  {
    label: "Manage Admins",
    href: "/admin/admins",
    icon: <ShieldCheck size={18} />,
    superAdminOnly: true,
  },
];

export default function AdminSidebar({
  profile,
}: {
  profile: AdminProfile;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredItems = navItems.filter((item) => {
    if (item.superAdminOnly) return profile.role === "super_admin";
    if (!item.permission) return true;
    if (profile.role === "super_admin") return true;
    return profile.permissions.includes(item.permission);
  });

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-4">
      {filteredItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200",
            isActive(item.href)
              ? "bg-default text-white"
              : "text-black/60 hover:bg-black/5 hover:text-black"
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-md bg-white p-2 shadow-md lg:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-black/10 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-black/10 px-6">
          <div className="h-8 w-8 rounded-full bg-default flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Amea Admin</p>
            <p className="text-xs text-black/40 capitalize">{profile.role.replace("_", " ")}</p>
          </div>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
