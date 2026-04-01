"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface BlogEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const EditorComponent = dynamic(
  () => import("./blog-editor-inner").then((mod) => mod.BlogEditorInner),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading editor...</div>
      </div>
    ),
  }
);

export function BlogEditor({ initialContent, onChange, placeholder }: BlogEditorProps) {
  const [mounted, setMounted] = useState(false);
  const initialContentRef = useRef(initialContent);
  const placeholderRef = useRef(placeholder);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <EditorComponent
      initialContent={initialContentRef.current}
      onChange={onChange}
      placeholder={placeholderRef.current}
    />
  );
}
