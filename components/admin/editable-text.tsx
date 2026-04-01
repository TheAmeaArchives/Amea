"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEditMode } from "./edit-mode-context";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateSiteContent } from "@/app/admin/actions/inline-edit";

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  multiline?: boolean;
}

export function EditableText({
  contentKey,
  defaultValue,
  children,
  className,
  as: Component = "span",
  multiline = false,
}: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (value === defaultValue) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateSiteContent(contentKey, value);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(defaultValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Enter" && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isEditMode) {
    return <>{children}</>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full min-h-[100px] p-2 border-2 border-default rounded-md bg-white text-black resize-y",
              "focus:outline-none focus:ring-2 focus:ring-default/50",
              className
            )}
            style={{ fontSize: "inherit", fontFamily: "inherit" }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full p-2 border-2 border-default rounded-md bg-white text-black",
              "focus:outline-none focus:ring-2 focus:ring-default/50",
              className
            )}
            style={{ fontSize: "inherit", fontFamily: "inherit" }}
          />
        )}
        <div className="absolute -bottom-10 right-0 flex gap-1 z-50">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Component
      className={cn("relative inline cursor-pointer group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsEditing(true)}
    >
      <span
        className={cn(
          "relative transition-all duration-200",
          isHovered && "bg-default/10 outline outline-2 outline-default/30 outline-offset-2 rounded"
        )}
      >
        {children}
      </span>
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="absolute -top-3 -right-3 p-1.5 bg-default text-white rounded-full shadow-lg hover:bg-default/90 transition-all z-50 animate-in fade-in zoom-in duration-200"
        >
          <Pencil className="w-3 h-3" />
        </button>
      )}
      {showSuccess && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs rounded whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 z-50">
          Saved!
        </span>
      )}
    </Component>
  );
}
