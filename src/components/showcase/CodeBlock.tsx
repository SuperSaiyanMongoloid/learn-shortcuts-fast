import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { SyntaxHighlight } from "./SyntaxHighlight";

interface CodeBlockProps {
  title?: string;
  code: string;
  language?: string;
  highlightLines?: number[];
}

export function CodeBlock({ title, code, highlightLines }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs lowercase text-muted-foreground">{title}</span>
          <button
            onClick={copy}
            className="relative h-6 w-6 flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Copy code"
          >
            <Copy
              className={`h-3.5 w-3.5 absolute transition-all duration-300 ${
                copied
                  ? "opacity-0 scale-50 rotate-12"
                  : "opacity-100 scale-100 rotate-0"
              }`}
              style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            />
            <Check
              className={`h-3.5 w-3.5 absolute text-primary transition-all duration-300 ${
                copied
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-50 -rotate-12"
              }`}
              style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            />
          </button>
        </div>
      )}
      <div className="overflow-x-auto code-scroll border border-border bg-card p-4">
        <pre>
          {highlightLines && highlightLines.length > 0 ? (
            <code className="font-mono text-sm leading-relaxed">
              {lines.map((line, i) => {
                const lineNum = i + 1;
                const isHighlighted = highlightLines.includes(lineNum);
                return (
                  <div
                    key={i}
                    className={`px-1 -mx-1 transition-colors duration-300 ${
                      isHighlighted
                        ? "bg-primary/10 border-l-2 border-primary pl-2"
                        : "border-l-2 border-transparent pl-2"
                    }`}
                  >
                    <SyntaxHighlight code={line} />
                  </div>
                );
              })}
            </code>
          ) : (
            <SyntaxHighlight code={code} />
          )}
        </pre>
      </div>
    </div>
  );
}
