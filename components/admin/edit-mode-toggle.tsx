"use client";

import React from "react";
import { useEditMode } from "./edit-mode-context";
import { Pencil, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function EditModeToggle() {
  const { isEditMode, setEditMode, isAdmin } = useEditMode();

  if (!isAdmin) return null;

  return (
    <button
      onClick={() => setEditMode(!isEditMode)}
      className={cn(
        "fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300",
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
  );
}
