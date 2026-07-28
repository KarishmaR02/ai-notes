"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  message: {
    role: string;
    content?: string;
    parts?: Array<{ type: string; text?: string }>;
  };
};

function CodeBlock({ code, language, ...rest }: { code: string; language: string; [key: string]: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-700/50 shadow-md">
      <div className="bg-gray-800 text-gray-300 text-xs px-4 py-1.5 flex justify-between items-center border-b border-gray-700 font-mono">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer hover:underline bg-transparent border-0 flex items-center gap-1 font-semibold"
        >
          {copied ? (
            <span className="text-green-400">✓ Copied!</span>
          ) : (
            <span>Copy code</span>
          )}
        </button>
      </div>
      {/* @ts-ignore */}
      <SyntaxHighlighter
        {...rest}
        PreTag="div"
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: "1rem", fontSize: "0.875rem", background: "#1e1e1e" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function Message({ message }: Props) {
  const isUser = message.role === "user";
  const textContent =
    message.content ||
    message.parts?.filter((p) => p.type === "text").map((p) => p.text).join("") ||
    "";

  const textColor = isUser ? "text-white" : "text-gray-900";
  const linkColor = isUser ? "text-blue-200 hover:text-white" : "text-blue-600 hover:text-blue-800";
  const headingColor = isUser ? "text-white" : "text-gray-900";
  const codeBg = isUser ? "bg-blue-700/50 text-blue-100" : "bg-gray-100 text-red-600";
  const blockquoteColor = isUser ? "border-blue-300 text-blue-100 bg-blue-700/30" : "border-gray-300 text-gray-600 bg-gray-50";
  const tableBorder = isUser ? "border-blue-400" : "border-gray-200";
  const tableHeaderBg = isUser ? "bg-blue-700/50" : "bg-gray-100";
  const tableHeaderTextColor = isUser ? "text-white" : "text-gray-800";
  const tableRowBorder = isUser ? "border-blue-500/30" : "border-gray-100";
  const tableRowBgOdd = isUser ? "bg-blue-600" : "bg-white";
  const tableRowBgEven = isUser ? "bg-blue-700/30" : "bg-gray-50/50";

  return (
    <div
      className={`p-4 rounded-lg max-w-[85%] ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-white text-gray-900 border border-gray-200 shadow-sm"
      }`}
    >
      <strong className={`block text-xs mb-1.5 ${isUser ? "text-blue-100" : "text-gray-500"}`}>
        {isUser ? "You" : "AI Assistant"}
      </strong>

      <div className="text-sm leading-relaxed break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className={`text-xl font-bold mt-4 mb-2 ${headingColor}`}>{children}</h1>,
            h2: ({ children }) => <h2 className={`text-lg font-bold mt-3 mb-2 ${headingColor}`}>{children}</h2>,
            h3: ({ children }) => <h3 className={`text-md font-bold mt-2 mb-1 ${headingColor}`}>{children}</h3>,
            p: ({ children }) => <p className={`mb-3 last:mb-0 leading-relaxed ${textColor}`}>{children}</p>,
            ul: ({ children }) => <ul className={`list-disc pl-5 my-2 space-y-1 ${textColor}`}>{children}</ul>,
            ol: ({ children }) => <ol className={`list-decimal pl-5 my-2 space-y-1 ${textColor}`}>{children}</ol>,
            li: ({ children }) => <li className="my-0.5">{children}</li>,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkColor} underline transition-colors cursor-pointer`}
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className={`border-l-4 pl-4 italic my-3 py-1 pr-2 rounded-r ${blockquoteColor}`}>
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4 w-full">
                <table className={`min-w-full border-collapse rounded-lg overflow-hidden border ${tableBorder} shadow-xs`}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className={`${tableHeaderBg} border-b ${tableBorder}`}>{children}</thead>,
            th: ({ children }) => (
              <th className={`text-left font-semibold p-2.5 text-xs uppercase tracking-wider ${tableHeaderTextColor}`}>
                {children}
              </th>
            ),
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => <tr className={`border-b ${tableRowBorder} odd:${tableRowBgOdd} even:${tableRowBgEven}`}>{children}</tr>,
            td: ({ children }) => <td className={`p-2.5 text-sm ${textColor}`}>{children}</td>,
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");
              
              if (match) {
                return (
                  <CodeBlock
                    code={codeString}
                    language={match[1]}
                    {...rest}
                  />
                );
              }
              
              return (
                <code
                  {...rest}
                  className={`${codeBg} rounded px-1.5 py-0.5 font-mono text-xs`}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {textContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}