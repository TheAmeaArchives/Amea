"use client";

import React from "react";

interface ContentBlock {
  id?: string;
  type: string;
  props?: Record<string, any>;
  content?: ContentBlock[] | string | { type: string; text: string; styles?: Record<string, any> }[];
  children?: ContentBlock[];
  text?: string;
}

function renderInlineContent(content: any): React.ReactNode {
  if (!content) return "";
  if (typeof content === "string") return content;
  
  if (Array.isArray(content)) {
    return content.map((item, index) => {
      if (typeof item === "string") return item;
      if (item.text) {
        const styles = item.styles || {};
        let element: React.ReactNode = item.text;
        
        if (styles.bold) {
          element = <strong key={`bold-${index}`}>{element}</strong>;
        }
        if (styles.italic) {
          element = <em key={`italic-${index}`}>{element}</em>;
        }
        if (styles.underline) {
          element = <u key={`underline-${index}`}>{element}</u>;
        }
        if (styles.strikethrough) {
          element = <s key={`strike-${index}`}>{element}</s>;
        }
        if (styles.code) {
          element = <code key={`code-${index}`} className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">{element}</code>;
        }
        
        return <React.Fragment key={index}>{element}</React.Fragment>;
      }
      if (item.content) return renderInlineContent(item.content);
      return "";
    });
  }
  
  return "";
}

function renderBlock(block: ContentBlock, index: number): React.ReactNode {
  const key = block.id || `block-${index}`;
  const textContent = renderInlineContent(block.content);

  switch (block.type) {
    case "paragraph":
      return (
        <p key={key} className="mb-6 text-gray-700 leading-relaxed text-lg">
          {textContent || <span>&nbsp;</span>}
        </p>
      );
      
    case "heading":
      const level = block.props?.level || 1;
      const headingClasses: Record<number, string> = {
        1: "text-4xl font-bold mb-6 mt-10 text-gray-900",
        2: "text-3xl font-bold mb-5 mt-8 text-gray-900",
        3: "text-2xl font-semibold mb-4 mt-6 text-gray-900",
      };
      const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
      return (
        <HeadingTag key={key} className={headingClasses[level] || headingClasses[1]}>
          {textContent}
        </HeadingTag>
      );
      
    case "bulletListItem":
      return (
        <li key={key} className="ml-6 list-disc mb-2 text-gray-700 leading-relaxed text-lg">
          {textContent}
        </li>
      );
      
    case "numberedListItem":
      return (
        <li key={key} className="ml-6 list-decimal mb-2 text-gray-700 leading-relaxed text-lg">
          {textContent}
        </li>
      );
      
    case "checkListItem":
      const checked = block.props?.checked || false;
      return (
        <div key={key} className="flex items-start gap-3 mb-2">
          <input 
            type="checkbox" 
            checked={checked} 
            readOnly 
            className="mt-1.5 h-4 w-4 rounded border-gray-300" 
          />
          <span className={`text-lg leading-relaxed ${checked ? "line-through text-gray-400" : "text-gray-700"}`}>
            {textContent}
          </span>
        </div>
      );
      
    case "image":
      return (
        <figure key={key} className="my-8">
          <img
            src={block.props?.url || ""}
            alt={block.props?.caption || "Image"}
            className="w-full h-auto rounded-lg"
          />
          {block.props?.caption && (
            <figcaption className="text-sm text-gray-500 mt-3 text-center italic">
              {block.props.caption}
            </figcaption>
          )}
        </figure>
      );
      
    case "codeBlock":
      return (
        <pre key={key} className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-6 text-sm font-mono">
          <code>{textContent}</code>
        </pre>
      );
      
    case "table":
      return (
        <div key={key} className="my-6 overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <tbody>
              {block.content && Array.isArray(block.content) && block.content.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.cells && row.cells.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex} className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {renderInlineContent(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      
    case "video":
      return (
        <div key={key} className="my-8">
          <video
            src={block.props?.url || ""}
            controls
            className="w-full rounded-lg"
          />
          {block.props?.caption && (
            <p className="text-sm text-gray-500 mt-3 text-center italic">
              {block.props.caption}
            </p>
          )}
        </div>
      );
      
    case "audio":
      return (
        <div key={key} className="my-6">
          <audio
            src={block.props?.url || ""}
            controls
            className="w-full"
          />
        </div>
      );
      
    case "file":
      return (
        <a
          key={key}
          href={block.props?.url || "#"}
          download
          className="flex items-center gap-2 p-4 my-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-gray-700">{block.props?.name || "Download file"}</span>
        </a>
      );
      
    default:
      if (textContent) {
        return (
          <p key={key} className="mb-6 text-gray-700 leading-relaxed text-lg">
            {textContent}
          </p>
        );
      }
      return null;
  }
}

interface BlogContentRendererProps {
  content: any;
  className?: string;
}

export function BlogContentRenderer({ content, className = "" }: BlogContentRendererProps) {
  if (!content) {
    return <p className="text-gray-400 italic">No content available.</p>;
  }

  let parsedContent: any;

  if (typeof content === "string") {
    try {
      parsedContent = JSON.parse(content);
    } catch {
      return <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{content}</p>;
    }
  } else {
    parsedContent = content;
  }

  if (typeof parsedContent === "string") {
    return <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{parsedContent}</p>;
  }

  if (Array.isArray(parsedContent)) {
    return (
      <div className={className}>
        {parsedContent.map((block, index) => renderBlock(block, index))}
      </div>
    );
  }

  if (parsedContent && typeof parsedContent === "object") {
    if (parsedContent.type) {
      return <div className={className}>{renderBlock(parsedContent, 0)}</div>;
    }
  }

  return <p className="text-gray-700 leading-relaxed text-lg">{String(parsedContent)}</p>;
}
