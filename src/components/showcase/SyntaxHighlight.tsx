/**
 * Lightweight zero-dependency syntax highlighter for JSX/TSX code blocks.
 * Tokenizes keywords, strings, comments, types, and JSX tags.
 */

import { Fragment } from "react";

type TokenType = "keyword" | "string" | "comment" | "type" | "function" | "number" | "punctuation" | "jsx-tag" | "plain";

interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "import", "export", "from", "const", "let", "var", "function", "return",
  "if", "else", "for", "while", "new", "typeof", "instanceof", "default",
  "async", "await", "class", "extends", "true", "false", "null", "undefined",
  "type", "interface",
]);

const TYPE_KEYWORDS = new Set(["string", "number", "boolean", "void", "any", "never", "unknown"]);

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Single-line comment
    if (code[i] === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i);
      const slice = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: "comment", value: slice });
      i += slice.length;
      continue;
    }

    // Strings (double/single/backtick)
    if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
      const quote = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== quote) {
        if (code[j] === "\\") j++;
        j++;
      }
      tokens.push({ type: "string", value: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Numbers
    if (/\d/.test(code[i]) && (i === 0 || /[\s=:(,\[]/.test(code[i - 1]))) {
      let j = i;
      while (j < code.length && /[\d.]/.test(code[j])) j++;
      tokens.push({ type: "number", value: code.slice(i, j) });
      i = j;
      continue;
    }

    // JSX tags: <Component or </div
    if (code[i] === "<" && /[A-Za-z/]/.test(code[i + 1] || "")) {
      let j = i;
      // closing slash
      if (code[j + 1] === "/") j++;
      j++;
      while (j < code.length && /[A-Za-z0-9.]/.test(code[j])) j++;
      tokens.push({ type: "jsx-tag", value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Words (identifiers/keywords)
    if (/[A-Za-z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);

      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (TYPE_KEYWORDS.has(word)) {
        tokens.push({ type: "type", value: word });
      } else if (j < code.length && code[j] === "(") {
        tokens.push({ type: "function", value: word });
      } else if (word[0] === word[0].toUpperCase() && /[a-z]/.test(word.slice(1))) {
        tokens.push({ type: "type", value: word });
      } else {
        tokens.push({ type: "plain", value: word });
      }
      i = j;
      continue;
    }

    // Punctuation clusters
    if (/[{}()=>;,.<>:?!&|/\[\]+\-*%@#~^]/.test(code[i])) {
      tokens.push({ type: "punctuation", value: code[i] });
      i++;
      continue;
    }

    // Whitespace / other
    let j = i;
    while (j < code.length && !/[A-Za-z0-9_$"'`</{}\[\]();=,.:!&|+\-*%@#~^?/>\\]/.test(code[j]) && code[j] !== "/") {
      j++;
    }
    if (j === i) j = i + 1;
    tokens.push({ type: "plain", value: code.slice(i, j) });
    i = j;
  }

  return tokens;
}

const TOKEN_CLASSES: Record<TokenType, string> = {
  keyword: "text-primary",
  string: "text-emerald-400",
  comment: "text-muted-foreground/40 italic",
  type: "text-sky-400",
  function: "text-amber-300",
  number: "text-orange-400",
  punctuation: "text-muted-foreground/60",
  "jsx-tag": "text-sky-400",
  plain: "text-foreground/70",
};

interface SyntaxHighlightProps {
  code: string;
}

export function SyntaxHighlight({ code }: SyntaxHighlightProps) {
  const tokens = tokenize(code);

  return (
    <code className="font-mono text-sm leading-relaxed">
      {tokens.map((token, i) => (
        <span key={i} className={TOKEN_CLASSES[token.type]}>
          {token.value}
        </span>
      ))}
    </code>
  );
}
