"use client";

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
  return (
    <EditorComponent
      initialContent={initialContent}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
