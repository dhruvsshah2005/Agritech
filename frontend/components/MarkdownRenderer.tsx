// src/components/renderWithLatex.tsx
import React from "react";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";

export function MarkdownLaTeX({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="prose prose-indigo dark:prose-invert max-w-none leading-relaxed">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-3">{children}</p>,

          code: ({ className, children }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1 py-0.5 bg-gray-200 rounded text-sm">
                {children}
              </code>
            ) : (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm overflow-x-auto border border-gray-700">
                <code>{children}</code>
              </pre>
            );
          },

          // Headings
          h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold mb-2">{children}</h3>,
          h4: ({ children }) => <h4 className="text-lg font-medium mb-2">{children}</h4>,
          h5: ({ children }) => <h5 className="text-base font-medium mb-1">{children}</h5>,
          h6: ({ children }) => <h6 className="text-sm font-medium mb-1">{children}</h6>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
