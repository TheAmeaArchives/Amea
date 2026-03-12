"use client";

import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentBlock {
  id?: string;
  type: string;
  props?: Record<string, any>;
  content?: ContentBlock[] | string | { type: string; text: string; styles?: Record<string, any> }[];
  children?: ContentBlock[];
  text?: string;
}

interface BlogPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  createdAt?: string;
  isPublished?: boolean;
}

function renderInlineContent(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((item) => {
      if (typeof item === "string") return item;
      if (item.text) return item.text;
      if (item.content) return renderInlineContent(item.content);
      return "";
    }).join("");
  }
  return "";
}

function renderBlock(block: ContentBlock, index: number): React.ReactNode {
  const key = block.id || index;
  const textContent = renderInlineContent(block.content);

  switch (block.type) {
    case "paragraph":
      return (
        <p key={key} className="mb-4 text-gray-700 leading-relaxed">
          {textContent || <span className="text-gray-300">&nbsp;</span>}
        </p>
      );
    case "heading":
      const level = block.props?.level || 1;
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      const headingClasses: Record<number, string> = {
        1: "text-3xl font-bold mb-4 mt-6",
        2: "text-2xl font-bold mb-3 mt-5",
        3: "text-xl font-semibold mb-2 mt-4",
      };
      return (
        <HeadingTag key={key} className={headingClasses[level] || headingClasses[1]}>
          {textContent}
        </HeadingTag>
      );
    case "bulletListItem":
      return (
        <li key={key} className="ml-6 list-disc mb-1">
          {textContent}
        </li>
      );
    case "numberedListItem":
      return (
        <li key={key} className="ml-6 list-decimal mb-1">
          {textContent}
        </li>
      );
    case "checkListItem":
      const checked = block.props?.checked || false;
      return (
        <div key={key} className="flex items-start gap-2 mb-1">
          <input type="checkbox" checked={checked} readOnly className="mt-1" />
          <span className={checked ? "line-through text-gray-400" : ""}>{textContent}</span>
        </div>
      );
    case "image":
      return (
        <div key={key} className="my-4">
          <img
            src={block.props?.url || ""}
            alt={block.props?.caption || "Image"}
            className="max-w-full h-auto rounded-lg"
          />
          {block.props?.caption && (
            <p className="text-sm text-gray-500 mt-2 text-center">{block.props.caption}</p>
          )}
        </div>
      );
    case "codeBlock":
      return (
        <pre key={key} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono">
          <code>{textContent}</code>
        </pre>
      );
    case "table":
      return (
        <div key={key} className="my-4 overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <tbody>
              {block.content && Array.isArray(block.content) && block.content.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className="border-b border-gray-200">
                  {row.cells && row.cells.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex} className="px-4 py-2 border-r border-gray-200">
                      {renderInlineContent(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      if (textContent) {
        return (
          <p key={key} className="mb-4 text-gray-700 leading-relaxed">
            {textContent}
          </p>
        );
      }
      return null;
  }
}

function renderContent(content: string): React.ReactNode {
  if (!content) return <p className="text-gray-400 italic">No content yet...</p>;

  try {
    const parsed = JSON.parse(content);

    if (typeof parsed === "string") {
      return <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{parsed}</p>;
    }

    if (Array.isArray(parsed)) {
      return <div>{parsed.map((block, index) => renderBlock(block, index))}</div>;
    }

    if (parsed && typeof parsed === "object") {
      if (parsed.type) {
        return renderBlock(parsed, 0);
      }
      return <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{JSON.stringify(parsed, null, 2)}</p>;
    }

    return <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{String(parsed)}</p>;
  } catch {
    return <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>;
  }
}

export function BlogPreview({
  isOpen,
  onClose,
  title,
  excerpt,
  content,
  coverImage,
  createdAt,
  isPublished = false,
}: BlogPreviewProps) {
  if (!isOpen) return null;

  const displayDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).toUpperCase()
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Preview Mode</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              isPublished 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 bg-white">
          <article className="min-h-full">
            <div className="inline-flex items-center gap-2 text-default mb-6 sm:mb-8 text-sm sm:text-base cursor-default">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Back to Blog</span>
            </div>

            <header className="mb-8 sm:mb-10 md:mb-12">
              <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-3 sm:mb-4">
                {displayDate}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold editor-font mb-4 sm:mb-5 md:mb-6 leading-tight">
                {title || "Untitled Post"}
              </h1>
              {excerpt && (
                <p className="text-base sm:text-lg md:text-xl text-gray-600 aileron font-light max-w-3xl">
                  {excerpt}
                </p>
              )}
            </header>

            {coverImage && (
              <div className="mb-8 sm:mb-10 md:mb-12">
                <img
                  src={coverImage}
                  alt={title || "Cover image"}
                  className="w-full max-w-4xl h-auto max-h-[300px] sm:max-h-[400px] object-cover rounded-lg"
                />
              </div>
            )}

            <div className="max-w-4xl aileron font-light text-sm sm:text-base md:text-lg">
              {renderContent(content)}
            </div>
          </article>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
