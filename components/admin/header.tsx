"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ExternalLink } from "lucide-react";
import type { AdminProfile } from "@/lib/types";
import { logout } from "@/app/admin/actions/auth";

export default function AdminHeader({ profile }: { profile: AdminProfile }) {
  async function handleLogout() {
    await logout();
  }

  const initials = profile.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/10 bg-white px-6 lg:px-8">
      <div className="lg:hidden w-10" />
      <h2 className="text-lg font-semibold aileron hidden lg:block">
        The Amea Archives
      </h2>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden sm:inline">View Site</span>
        </Link>

        <Badge
          variant={profile.role === "super_admin" ? "default" : "secondary"}
          className="hidden sm:inline-flex"
        >
          {profile.role === "super_admin" ? "Super Admin" : "Admin"}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-black text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {profile.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-default cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
