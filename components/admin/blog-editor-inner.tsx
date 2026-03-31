"use client";

import { useMemo } from "react";
import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

interface BlogEditorInnerProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function BlogEditorInner({ initialContent, onChange, placeholder }: BlogEditorInnerProps) {
  const parsedInitialContent = useMemo(() => {
    if (!initialContent) return undefined;

    try {
      const parsed = JSON.parse(initialContent);
      if (Array.isArray(parsed)) {
        return parsed as PartialBlock[];
      }
    } catch {
      return undefined;
    }
    return undefined;
  }, [initialContent]);

  const editor = useCreateBlockNote({
    initialContent: parsedInitialContent,
    placeholders: placeholder
      ? {
          emptyDocument: placeholder,
        }
      : undefined,
  }, []);

  return (
    <div className="blog-editor-wrapper">
      <BlockNoteView 
        editor={editor} 
        onChange={() => {
          const blocks = editor.document;
          onChange(JSON.stringify(blocks));
        }}
        theme="light"
      />
      <style jsx global>{`
        .blog-editor-wrapper {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
          background: white;
        }
        
        .blog-editor-wrapper .bn-container {
          width: 100%;
        }
        
        .blog-editor-wrapper .bn-editor {
          padding: 1.5rem 2rem;
          min-height: 400px;
          font-family: 'Charter', 'Georgia', 'Cambria', serif;
        }
        
        .blog-editor-wrapper .bn-block-group {
          width: 100%;
        }
        
        .blog-editor-wrapper .bn-block-outer {
          width: 100%;
        }
        
        .blog-editor-wrapper .bn-block {
          width: 100%;
        }
        
        .blog-editor-wrapper .bn-block-content {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #374151;
          width: 100%;
          flex-grow: 1;
        }
        
        .blog-editor-wrapper .bn-inline-content {
          width: 100%;
          min-width: 100%;
          display: block;
        }
        
        .blog-editor-wrapper [data-content-type="paragraph"] .bn-inline-content {
          cursor: text;
        }
        
        .blog-editor-wrapper .bn-block-content[data-content-type="heading"] {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #111827;
          font-weight: 700;
        }
        
        .blog-editor-wrapper .bn-block-content[data-content-type="heading"][data-level="1"] {
          font-size: 2.25rem;
          line-height: 1.2;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .blog-editor-wrapper .bn-block-content[data-content-type="heading"][data-level="2"] {
          font-size: 1.75rem;
          line-height: 1.3;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        
        .blog-editor-wrapper .bn-block-content[data-content-type="heading"][data-level="3"] {
          font-size: 1.375rem;
          line-height: 1.4;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .blog-editor-wrapper [data-placeholder]::before {
          color: #9ca3af;
          font-style: italic;
        }
        
        .blog-editor-wrapper .bn-side-menu {
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        
        .blog-editor-wrapper .bn-block-outer:hover .bn-side-menu {
          opacity: 1;
        }
        
        .blog-editor-wrapper .bn-formatting-toolbar {
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .blog-editor-wrapper .bn-inline-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
          font-size: 0.9em;
        }
        
        .blog-editor-wrapper blockquote {
          border-left: 3px solid #e9190f;
          padding-left: 1.25rem;
          margin-left: 0;
          color: #4b5563;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
