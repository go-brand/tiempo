import type { ReactNode } from "react";

// Syntax highlighting for code examples
function highlightCode(code: string): ReactNode[] {
  const keywords = [
    "import",
    "from",
    "const",
    "let",
    "var",
    "function",
    "return",
    "async",
    "await",
  ];
  const keywordPattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");

  return code.split("\n").map((line, lineIndex) => {
    const parts: ReactNode[] = [];
    let partKey = 0;

    // Handle comments first
    const commentIndex = line.indexOf("//");
    const mainPart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
    const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : "";

    // Find all strings in the main part
    const stringPattern = /('[^']*'|"[^"]*")/g;
    const stringMatches: { start: number; end: number; text: string }[] = [];

    let match = stringPattern.exec(mainPart);
    while (match !== null) {
      stringMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
      match = stringPattern.exec(mainPart);
    }

    // Build the line with highlighting
    let currentPos = 0;
    for (const strMatch of stringMatches) {
      // Text before string
      if (strMatch.start > currentPos) {
        const beforeText = mainPart.slice(currentPos, strMatch.start);
        const keywordParts = beforeText.split(keywordPattern);
        keywordParts.forEach((part) => {
          if (keywords.includes(part)) {
            parts.push(
              <span key={partKey++} className="text-amber-400">
                {part}
              </span>,
            );
          } else {
            parts.push(<span key={partKey++}>{part}</span>);
          }
        });
      }
      // The string itself
      parts.push(
        <span key={partKey++} className="text-orange-300">
          {strMatch.text}
        </span>,
      );
      currentPos = strMatch.end;
    }

    // Remaining text after last string
    if (currentPos < mainPart.length) {
      const remainingText = mainPart.slice(currentPos);
      const keywordParts = remainingText.split(keywordPattern);
      keywordParts.forEach((part) => {
        if (keywords.includes(part)) {
          parts.push(
            <span key={partKey++} className="text-amber-400">
              {part}
            </span>,
          );
        } else {
          parts.push(<span key={partKey++}>{part}</span>);
        }
      });
    }

    // Add comment if present
    if (commentPart) {
      parts.push(
        <span key={partKey++} className="text-neutral-500">
          {commentPart}
        </span>,
      );
    }

    const lineKey = `${line.slice(0, 20).replace(/\s/g, "_")}-${lineIndex}`;
    return (
      <div key={lineKey} className="leading-relaxed">
        {parts.length > 0 ? parts : "\u00A0"}
      </div>
    );
  });
}

// Code example with syntax highlighting
export function CodeExample({ code }: { code: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 overflow-hidden h-full w-full">
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="font-mono text-neutral-300 block">{highlightCode(code)}</code>
      </pre>
    </div>
  );
}

// Feature card
export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-8 bg-gradient-to-br from-neutral-900/30 to-neutral-950/30 border border-neutral-800/50">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-amber-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-neutral-100 mb-2">{title}</h3>
      <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
    </div>
  );
}

