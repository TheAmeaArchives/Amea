"use client";

import React from "react";
import { useEditMode } from "./edit-mode-context";
import { Pencil, Eye, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function EditModeToggle() {
  const { isEditMode, setEditMode, canEditSiteContent } = useEditMode();

  if (!canEditSiteContent) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3">
      <a
        href="/admin"
        className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 font-medium text-sm bg-gray-800 text-white hover:bg-gray-700"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Admin</span>
      </a>
      <button
        onClick={() => setEditMode(!isEditMode)}
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300",
          "font-medium text-sm",
          isEditMode
            ? "bg-default text-white hover:bg-default/90"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        )}
      >
        {isEditMode ? (
          <>
            <Eye className="w-4 h-4" />
            <span>Exit Edit Mode</span>
          </>
        ) : (
          <>
            <Pencil className="w-4 h-4" />
            <span>Edit Page</span>
          </>
        )}
      </button>
    </div>
  );
}
